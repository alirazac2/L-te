
/**
 * Browser-based Solidity Compiler Service (Web Worker Implementation).
 * Runs the Solc binary in a background thread to avoid freezing the UI.
 */

const SOLC_VERSION = 'v0.8.26+commit.8a97fa7a';
const SOLC_URL = `https://binaries.soliditylang.org/bin/soljson-${SOLC_VERSION}.js`;

// Worker Code as a string to avoid external file dependencies in this environment
const WORKER_SCRIPT = `
    const SOLC_URL = '${SOLC_URL}';
    
    // Import the Solidity Compiler Binary
    importScripts(SOLC_URL);

    self.onmessage = function(e) {
        const { id, sourceCode } = e.data;

        try {
            if (!self.Module) {
                throw new Error("Compiler module not loaded yet.");
            }

            // Wait for runtime if needed (though importScripts usually blocks until loaded)
            const compile = () => {
                const wrapper = self.Module.cwrap('solidity_compile', 'string', ['string', 'number']);
                
                const input = {
                    language: 'Solidity',
                    sources: {
                        'Contract.sol': {
                            content: sourceCode
                        }
                    },
                    settings: {
                        outputSelection: {
                            '*': {
                                '*': ['abi', 'evm.bytecode']
                            }
                        },
                        optimizer: {
                            enabled: true,
                            runs: 200
                        }
                    }
                };

                const outputString = wrapper(JSON.stringify(input));
                const output = JSON.parse(outputString);
                
                self.postMessage({ id, success: true, output });
            };

            // Check if Emscripten runtime is ready
            if (self.Module.onRuntimeInitialized) {
                 // It might be waiting for init
                 const originalInit = self.Module.onRuntimeInitialized;
                 self.Module.onRuntimeInitialized = () => {
                     originalInit();
                     compile();
                 };
                 // If already initialized but callback wasn't set yet?
                 // Usually cwrap works immediately after script load for solc-js versions
                 if (!self.Module.calledRun) compile(); 
            } else {
                compile();
            }

        } catch (error) {
            self.postMessage({ id, success: false, error: error.message || "Unknown Worker Error" });
        }
    };
`;

interface ContractArtifact {
    abi: any[];
    bytecode: string;
}

let worker: Worker | null = null;
const pendingRequests = new Map<string, { resolve: (val: any) => void, reject: (err: any) => void }>();

/**
 * Initialize the Compiler Worker
 */
const initWorker = () => {
    if (worker) return;

    const blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
        const { id, success, output, error } = e.data;
        const request = pendingRequests.get(id);
        
        if (request) {
            if (success) {
                request.resolve(output);
            } else {
                request.reject(new Error(error));
            }
            pendingRequests.delete(id);
        }
    };

    worker.onerror = (e) => {
        console.error("Worker Error:", e);
    };
};

/**
 * Compiles Solidity source code using the background worker.
 */
export const compileSource = async (sourceCode: string): Promise<ContractArtifact> => {
    initWorker();

    return new Promise((resolve, reject) => {
        const id = Date.now().toString() + Math.random().toString();
        
        // Timeout to prevent hanging forever
        const timeout = setTimeout(() => {
            if (pendingRequests.has(id)) {
                pendingRequests.delete(id);
                reject(new Error("Compilation timed out. The compiler might be downloading or the contract is too complex."));
            }
        }, 60000); // 60s timeout for download + compile

        pendingRequests.set(id, { 
            resolve: (output: any) => {
                clearTimeout(timeout);
                
                // Process Output
                if (output.errors) {
                    const errors = output.errors.filter((e: any) => e.severity === 'error');
                    if (errors.length > 0) {
                        const errorMsg = errors.map((e: any) => e.formattedMessage).join('\n');
                        reject(new Error(`Compilation Failed:\n${errorMsg}`));
                        return;
                    }
                }

                const sources = output.contracts?.['Contract.sol'];
                if (!sources) {
                    reject(new Error("No contract found in source code."));
                    return;
                }

                const contractName = Object.keys(sources)[0];
                const contract = sources[contractName];

                resolve({
                    abi: contract.abi,
                    bytecode: contract.evm.bytecode.object
                });
            }, 
            reject: (err) => {
                clearTimeout(timeout);
                reject(err);
            }
        });

        worker?.postMessage({ id, sourceCode });
    });
};
