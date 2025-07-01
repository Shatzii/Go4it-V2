import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RealTimeAnalytics from "@/components/advanced/real-time-analytics";
import CodeShowcase from "@/components/advanced/code-showcase";
import TechStackVisualizer from "@/components/advanced/tech-stack-visualizer";
import PerformanceMetrics from "@/components/advanced/performance-metrics";
import { ProfessionalChart, ProfessionalCpu, ProfessionalDatabase, ProfessionalActivity } from "@/components/ui/professional-icons";

export default function DeveloperShowcase() {
  return (
    <section id="tech-showcase" className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900 relative overflow-hidden">
      {/* Matrix-style background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wide mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></span>
            Neural Architecture Hub
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Quantum</span> Development Matrix
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Live neural network telemetry from our quantum processing cores. Real-time data streams from 
            enterprise-grade AI systems operating across global infrastructure networks.
          </p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-1">
            <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
              <ProfessionalChart className="w-4 h-4" />
              <span>Neural Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
              <ProfessionalCpu className="w-4 h-4" />
              <span>Code Matrix</span>
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
              <ProfessionalDatabase className="w-4 h-4" />
              <span>Core Systems</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
              <ProfessionalActivity className="w-4 h-4" />
              <span>Quantum Metrics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-Time System Analytics</h3>
              <p className="text-gray-600">Live data streaming from our production AI infrastructure</p>
            </div>
            <RealTimeAnalytics />
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Production Code Architecture</h3>
              <p className="text-gray-600">Actual implementation from our enterprise-grade systems</p>
            </div>
            <CodeShowcase />
          </TabsContent>

          <TabsContent value="infrastructure" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Infrastructure Topology</h3>
              <p className="text-gray-600">Real-time visualization of our distributed AI systems</p>
            </div>
            <TechStackVisualizer />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Performance Metrics</h3>
              <p className="text-gray-600">Live performance data from our edge computing network</p>
            </div>
            <PerformanceMetrics />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="glass-morphism p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
                <div className="text-sm text-gray-600">Global Edge Nodes</div>
              </div>
              <div className="glass-morphism p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">2.1M</div>
                <div className="text-sm text-gray-600">AI Inferences/Hour</div>
              </div>
              <div className="glass-morphism p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">$0</div>
                <div className="text-sm text-gray-600">API Costs Saved</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Production Systems</span> • 
              <span className="font-semibold text-gray-900">Real-Time Data</span> • 
              <span className="font-semibold text-gray-900">Enterprise Scale</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}