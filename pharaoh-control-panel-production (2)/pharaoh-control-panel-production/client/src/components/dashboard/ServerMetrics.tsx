import { Skeleton } from "@/components/ui/skeleton";
import { ServerPerformanceData } from "@shared/types";

interface ServerMetricsProps {
  isLoading: boolean;
  performanceData?: ServerPerformanceData;
}

export default function ServerMetrics({ isLoading, performanceData }: ServerMetricsProps) {
  // Default data for the chart if not provided
  const timeLabels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"];

  return (
    <div className="bg-dark-900 rounded-lg border border-dark-700 p-4 fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Server Performance</h2>
        <div className="flex items-center space-x-2">
          <button className="bg-dark-800 hover:bg-dark-700 px-2 py-1 rounded text-sm text-gray-300">1H</button>
          <button className="bg-primary-600 px-2 py-1 rounded text-sm text-white">24H</button>
          <button className="bg-dark-800 hover:bg-dark-700 px-2 py-1 rounded text-sm text-gray-300">7D</button>
          <button className="text-gray-400 hover:text-white">
            <span className="material-icons">more_vert</span>
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : (
        <div className="chart-container">
          <div className="h-full flex items-end pb-8 relative">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
              {/* Grid lines */}
              <div className="col-span-6 border-b border-dark-700"></div>
              <div className="col-span-6 border-b border-dark-700"></div>
              <div className="col-span-6 border-b border-dark-700"></div>
              <div className="col-span-6 border-b border-dark-700"></div>
            </div>
            
            {/* X axis labels */}
            <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-500 px-2">
              {timeLabels.map((label, idx) => (
                <span key={idx}>{label}</span>
              ))}
            </div>
            
            {/* Y axis labels */}
            <div className="absolute left-0 h-full flex flex-col justify-between text-xs text-gray-500 py-1">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            
            {/* Chart lines approximation */}
            <div className="w-full h-full flex items-end pl-8">
              {/* CPU line (secondary color) */}
              <svg className="absolute inset-0 mt-4 mb-8 ml-8" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 100 100">
                <path d="M0,70 C10,65 20,40 30,45 C40,50 50,30 60,35 C70,40 80,25 90,30 L100,40" fill="none" stroke="hsl(175, 84%, 46%)" strokeWidth="2.5">
                  <animate attributeName="stroke-dasharray" from="0,500" to="500,0" dur="2s" begin="0s" fill="freeze" />
                </path>
              </svg>
              
              {/* Memory line (accent color) */}
              <svg className="absolute inset-0 mt-4 mb-8 ml-8" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 100 100">
                <path d="M0,50 C10,55 20,60 30,55 C40,50 50,65 60,68 C70,70 80,65 90,68 L100,70" fill="none" stroke="hsl(210, 100%, 60%)" strokeWidth="2.5">
                  <animate attributeName="stroke-dasharray" from="0,500" to="500,0" dur="2s" begin="0.3s" fill="freeze" />
                </path>
              </svg>
              
              {/* Network traffic line (indigo color) */}
              <svg className="absolute inset-0 mt-4 mb-8 ml-8" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 100 100">
                <path d="M0,85 C10,80 20,75 30,65 C40,60 50,75 60,55 C70,35 80,45 90,40 L100,30" fill="none" stroke="hsl(225, 73%, 57%)" strokeWidth="2.5">
                  <animate attributeName="stroke-dasharray" from="0,500" to="500,0" dur="2s" begin="0.6s" fill="freeze" />
                </path>
              </svg>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 mr-2"></span>
          <span className="text-sm text-gray-300">CPU</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 mr-2"></span>
          <span className="text-sm text-gray-300">Memory</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 mr-2"></span>
          <span className="text-sm text-gray-300">Network</span>
        </div>
      </div>
    </div>
  );
}
