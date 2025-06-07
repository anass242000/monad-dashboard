import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard-header";
import ChogTransactionZone from "@/components/chog-transaction-zone";
import NetworkVitalSigns from "@/components/network-vital-signs";
import YakiBlockVisualizer from "@/components/yaki-block-visualizer";
import MoyakiTokenSafari from "@/components/moyaki-token-safari";
import TransactionRain from "@/components/transaction-rain";
import InteractiveControls from "@/components/interactive-controls";
import { useMonadData } from "@/hooks/use-monad-data";
import { useWebSocket } from "@/hooks/use-websocket";

export default function Dashboard() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: monadData, isLoading, error } = useMonadData(autoRefresh);
  const { lastMessage, connectionState } = useWebSocket("wss://testnet-rpc.monad.xyz");

  // Background safari elements
  const safariElements = [
    { icon: "🌿", size: "text-6xl", position: "top-10 left-10", delay: "0s" },
    { icon: "🌱", size: "text-4xl", position: "top-20 right-20", delay: "1s" },
    { icon: "🌳", size: "text-5xl", position: "bottom-20 left-20", delay: "2s" },
    { icon: "🍃", size: "text-3xl", position: "bottom-10 right-10", delay: "0.5s" },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background Safari Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {safariElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.position} ${element.size} safari-leaf animate-float`}
            style={{ animationDelay: element.delay }}
          >
            {element.icon}
          </div>
        ))}
      </div>

      {/* Transaction Rain Background */}
      <TransactionRain 
        transactions={monadData?.recentTransactions || []}
        animationSpeed={animationSpeed}
      />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen p-4 lg:p-8">
        {/* Header */}
        <DashboardHeader
          connectionState={connectionState}
          currentBlock={monadData?.currentBlock}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChogTransactionZone
            transactionData={monadData?.transactionMetrics}
            recentTransactions={monadData?.recentTransactions}
            soundEnabled={soundEnabled}
            animationSpeed={animationSpeed}
            isLoading={isLoading}
            error={error}
          />

          <NetworkVitalSigns
            networkData={monadData?.networkMetrics}
            isLoading={isLoading}
            error={error}
          />

          <YakiBlockVisualizer
            blockData={monadData?.blockMetrics}
            recentBlocks={monadData?.recentBlocks}
            soundEnabled={soundEnabled}
            animationSpeed={animationSpeed}
            isLoading={isLoading}
            error={error}
          />

          <MoyakiTokenSafari
            tokenData={monadData?.tokenMetrics}
            swapActivity={monadData?.swapActivity}
            soundEnabled={soundEnabled}
            animationSpeed={animationSpeed}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Interactive Controls */}
        <InteractiveControls
          soundEnabled={soundEnabled}
          animationSpeed={animationSpeed}
          autoRefresh={autoRefresh}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onSpeedChange={setAnimationSpeed}
          onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
          networkData={monadData?.networkMetrics}
        />
      </div>
    </div>
  );
}
