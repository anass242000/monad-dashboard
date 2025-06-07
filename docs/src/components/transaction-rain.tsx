import { useEffect, useState, useRef } from "react";
import { Transaction } from "@/types/blockchain";

interface TransactionRainProps {
  transactions: Transaction[];
  animationSpeed: number;
}

interface RainDrop {
  id: string;
  x: number;
  type: 'success' | 'failed';
  hash: string;
  value: number;
}

export default function TransactionRain({ 
  transactions, 
  animationSpeed 
}: TransactionRainProps) {
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropIdCounter = useRef(0);

  // Create new rain drops from transactions
  useEffect(() => {
    if (transactions.length === 0) return;

    const interval = setInterval(() => {
      const randomTx = transactions[Math.floor(Math.random() * transactions.length)];
      
      const newDrop: RainDrop = {
        id: `drop-${dropIdCounter.current++}`,
        x: Math.random() * 100,
        type: randomTx.status === 'success' ? 'success' : 'failed',
        hash: randomTx.hash,
        value: randomTx.value
      };

      setRainDrops(prev => [...prev, newDrop]);

      // Remove drop after animation completes
      setTimeout(() => {
        setRainDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
      }, 4000 / animationSpeed);
    }, 800 / animationSpeed);

    return () => clearInterval(interval);
  }, [transactions, animationSpeed]);

  // Create ambient rain drops for visual effect
  useEffect(() => {
    const ambientInterval = setInterval(() => {
      const newDrop: RainDrop = {
        id: `ambient-${dropIdCounter.current++}`,
        x: Math.random() * 100,
        type: Math.random() > 0.9 ? 'failed' : 'success',
        hash: '',
        value: 0
      };

      setRainDrops(prev => [...prev, newDrop]);

      setTimeout(() => {
        setRainDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
      }, 4000 / animationSpeed);
    }, 400 / animationSpeed);

    return () => clearInterval(ambientInterval);
  }, [animationSpeed]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
    >
      {rainDrops.map(drop => (
        <div
          key={drop.id}
          className={`transaction-drop ${drop.type}`}
          style={{
            left: `${drop.x}%`,
            animationDuration: `${4 / animationSpeed}s`
          }}
          title={drop.hash ? `${drop.hash.slice(0, 10)}... - ${drop.value.toFixed(2)} MON` : undefined}
        />
      ))}
    </div>
  );
}
