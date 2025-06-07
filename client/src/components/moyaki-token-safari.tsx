import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { TokenMetrics, SwapActivity } from "@/types/blockchain";

interface MoyakiTokenSafariProps {
  tokenData?: TokenMetrics;
  swapActivity?: SwapActivity;
  soundEnabled: boolean;
  animationSpeed: number;
  isLoading: boolean;
  error?: Error | null;
}

export default function MoyakiTokenSafari({
  tokenData,
  swapActivity,
  soundEnabled,
  animationSpeed,
  isLoading,
  error
}: MoyakiTokenSafariProps) {
  const [moyakiMood, setMoyakiMood] = useState<'sleeping' | 'feeding' | 'full'>('feeding');
  const [moyakiScale, setMoyakiScale] = useState(1);

  // Update MOYAKI mood and size based on gas usage
  useEffect(() => {
    if (!tokenData) return;

    const { gasUsed24h } = tokenData;
    
    if (gasUsed24h > 50000000) {
      setMoyakiMood('full');
      setMoyakiScale(1.3);
    } else if (gasUsed24h > 10000000) {
      setMoyakiMood('feeding');
      setMoyakiScale(1.1);
    } else {
      setMoyakiMood('sleeping');
      setMoyakiScale(0.9);
    }
  }, [tokenData]);

  const getMoodText = () => {
    switch (moyakiMood) {
      case 'full': return 'Well Fed';
      case 'feeding': return 'Feeding';
      case 'sleeping': return 'Sleeping';
      default: return 'Feeding';
    }
  };

  const getMoodColor = () => {
    switch (moyakiMood) {
      case 'full': return 'text-green-400';
      case 'feeding': return 'text-yellow-400';
      case 'sleeping': return 'text-blue-400';
      default: return 'text-yellow-400';
    }
  };

  const handleFeedMoyaki = () => {
    if (soundEnabled) {
      console.log('🔊 MOYAKI feeding sound!');
    }
    
    const gasEffect = Math.random() > 0.5 ? 'decreasing' : 'increasing';
    const gasChange = (Math.random() * 5 + 1).toFixed(1);
    
    // Create visual feeding notification
    const feedEl = document.createElement('div');
    feedEl.className = 'fixed top-4 center-4 bg-yellow-600 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce';
    feedEl.style.left = '50%';
    feedEl.style.transform = 'translateX(-50%)';
    feedEl.innerHTML = `
      <div class="font-bold">🦘 MOYAKI Fed!</div>
      <div>Gas prices ${gasEffect}</div>
      <div>Change: ${gasChange} gwei</div>
    `;
    document.body.appendChild(feedEl);
    
    setTimeout(() => {
      feedEl.remove();
    }, 3000);
  };

  if (error) {
    return (
      <Card className="glassmorphism-strong text-white metric-card">
        <CardContent className="p-6">
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              Failed to load token data: {error.message}
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
            🦘 MOYAKI Token Safari
          </CardTitle>
          <Badge className={`${getMoodColor()} bg-transparent border-current`}>
            Mood: {getMoodText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* MOYAKI Character */}
        <div className="text-center">
          <div
            className={`monanimal-character ${moyakiMood === 'full' ? 'animate-bounce-slow' : moyakiMood === 'sleeping' ? 'animate-pulse' : 'animate-float'}`}
            style={{
              transform: `scale(${moyakiScale})`,
              animationDuration: `${3 / animationSpeed}s`
            }}
          >
            🦘
          </div>
          <div className="mt-2">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-20 mx-auto mb-1" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-yellow-400">
                  {tokenData?.currentGasPrice.toFixed(1) || '0.0'} gwei
                </div>
                <div className="text-sm text-purple-300">Current Gas Price</div>
              </>
            )}
          </div>
        </div>

        {/* Token Price Feeds */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-purple-300">Live Token Prices</h3>
          
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center glassmorphism rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))
          ) : tokenData?.tokenPairs.length === 0 ? (
            <div className="text-center py-4 text-sm opacity-60">
              No token data available
            </div>
          ) : (
            tokenData?.tokenPairs.map((pair, index) => (
              <div
                key={pair.symbol}
                className="flex justify-between items-center bg-white/10 rounded-lg p-3 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-purple-200">{pair.symbol}</span>
                  <span className={`text-xs flex items-center ${
                    pair.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {pair.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(1)}%
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-white">
                    ${pair.price.toFixed(4)}
                  </div>
                  <div className="text-xs text-purple-300">
                    Vol: {(pair.volume24h / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            )) || []
          )}
        </div>

        {/* Swap Activity */}
        <div className="glassmorphism p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-purple-300">Total Swaps Today</span>
            {isLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <span className="font-bold text-purple-300">
                {swapActivity?.totalSwaps.toLocaleString() || '0'}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-purple-300">Gas Used (24h)</span>
            {isLoading ? (
              <Skeleton className="h-5 w-16" />
            ) : (
              <span className="font-bold text-yellow-400">
                {tokenData?.gasUsed24h ? `${(tokenData.gasUsed24h / 1000000).toFixed(1)}M` : '0M'}
              </span>
            )}
          </div>
        </div>

        {/* Interactive Feature */}
        <Button
          onClick={handleFeedMoyaki}
          className="w-full glassmorphism hover:bg-white/20 transition-all"
          variant="ghost"
        >
          🍖 Feed MOYAKI - Watch Gas Prices React!
        </Button>
      </CardContent>
    </Card>
  );
}
