import React, { useState } from 'react';
import { UserProfile, ThemeType, SocialPlatform } from '../types';
import { Copy, Check, Download } from 'lucide-react';

const JsonGenerator: React.FC = () => {
  const [username, setUsername] = useState('john_doe');
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const generateJson = () => {
    const template: UserProfile = {
      username: username.toLowerCase().replace(/\s/g, '_'),
      displayName: "Your Name",
      bio: "This is your bio. Tell the world who you are.",
      avatarUrl: "https://picsum.photos/300/300",
      theme: {
        type: ThemeType.SunsetVibe
      },
      socials: [
        { platform: SocialPlatform.Instagram, url: "https://instagram.com/yourhandle" },
        { platform: SocialPlatform.Github, url: "https://github.com/yourhandle" }
      ],
      links: [
        {
          id: "1",
          title: "My Portfolio",
          url: "https://example.com",
          icon: "Globe"
        },
        {
          id: "2",
          title: "Featured Video",
          url: "https://youtube.com/watch?v=...",
          featured: true,
          thumbnail: "https://picsum.photos/600/300",
          description: "Watch my latest creation"
        }
      ],
      projects: [
        {
            id: "p1",
            title: "Project One",
            description: "Visual project",
            thumbnail: "https://picsum.photos/600/400",
            url: "https://github.com/yourhandle/project-1",
            tags: ["React", "UI"]
        },
        {
            id: "p2",
            title: "Project Two",
            description: "Icon based",
            icon: "Rocket",
            url: "https://github.com/yourhandle/project-2",
            tags: ["Backend", "Node"]
        }
      ]
    };
    setGenerated(JSON.stringify(template, null, 2));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Configuration Generator</h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Since BioLinker doesn't use a database, you control your data with a simple JSON file. 
          Generate a template below, edit it, and upload it to:
        </p>
        <code className="block mt-4 p-3 bg-gray-100 rounded text-sm text-indigo-600 font-mono">
          public/profiles/{username || '{username}'}/db.json
        </code>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Desired Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. johndoe"
            />
          </div>

          <button
            onClick={generateJson}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-200"
          >
            Generate Template
          </button>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
             <h4 className="font-semibold text-blue-800 mb-2 text-sm">Instructions</h4>
             <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                <li>Enter your desired username.</li>
                <li>Click Generate.</li>
                <li>Create a folder in <code>public/profiles/</code> with your username.</li>
                <li>Create a file named <code>db.json</code> inside it.</li>
                <li>Paste the JSON content.</li>
             </ol>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-4 right-4 flex gap-2">
             <button
                onClick={handleCopy}
                disabled={!generated}
                className="p-2 bg-white/10 hover:bg-white/20 text-gray-500 hover:text-gray-800 rounded transition-colors"
                title="Copy to Clipboard"
             >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
             </button>
          </div>
          <textarea
            readOnly
            value={generated}
            placeholder="JSON output will appear here..."
            className="w-full h-[400px] p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-xl resize-none outline-none shadow-inner"
          />
        </div>
      </div>
    </div>
  );
};

export default JsonGenerator;