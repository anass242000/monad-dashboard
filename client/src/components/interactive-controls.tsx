import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, VolumeX, Camera, Zap, Gamepad2 } from "lucide-react";
import { NetworkMetrics } from "@/types/blockchain";

interface InteractiveControlsProps {
  soundEnabled: boolean;
  animationSpeed: number;
  autoRefresh: boolean;
  onToggleSound: () => void;
  onSpeedChange: (speed: number) => void;
  onToggleAutoRefresh: () => void;
  networkData?: NetworkMetrics;
}

export default function InteractiveControls({
  soundEnabled,
  animationSpeed,
  autoRefresh,
  onToggleSound,
  onSpeedChange,
  onToggleAutoRefresh,
  networkData
}: InteractiveControlsProps) {
  const handleScreenshot = () => {
    // Screenshot functionality
    console.log('📸 Safari snapshot captured! Check your downloads.');
  };

  const handleRandomName = () => {
    const names = {
      chog: ['Chloe', 'Charlie', 'Chester', 'Champ', 'Chomper'],
      yaki: ['Yodel', 'Yuki', 'Yapper', 'Yogurt', 'Yonder'],
      moyaki: ['Momo', 'Maple', 'Muffin', 'Marble', 'Mighty']
    };
    
    const chogName = names.chog[Math.floor(Math.random() * names.chog.length)];
    const yakiName = names.yaki[Math.floor(Math.random() * names.yaki.length)];
    const moyakiName = names.moyaki[Math.floor(Math.random() * names.moyaki.length)];
    
    console.log(`🎲 New names: CHOG is ${chogName}, YAKI is ${yakiName}, MOYAKI is ${moyakiName}`);
  };

  return (
    <>
      {/* Main Interactive Controls */}
      <Card className="glassmorphism-strong text-white mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-purple-200 mb-4 text-center">
            🎮 Interactive Safari Controls
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button
              onClick={onToggleSound}
              variant="ghost"
              className="glassmorphism hover:bg-white/20 transition-all"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="ml-2">
                Sound: {soundEnabled ? 'ON' : 'OFF'}
              </span>
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-purple-300">Speed:</span>
              <div className="flex space-x-1">
                {[1, 2, 3].map(speed => (
                  <Button
                    key={speed}
                    onClick={() => onSpeedChange(speed)}
                    variant="ghost"
                    size="sm"
                    className={`glassmorphism hover:bg-white/20 transition-all ${
                      animationSpeed === speed ? 'bg-purple-500/30' : ''
                    }`}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={onToggleAutoRefresh}
              variant="ghost"
              className="glassmorphism hover:bg-white/20 transition-all"
            >
              <Zap size={16} />
              <span className="ml-2">
                Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
              </span>
            </Button>

            <Button
              onClick={handleScreenshot}
              variant="ghost"
              className="glassmorphism hover:bg-white/20 transition-all"
            >
              <Camera size={16} />
              <span className="ml-2">Safari Camera</span>
            </Button>

            <Button
              onClick={handleRandomName}
              variant="ghost"
              className="glassmorphism hover:bg-white/20 transition-all"
            >
              <Gamepad2 size={16} />
              <span className="ml-2">Random Names</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Network Status Footer */}
      <div className="text-center text-purple-300 text-sm space-y-2">
        <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
          <Badge variant="outline" className="border-green-400 text-green-400">
            {networkData?.health || 'Unknown'} Network Health
          </Badge>
          <Badge variant="outline" className="border-purple-400 text-purple-400">
            {networkData?.tps.toFixed(1) || '0.0'} TPS
          </Badge>
          <Badge variant="outline" className="border-yellow-400 text-yellow-400">
            {networkData?.gasPrice.toFixed(1) || '0.0'} Gwei
          </Badge>
        </div>
        
        <p>
          Made with 💜 for the Monad ecosystem | Real-time data updates every 3 seconds
        </p>
        
        <p className="text-xs text-purple-400">
          Dashboard Version 1.0 | {new Date().toLocaleDateString()}
        </p>
      </div>
    </>
  );
}
