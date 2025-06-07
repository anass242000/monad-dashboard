import { useState, useRef, useEffect } from "react";
import { GasPricePoint } from "@/types/blockchain";

interface InteractiveGasChartProps {
  gasPriceHistory: GasPricePoint[];
  currentGasPrice: number;
  isLoading: boolean;
}

export default function InteractiveGasChart({
  gasPriceHistory,
  currentGasPrice,
  isLoading
}: InteractiveGasChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<GasPricePoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  if (isLoading || gasPriceHistory.length === 0) {
    return (
      <div className="h-24 bg-white/10 rounded-lg flex items-center justify-center">
        <div className="text-xs text-purple-300">
          {isLoading ? "Loading gas price data..." : "No gas price history available"}
        </div>
      </div>
    );
  }

  const maxPrice = Math.max(...gasPriceHistory.map(p => p.price), currentGasPrice);
  const minPrice = Math.min(...gasPriceHistory.map(p => p.price), currentGasPrice);
  const priceRange = maxPrice - minPrice || 1;

  const handleMouseMove = (event: React.MouseEvent, point: GasPricePoint, index: number) => {
    const rect = chartRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
      setHoveredPoint(point);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative">
      <div 
        ref={chartRef}
        className="h-24 bg-white/10 rounded-lg p-2 relative overflow-hidden"
        onMouseLeave={handleMouseLeave}
      >
        {/* Chart Background Grid */}
        <div className="absolute inset-0 opacity-20">
          {[0, 25, 50, 75, 100].map(percentage => (
            <div
              key={percentage}
              className="absolute w-full border-b border-purple-400"
              style={{ bottom: `${percentage}%` }}
            />
          ))}
        </div>

        {/* Gas Price Line Chart */}
        <div className="relative h-full flex items-end justify-between">
          {gasPriceHistory.map((point, index) => {
            const height = ((point.price - minPrice) / priceRange) * 100;
            const isLast = index === gasPriceHistory.length - 1;
            
            return (
              <div key={index} className="relative flex-1 h-full flex items-end justify-center">
                {/* Chart Bar */}
                <div
                  className={`w-1 bg-gradient-to-t transition-all duration-200 cursor-pointer ${
                    isLast 
                      ? 'from-green-600 to-green-400 animate-pulse' 
                      : 'from-purple-600 to-purple-400'
                  } hover:from-yellow-600 hover:to-yellow-400`}
                  style={{ height: `${Math.max(height, 2)}%` }}
                  onMouseMove={(e) => handleMouseMove(e, point, index)}
                />
                
                {/* Connection Line to Next Point */}
                {index < gasPriceHistory.length - 1 && (
                  <div
                    className="absolute top-0 w-full h-px bg-purple-400 opacity-50"
                    style={{
                      bottom: `${height}%`,
                      right: '-50%'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-black/80 text-white p-2 rounded text-xs pointer-events-none z-10 backdrop-blur-sm"
            style={{
              left: Math.min(mousePosition.x + 10, (chartRef.current?.clientWidth || 0) - 120),
              top: Math.max(mousePosition.y - 50, 0)
            }}
          >
            <div className="font-semibold">{hoveredPoint.price.toFixed(2)} gwei</div>
            <div className="text-purple-300">{formatTime(hoveredPoint.timestamp)}</div>
            <div className="text-xs text-gray-400">
              {Math.abs(Date.now() - hoveredPoint.timestamp) < 300000 ? 'Recent' : 'Historical'}
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex justify-between items-center mt-2 text-xs text-purple-300">
        <span>2h ago</span>
        <span className="text-center">Gas Price Trends</span>
        <span>Now</span>
      </div>
      
      {/* Current vs Average Comparison */}
      <div className="flex justify-between items-center mt-1 text-xs">
        <span className="text-purple-300">
          Avg: {gasPriceHistory.length > 0 ? 
            (gasPriceHistory.reduce((sum, p) => sum + p.price, 0) / gasPriceHistory.length).toFixed(1) 
            : '0.0'} gwei
        </span>
        <span className={`font-semibold ${
          currentGasPrice > (gasPriceHistory.reduce((sum, p) => sum + p.price, 0) / gasPriceHistory.length) 
            ? 'text-red-400' 
            : 'text-green-400'
        }`}>
          Current: {currentGasPrice.toFixed(1)} gwei
        </span>
      </div>
    </div>
  );
}