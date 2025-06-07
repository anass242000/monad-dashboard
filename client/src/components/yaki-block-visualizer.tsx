import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BlockMetrics, Block } from "@/types/blockchain";

interface YakiBlockVisualizerProps {
  blockData?: BlockMetrics;
  recentBlocks?: Block[];
  soundEnabled: boolean;
  animationSpeed: number;
  isLoading: boolean;
  error?: Error | null;
}

export default function YakiBlockVisualizer({
  blockData,
  recentBlocks = [],
  soundEnabled,
  animationSpeed,
  isLoading,
  error
}: YakiBlockVisualizerProps) {
  const [yakiSpeed, setYakiSpeed] = useState<'slow' | 'normal' | 'fast' | 'turbo'>('normal');

  // Update YAKI speed based on TPS
  useEffect(() => {
    if (!blockData) return;

    const { blocksPerMinute } = blockData;
    
    if (blocksPerMinute > 40) {
      setYakiSpeed('turbo');
    } else if (blocksPerMinute > 25) {
      setYakiSpeed('fast');
    } else if (blocksPerMinute > 15) {
      setYakiSpeed('normal');
    } else {
      setYakiSpeed('slow');
    }
  }, [blockData]);

  const getSpeedText = () => {
    switch (yakiSpeed) {
      case 'turbo': return 'Turbo Runner';
      case 'fast': return 'Fast Runner';
      case 'normal': return 'Steady Pace';
      case 'slow': return 'Taking Breaks';
      default: return 'Steady Pace';
    }
  };

  const getSpeedColor = () => {
    switch (yakiSpeed) {
      case 'turbo': return 'text-red-400';
      case 'fast': return 'text-orange-400';
      case 'normal': return 'text-green-400';
      case 'slow': return 'text-blue-400';
      default: return 'text-green-400';
    }
  };

  const handleYakiRace = () => {
    if (soundEnabled) {
      console.log('🔊 YAKI race sound!');
    }
    
    const currentTps = blockData?.blocksPerMinute || 0;
    const raceResult = Math.random() > 0.5 ? 'wins' : 'loses';
    
    // Create visual race notification
    const raceEl = document.createElement('div');
    raceEl.className = 'fixed top-4 left-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse';
    raceEl.innerHTML = `
      <div class="font-bold">🦌 YAKI Speed Race</div>
      <div>Current: ${currentTps} blocks/min</div>
      <div>YAKI ${raceResult} the race!</div>
    `;
    document.body.appendChild(raceEl);
    
    setTimeout(() => {
      raceEl.remove();
    }, 3000);
  };

  if (error) {
    return (
      <Card className="glassmorphism-strong text-white metric-card">
        <CardContent className="p-6">
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              Failed to load block data: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism-strong text-white metric-card relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-purple-200">
            🦌 YAKI Block Visualizer
          </CardTitle>
          <Badge className={`${getSpeedColor()} bg-transparent border-current`}>
            Speed: {getSpeedText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* YAKI Character with Block Path */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`monanimal-character animate-block-jump`}
              style={{
                animationDuration: `${3 / animationSpeed}s`
              }}
            >
              🦌
            </div>
            
            {/* Block representations */}
            <div className="flex space-x-2">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-8 h-8 rounded" />
                ))
              ) : (
                recentBlocks.slice(0, 3).map((block, index) => (
                  <div
                    key={block.number}
                    className={`w-8 h-8 glassmorphism rounded border-2 flex items-center justify-center text-xs ${
                      index === 0 
                        ? 'border-green-400 animate-pulse' 
                        : index === 1 
                        ? 'border-purple-400' 
                        : 'border-gray-600'
                    }`}
                  >
                    {block.number.toString().slice(-2)}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Block production metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-amber-400">
                    {blockData?.avgBlockTime.toFixed(1) || '0.0'}s
                  </div>
                  <div className="text-sm text-purple-300">Avg Block Time</div>
                </>
              )}
            </div>
            <div className="text-center">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-12 mx-auto mb-1" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-400">
                    {blockData?.blocksPerMinute || 0}
                  </div>
                  <div className="text-sm text-purple-300">Blocks/Min</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Block Rain Animation */}
        <div className="glassmorphism p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-purple-300 mb-2">Latest Blocks</h3>
          {isLoading ? (
            <div className="space-y-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          ) : recentBlocks.length === 0 ? (
            <div className="text-center py-4 text-sm opacity-60">
              No recent blocks available
            </div>
          ) : (
            <div className="space-y-1">
              {recentBlocks.slice(0, 3).map((block, index) => (
                <div
                  key={block.number}
                  className="flex items-center justify-between text-xs animate-slide-in cursor-pointer hover:bg-white/10 p-1 rounded transition-all"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => window.open(`https://testnet.monadexplorer.com/block/${block.number}`, '_blank')}
                  title="Click to view block on Monad Explorer"
                >
                  <span className="font-mono text-purple-200">
                    #{block.number.toLocaleString()}
                  </span>
                  <span className="text-green-400">
                    {block.transactionCount} txs
                  </span>
                  <span className="text-purple-300">
                    {block.timestamp ? `${Math.floor((Date.now() - block.timestamp) / 1000)}s ago` : 'Now'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Feature */}
        <Button
          onClick={handleYakiRace}
          className="w-full glassmorphism hover:bg-white/20 transition-all"
          variant="ghost"
        >
          🏃‍♂️ YAKI Speed Race vs Current TPS!
        </Button>
      </CardContent>
    </Card>
  );
}
