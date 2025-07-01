import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function DownloadAI() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("linux");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    document.title = "Download Pharaoh AI Engine | Pharaoh Control Panel 2.0";
  }, []);

  const { data: aiInfo, isLoading, isError } = useQuery({
    queryKey: ['/api/ai/download-info'],
    refetchOnWindowFocus: false
  });

  const handleDownload = () => {
    window.open('/api/ai/download-model', '_blank');
    toast({
      title: "Download Started",
      description: "The Pharaoh AI Engine is being downloaded. This may take some time.",
    });
  };

  const installInstructions = {
    linux: [
      "1. Open Terminal and navigate to the downloaded file",
      "2. Extract with: `tar -xzf pharaoh-ai-engine.tar.gz`",
      "3. Enter the directory: `cd pharaoh-ai-engine`",
      "4. Run the install script: `sudo ./install.sh`",
      "5. Start the service: `sudo systemctl start pharaoh-ai`",
      "6. Configure the connection: `pharaoh-ai setup --server=your-panel-url`"
    ],
    macos: [
      "1. Open the downloaded .dmg file",
      "2. Drag the Pharaoh AI Engine to your Applications folder",
      "3. Open the application",
      "4. Follow the setup wizard to configure your Pharaoh Control Panel connection",
      "5. When prompted, enter your API key from the control panel"
    ],
    windows: [
      "1. Run the downloaded installer (.exe file)",
      "2. Follow the installation wizard",
      "3. After installation completes, launch the Pharaoh AI Engine",
      "4. Enter your Pharaoh Control Panel URL and API key when prompted",
      "5. The engine will start running as a system service"
    ]
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-dark-1000 text-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-dark-1000">
        <TopNav toggleSidebar={toggleSidebar} />
        
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">Download Pharaoh AI Engine</h1>
            <p className="text-gray-400 mt-1">Install the local AI engine to enable advanced server management features</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : isError ? (
            <Card className="bg-dark-900 border-dark-700">
              <CardContent className="p-8">
                <div className="text-center">
                  <span className="material-icons text-4xl text-red-500 mb-4">error</span>
                  <h3 className="text-xl font-semibold mb-2">Failed to Load Information</h3>
                  <p className="text-gray-400 mb-4">
                    We couldn't load the download information. Please try refreshing the page.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-dark-900 border-dark-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Pharaoh AI Engine</CardTitle>
                        <CardDescription>Version {aiInfo?.version}</CardDescription>
                      </div>
                      <Badge className="bg-primary-900 text-primary-300">
                        {aiInfo?.size}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <p className="text-gray-300 mb-4">
                        {aiInfo?.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                          <div className="text-sm text-gray-400 mb-1">CPU</div>
                          <div className="font-medium">{aiInfo?.systemRequirements.cpu}</div>
                        </div>
                        <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                          <div className="text-sm text-gray-400 mb-1">RAM</div>
                          <div className="font-medium">{aiInfo?.systemRequirements.ram}</div>
                        </div>
                        <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                          <div className="text-sm text-gray-400 mb-1">Disk Space</div>
                          <div className="font-medium">{aiInfo?.systemRequirements.disk}</div>
                        </div>
                        <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                          <div className="text-sm text-gray-400 mb-1">Supported OS</div>
                          <div className="font-medium">{aiInfo?.systemRequirements.os.join(", ")}</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {aiInfo?.features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <span className="material-icons text-secondary-500 mr-2">check_circle</span>
                              <span className="text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <Button 
                        className="w-64 h-12 bg-primary-600 hover:bg-primary-700"
                        onClick={handleDownload}
                      >
                        <span className="material-icons mr-2">download</span>
                        Download AI Engine
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        By downloading, you agree to our terms of service.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-dark-900 border-dark-700">
                  <CardHeader>
                    <CardTitle>Installation Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="linux" onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="linux" className="flex items-center">
                          <span className="material-icons mr-1 text-sm">computer</span>
                          Linux
                        </TabsTrigger>
                        <TabsTrigger value="macos" className="flex items-center">
                          <span className="material-icons mr-1 text-sm">desktop_mac</span>
                          macOS
                        </TabsTrigger>
                        <TabsTrigger value="windows" className="flex items-center">
                          <span className="material-icons mr-1 text-sm">window</span>
                          Windows
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="linux">
                        <div className="bg-dark-800 p-3 rounded-lg border border-dark-700 font-mono text-sm text-gray-300 space-y-2">
                          {installInstructions.linux.map((step, index) => (
                            <p key={index}>{step}</p>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="macos">
                        <div className="bg-dark-800 p-3 rounded-lg border border-dark-700 font-mono text-sm text-gray-300 space-y-2">
                          {installInstructions.macos.map((step, index) => (
                            <p key={index}>{step}</p>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="windows">
                        <div className="bg-dark-800 p-3 rounded-lg border border-dark-700 font-mono text-sm text-gray-300 space-y-2">
                          {installInstructions.windows.map((step, index) => (
                            <p key={index}>{step}</p>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
                <Card className="bg-dark-900 border-dark-700 mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Why Run Locally?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="material-icons text-primary-400 mr-2 mt-0.5">shield</span>
                        <div>
                          <p className="font-medium">Privacy & Security</p>
                          <p className="text-xs text-gray-400">Your server logs and data never leave your network</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="material-icons text-primary-400 mr-2 mt-0.5">bolt</span>
                        <div>
                          <p className="font-medium">Faster Response Time</p>
                          <p className="text-xs text-gray-400">No network latency for critical self-healing operations</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="material-icons text-primary-400 mr-2 mt-0.5">wifi_off</span>
                        <div>
                          <p className="font-medium">Works Offline</p>
                          <p className="text-xs text-gray-400">Maintains functionality even without internet connection</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <Card className="bg-dark-900 border-dark-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">How does the local AI engine work?</h3>
                    <p className="text-sm text-gray-400">
                      The Pharaoh AI Engine runs a quantized version of Llama 3 8B optimized for server management tasks. It processes logs and system information locally, then communicates with your Pharaoh Control Panel to display insights and take actions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Will it use a lot of resources?</h3>
                    <p className="text-sm text-gray-400">
                      The engine is optimized to use minimal resources during idle time. During active analysis, it will temporarily use more CPU and RAM, but is designed to yield to other processes when the system is under load.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">How often is the AI model updated?</h3>
                    <p className="text-sm text-gray-400">
                      We release updates quarterly with improvements to the AI model's capabilities and performance. These updates are automatically downloaded and applied when you have an active Pro subscription.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Can I customize what the AI monitors?</h3>
                    <p className="text-sm text-gray-400">
                      Yes, you can configure monitoring parameters, alert thresholds, and which services the AI should prioritize through the Control Panel's Settings page after installation.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-dark-700 pt-4">
                <Button variant="outline" className="w-full">
                  <span className="material-icons mr-2 text-sm">support_agent</span>
                  Contact Support for Installation Help
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}