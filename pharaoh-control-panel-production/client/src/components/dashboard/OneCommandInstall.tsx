import { useState } from "react";

export default function OneCommandInstall() {
  const [copied, setCopied] = useState(false);
  const installCommand = "curl -sL https://get.pharaoh.ai | bash";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-dark-900 rounded-lg border border-dark-700 p-4 fade-in" style={{ animationDelay: "0.2s" }}>
      <h2 className="font-semibold mb-3 flex items-center">
        <span className="material-icons text-primary-400 mr-2">rocket_launch</span>
        One-Command Installation
      </h2>
      <p className="text-sm text-gray-400 mb-4">Deploy Pharaoh on any server in just 90 seconds</p>
      
      <div className="bg-dark-1000 rounded-md p-3 font-mono text-sm border border-dark-700 mb-4 relative group">
        <code className="text-gray-300">{installCommand}</code>
        <button 
          onClick={copyToClipboard}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-800 hover:bg-dark-700 rounded p-1"
        >
          <span className="material-icons text-sm text-gray-400">
            {copied ? "check" : "content_copy"}
          </span>
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <a href="#" className="text-primary-400 hover:text-primary-300 text-sm flex items-center">
          <span className="material-icons text-sm mr-1">open_in_new</span>
          View documentation
        </a>
        <span className="text-xs text-gray-500">OS: Linux, MacOS</span>
      </div>
    </div>
  );
}
