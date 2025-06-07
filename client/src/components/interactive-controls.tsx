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
    // Create a canvas to capture the current state
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Use html2canvas to capture the dashboard
    import('html2canvas').then((html2canvas) => {
      const html2canvasDefault = html2canvas.default || html2canvas;
      html2canvasDefault(document.body, {
        backgroundColor: '#1e1b4b',
        scale: 0.8,
        useCORS: true
      }).then((canvas: HTMLCanvasElement) => {
        // Create download link
        const link = document.createElement('a');
        link.download = `monanimal-safari-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        // Show success notification
        const notificationEl = document.createElement('div');
        notificationEl.className = 'fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50';
        notificationEl.innerHTML = '📸 Safari snapshot saved to downloads!';
        document.body.appendChild(notificationEl);
        
        setTimeout(() => notificationEl.remove(), 3000);
      });
    }).catch(() => {
      // Fallback: simple notification
      const notificationEl = document.createElement('div');
      notificationEl.className = 'fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50';
      notificationEl.innerHTML = '📸 Use browser screenshot (Ctrl+Shift+S) to capture safari!';
      document.body.appendChild(notificationEl);
      
      setTimeout(() => notificationEl.remove(), 4000);
    });
  };

  const handleRandomName = () => {
    const names = {
      chog: ['Chloe', 'Charlie', 'Chester', 'Champ', 'Chomper', 'Bacon', 'Snuffles', 'Porky', 'Oink'],
      yaki: ['Yodel', 'Yuki', 'Yapper', 'Yogurt', 'Yonder', 'Sprint', 'Dash', 'Lightning', 'Zoom'],
      moyaki: ['Momo', 'Maple', 'Muffin', 'Marble', 'Mighty', 'Bounce', 'Hop', 'Jumper', 'Boing']
    };
    
    const chogName = names.chog[Math.floor(Math.random() * names.chog.length)];
    const yakiName = names.yaki[Math.floor(Math.random() * names.yaki.length)];
    const moyakiName = names.moyaki[Math.floor(Math.random() * names.moyaki.length)];
    
    // Create visual name notification
    const nameEl = document.createElement('div');
    nameEl.className = 'fixed bottom-4 left-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse';
    nameEl.innerHTML = `
      <div class="font-bold">🎲 New Monanimal Names!</div>
      <div>CHOG: ${chogName}</div>
      <div>YAKI: ${yakiName}</div>
      <div>MOYAKI: ${moyakiName}</div>
    `;
    document.body.appendChild(nameEl);
    
    setTimeout(() => {
      nameEl.remove();
    }, 4000);
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
