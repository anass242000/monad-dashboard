import type { Express } from "express";
import { createServer, type Server } from "http";
import WebSocket from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "Monanimal Safari Dashboard API"
    });
  });

  // Proxy endpoint for Monad RPC calls to avoid CORS issues
  app.post("/api/monad/rpc", async (req, res) => {
    try {
      const rpcUrl = process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz';
      
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });

      if (!response.ok) {
        throw new Error(`RPC call failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('RPC proxy error:', error);
      res.status(500).json({ 
        error: 'RPC call failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Token price proxy endpoint
  app.get("/api/tokens/prices", async (req, res) => {
    try {
      const geckoUrl = process.env.GECKO_API_URL || 'https://api.geckoterminal.com/api/v2/networks/monad-testnet';
      
      // This would fetch real token data from GeckoTerminal
      // For now, returning structured mock data
      const tokenPrices = [
        {
          symbol: 'CHOG/MON',
          price: 0.0847 + (Math.random() - 0.5) * 0.01,
          change24h: (Math.random() - 0.5) * 10,
          volume24h: Math.random() * 200000 + 100000
        },
        {
          symbol: 'YAKI/WMON',
          price: 0.1234 + (Math.random() - 0.5) * 0.02,
          change24h: (Math.random() - 0.5) * 8,
          volume24h: Math.random() * 150000 + 50000
        },
        {
          symbol: 'MON/DAK',
          price: 1.4567 + (Math.random() - 0.5) * 0.1,
          change24h: (Math.random() - 0.5) * 15,
          volume24h: Math.random() * 500000 + 200000
        }
      ];

      res.json({ 
        success: true, 
        data: tokenPrices,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Token price fetch error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch token prices',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Network statistics endpoint
  app.get("/api/network/stats", async (req, res) => {
    try {
      // This would calculate real network statistics
      const stats = {
        totalTransactions24h: Math.floor(Math.random() * 50000 + 10000),
        avgGasPrice: Math.random() * 30 + 10,
        networkUtilization: Math.random() * 0.4 + 0.6,
        activeValidators: Math.floor(Math.random() * 50 + 120),
        timestamp: new Date().toISOString()
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Network stats error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch network statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocket.Server({ 
    server: httpServer,
    path: '/ws'
  });

  wss.on('connection', (ws) => {
    console.log('🔌 New WebSocket connection established');
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to Monanimal Safari Dashboard',
      timestamp: Date.now()
    }));

    // Simulate real-time blockchain updates
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        // Simulate new block notification
        ws.send(JSON.stringify({
          method: 'eth_subscription',
          params: {
            subscription: 'newHeads',
            result: {
              number: `0x${Math.floor(Math.random() * 1000000 + 2800000).toString(16)}`,
              timestamp: `0x${Math.floor(Date.now() / 1000).toString(16)}`,
              gasUsed: `0x${Math.floor(Math.random() * 8000000 + 2000000).toString(16)}`,
              transactionCount: Math.floor(Math.random() * 50 + 10)
            }
          },
          timestamp: Date.now()
        }));
      }
    }, 5000);

    ws.on('close', () => {
      console.log('🔌 WebSocket connection closed');
      clearInterval(interval);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('🚀 Monanimal Safari API routes registered');
  
  return httpServer;
}
