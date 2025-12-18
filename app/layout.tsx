import type { Metadata } from "next";
import "./globals.css";
import { AppKitProvider } from "../components/AppKitProvider";

export const metadata: Metadata = {
    title: "BioLinker OnChain",
    description: "A high-performance Link-in-Bio application driven by on-chain data.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
            </head>
            <body>
                <AppKitProvider>
                    {children}
                </AppKitProvider>
            </body>
        </html>
    );
}
