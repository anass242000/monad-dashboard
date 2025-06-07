import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TransactionMetrics, Transaction } from "@/types/blockchain";

interface ChogTransactionZoneProps {
  transactionData?: TransactionMetrics;
  recentTransactions?: Transaction[];
  soundEnabled: boolean;
  animationSpeed: number;
  isLoading: boolean;
  error?: Error | null;
}

export default function ChogTransactionZone({
  transactionData,
  recentTransactions = [],
  soundEnabled,
  animationSpeed,
  isLoading,
  error
}: ChogTransactionZoneProps) {
  const [chogMood, setChogMood] = useState<'sleeping' | 'happy' | 'excited'>('happy');
  const [chogScale, setChogScale] = useState(1);

  // Update CHOG mood and size based on transaction activity
  useEffect(() => {
    if (!transactionData) return;

    const { tps, totalTransactions } = transactionData;
    
    if (tps > 20) {
      setChogMood('excited');
      setChogScale(1.2);
    } else if (tps > 5) {
      setChogMood('happy');
      setChogScale(1);
    } else {
      setChogMood('sleeping');
      setChogScale(0.8);
    }
  }, [transactionData]);

  const getMoodText = () => {
    switch (chogMood) {
      case 'excited': return 'Excited';
      case 'happy': return 'Happy';
      case 'sleeping': return 'Sleepy';
      default: return 'Happy';
    }
  };

  const getMoodColor = () => {
    switch (chogMood) {
      case 'excited': return 'text-green-400';
      case 'happy': return 'text-yellow-400';
      case 'sleeping': return 'text-blue-400';
      default: return 'text-yellow-400';
    }
  };

  const handleCoinFlip = () => {
    if (soundEnabled) {
      console.log('🔊 CHOG coin flip sound!');
    }
    
    const prediction = Math.random() > 0.5 ? 'fast' : 'slow';
    const blockTime = Math.random() * 3 + 1;
    
    // Create and show a visual prediction
    const predictionEl = document.createElement('div');
    predictionEl.className = 'fixed top-4 right-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce';
    predictionEl.innerHTML = `
      <div class="font-bold">🐷 CHOG Prediction</div>
      <div>Next block: ${prediction}</div>
      <div>~${blockTime.toFixed(1)}s</div>
    `;
    document.body.appendChild(predictionEl);
    
    setTimeout(() => {
      predictionEl.remove();
    }, 3000);
  };

  if (error) {
    return (
      <Card className="glassmorphism-strong text-white metric-card">
        <CardContent className="p-6">
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              Failed to load transaction data: {error.message}
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
            🐷 CHOG Transaction Zone
          </CardTitle>
          <Badge className={`${getMoodColor()} bg-transparent border-current`}>
            Mood: {getMoodText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* CHOG Character */}
        <div className="text-center">
          <div
            className={`monanimal-character ${chogMood === 'excited' ? 'animate-bounce-slow' : chogMood === 'sleeping' ? 'animate-pulse' : 'animate-float'}`}
            style={{
              transform: `scale(${chogScale})`,
              animationDuration: `${2 / animationSpeed}s`
            }}
          >
            🐷
          </div>
          <div className="mt-2">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-20 mx-auto mb-1" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-3xl font-bold">
                  {transactionData?.totalTransactions.toLocaleString() || '0'}
                </div>
                <div className="text-sm opacity-75">Total Transactions</div>
              </>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            {isLoading ? (
              <Skeleton className="h-6 w-16 mx-auto mb-1" />
            ) : (
              <div className="text-xl font-bold text-green-400">
                {transactionData?.tps.toFixed(1) || '0.0'}
              </div>
            )}
            <div className="text-xs opacity-75">TPS</div>
          </div>
          <div className="text-center">
            {isLoading ? (
              <Skeleton className="h-6 w-20 mx-auto mb-1" />
            ) : (
              <div className="text-xl font-bold text-purple-300">
                {transactionData?.volume ? `${(transactionData.volume / 1000).toFixed(1)}K` : '0K'}
              </div>
            )}
            <div className="text-xs opacity-75">Volume (MON)</div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium opacity-75">Recent Transactions</h3>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between p-2 glassmorphism rounded">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-4 text-sm opacity-60">
              No recent transactions available
            </div>
          ) : (
            recentTransactions.slice(0, 3).map((tx, index) => (
              <div
                key={tx.hash}
                className="text-xs font-mono bg-white/10 rounded p-2 flex justify-between animate-slide-in cursor-pointer hover:bg-white/20 transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => window.open(`https://testnet.monadexplorer.com/tx/${tx.hash}`, '_blank')}
                title="Click to view on Monad Explorer"
              >
                <span className="text-purple-200">
                  {tx.hash.slice(0, 6)}...{tx.hash.slice(-6)}
                </span>
                <span className={tx.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                  {tx.status === 'success' ? `+${tx.value.toFixed(2)} MON` : 'Failed'}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Interactive Feature */}
        <Button
          onClick={handleCoinFlip}
          className="w-full glassmorphism hover:bg-white/20 transition-all"
          variant="ghost"
        >
          🪙 CHOG Coin Flip - Predict Next Block Time!
        </Button>
      </CardContent>
    </Card>
  );
}
