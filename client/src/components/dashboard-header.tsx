import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface DashboardHeaderProps {
  connectionState: 'connecting' | 'connected' | 'disconnected';
  currentBlock?: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function DashboardHeader({
  connectionState,
  currentBlock,
  soundEnabled,
  onToggleSound
}: DashboardHeaderProps) {
  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'connected': return 'Testnet Live';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  return (
    <header className="glassmorphism rounded-2xl p-6 mb-8 text-center text-white">
      <h1 className="font-['Fredoka_One'] text-3xl lg:text-5xl mb-2">
        🦄 Monanimal Safari Dashboard
      </h1>
      <p className="text-lg lg:text-xl mb-4 opacity-90">
        Watch the purple ecosystem come alive with real-time blockchain data
      </p>
      
      <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 ${getStatusColor()} rounded-full animate-pulse`} />
          <span className="font-medium">{getStatusText()}</span>
        </div>
        
        {currentBlock && (
          <div className="flex items-center space-x-2">
            <span className="text-purple-300">🧊</span>
            <span className="font-mono text-sm">
              Block #{currentBlock.toLocaleString()}
            </span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSound}
          className="glassmorphism hover:bg-white/20 transition-all"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </Button>
      </div>
    </header>
  );
}
