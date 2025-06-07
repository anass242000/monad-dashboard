import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { NetworkMetrics } from "@/types/blockchain";

interface NetworkVitalSignsProps {
  networkData?: NetworkMetrics;
  isLoading: boolean;
  error?: Error | null;
}

export default function NetworkVitalSigns({
  networkData,
  isLoading,
  error
}: NetworkVitalSignsProps) {
  const getHealthColor = (health?: string) => {
    switch (health) {
      case 'excellent': return 'text-green-400 border-green-400';
      case 'good': return 'text-yellow-400 border-yellow-400';
      case 'slow': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getTpsProgress = (tps?: number) => {
    if (!tps) return 0;
    // Assuming max expected TPS is 1000 for visual representation
    return Math.min((tps / 1000) * 100, 100);
  };

  const getGasProgress = (gasPrice?: number) => {
    if (!gasPrice) return 0;
    // Assuming max expected gas is 100 gwei for visual representation
    return Math.min((gasPrice / 100) * 100, 100);
  };

  if (error) {
    return (
      <Card className="glassmorphism-strong text-white metric-card">
        <CardContent className="p-6">
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              Failed to load network data: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism-strong text-white metric-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-purple-200">
            📊 Network Vital Signs
          </CardTitle>
          {isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <Badge className={`${getHealthColor(networkData?.health)} bg-transparent border`}>
              {networkData?.health || 'Unknown'}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Block Height and TPS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-24 mx-auto mb-1" />
                <Skeleton className="h-4 w-20 mx-auto mb-2" />
                <Skeleton className="h-2 w-full" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-white">
                  {networkData?.blockHeight.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-purple-300 mb-2">Current Block</div>
                <Progress 
                  value={85} 
                  className="bg-purple-700/50"
                />
                <div className="text-xs text-purple-300 mt-1 flex items-center justify-center">
                  <TrendingUp size={12} className="mr-1" />
                  Climbing
                </div>
              </>
            )}
          </div>
          
          <div className="text-center">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mx-auto mb-1" />
                <Skeleton className="h-4 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-400">
                  {networkData?.tps.toFixed(1) || '0.0'}
                </div>
                <div className="text-sm text-purple-300 mb-2">TPS</div>
                <Progress 
                  value={getTpsProgress(networkData?.tps)} 
                  className="bg-purple-700/50"
                />
                <div className="text-xs text-purple-300 mt-1">
                  Avg: {networkData?.avgTps?.toFixed(1) || '0.0'}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Gas Price Chart */}
        <div className="glassmorphism p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-purple-300">Gas Price Trends</span>
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-sm text-amber-400">
                {networkData?.gasPrice.toFixed(1) || '0.0'} gwei
              </span>
            )}
          </div>
          
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="h-24 bg-white/10 rounded-lg flex items-end p-2">
              {/* Simple bar chart representation */}
              <div className="flex items-end justify-between w-full h-full">
                {networkData?.gasPriceHistory?.map((price, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-sm"
                    style={{
                      height: `${(price / Math.max(...(networkData.gasPriceHistory || [1]))) * 100}%`,
                      width: `${100 / (networkData.gasPriceHistory || []).length - 2}%`
                    }}
                  />
                )) || (
                  <div className="text-xs text-purple-300 text-center w-full">
                    No gas price history available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-green-400">
                  {networkData?.avgBlockTime.toFixed(1) || '0.0'}s
                </div>
                <div className="text-xs text-purple-300">Block Time</div>
              </>
            )}
          </div>
          
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-purple-300">
                  {networkData?.pendingTx || 0}
                </div>
                <div className="text-xs text-purple-300">Pending</div>
              </>
            )}
          </div>
          
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-yellow-400">
                  {networkData?.validatorCount || 0}
                </div>
                <div className="text-xs text-purple-300">Validators</div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
