import { BlockchainData, NetworkMetrics, TransactionMetrics, BlockMetrics, TokenMetrics, Transaction, Block, SwapActivity } from "@/types/blockchain";

export class MonadApi {
  private readonly RPC_URL = import.meta.env.VITE_MONAD_RPC_URL || 'https://monad-testnet.g.alchemy.com/v2/780NVB3ycNENBwwZtWe5W';
  private readonly EXPLORER_URL = import.meta.env.VITE_MONAD_EXPLORER_URL || 'https://testnet.monadexplorer.com/api';
  private readonly DEX_URL = import.meta.env.VITE_GECKO_API_URL || 'https://api.geckoterminal.com/api/v2/networks/monad-testnet';

  async rpcCall(method: string, params: any[] = []): Promise<any> {
    try {
      const response = await fetch(this.RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: Math.floor(Math.random() * 1000)
        })
      });

      if (!response.ok) {
        throw new Error(`RPC call failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`RPC error: ${data.error.message}`);
      }

      return data.result;
    } catch (error) {
      console.error(`RPC call failed for method ${method}:`, error);
      throw error;
    }
  }

  async getCurrentBlock(): Promise<number> {
    const blockNumber = await this.rpcCall('eth_blockNumber');
    return parseInt(blockNumber, 16);
  }

  async getBlock(blockNumber: string | number): Promise<any> {
    const blockId = typeof blockNumber === 'number' ? `0x${blockNumber.toString(16)}` : blockNumber;
    return await this.rpcCall('eth_getBlockByNumber', [blockId, true]);
  }

  async getGasPrice(): Promise<number> {
    const gasPrice = await this.rpcCall('eth_gasPrice');
    return parseInt(gasPrice, 16) / 1e9; // Convert to Gwei
  }

  async getRecentTransactions(count: number = 10): Promise<Transaction[]> {
    try {
      const currentBlock = await this.getCurrentBlock();
      const transactions: Transaction[] = [];
      
      // Get transactions from recent blocks
      for (let i = 0; i < Math.min(5, count); i++) {
        const blockNumber = currentBlock - i;
        const block = await this.getBlock(blockNumber);
        
        if (block && block.transactions) {
          const blockTxs = block.transactions.slice(0, Math.ceil(count / 5)).map((tx: any) => ({
            hash: tx.hash,
            value: parseFloat((parseInt(tx.value, 16) / 1e18).toFixed(4)),
            from: tx.from,
            to: tx.to,
            status: 'success' as const,
            timestamp: parseInt(block.timestamp, 16) * 1000,
            gasUsed: parseInt(tx.gas, 16)
          }));
          
          transactions.push(...blockTxs);
        }
      }
      
      return transactions.slice(0, count);
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error);
      return [];
    }
  }

  async getRecentBlocks(count: number = 10): Promise<Block[]> {
    try {
      const currentBlock = await this.getCurrentBlock();
      const blocks: Block[] = [];
      
      for (let i = 0; i < count; i++) {
        const blockNumber = currentBlock - i;
        const block = await this.getBlock(blockNumber);
        
        if (block) {
          blocks.push({
            number: blockNumber,
            timestamp: parseInt(block.timestamp, 16) * 1000,
            transactionCount: block.transactions ? block.transactions.length : 0,
            gasUsed: parseInt(block.gasUsed, 16),
            miner: block.miner
          });
        }
      }
      
      return blocks;
    } catch (error) {
      console.error('Failed to fetch recent blocks:', error);
      return [];
    }
  }

  async getTokenPrices(): Promise<any[]> {
    try {
      // This would typically fetch from GeckoTerminal or similar API
      // For now, return mock data structure that would be replaced with real API calls
      return [
        {
          symbol: 'CHOG/MON',
          price: 0.0847,
          change24h: 2.4,
          volume24h: 142000
        },
        {
          symbol: 'YAKI/WMON',
          price: 0.1234,
          change24h: -0.8,
          volume24h: 67000
        },
        {
          symbol: 'MON/DAK',
          price: 1.4567,
          change24h: 5.2,
          volume24h: 289000
        }
      ];
    } catch (error) {
      console.error('Failed to fetch token prices:', error);
      return [];
    }
  }

  async calculateNetworkMetrics(recentBlocks: Block[]): Promise<NetworkMetrics> {
    if (recentBlocks.length === 0) {
      throw new Error('No recent blocks available for metrics calculation');
    }

    const currentBlock = await this.getCurrentBlock();
    const gasPrice = await this.getGasPrice();
    
    // Calculate block times
    const blockTimes = [];
    for (let i = 1; i < recentBlocks.length; i++) {
      const timeDiff = (recentBlocks[i-1].timestamp - recentBlocks[i].timestamp) / 1000;
      if (timeDiff > 0) blockTimes.push(timeDiff);
    }
    
    const avgBlockTime = blockTimes.length > 0 
      ? blockTimes.reduce((a, b) => a + b, 0) / blockTimes.length 
      : 2.0;
    
    // Calculate TPS based on recent transactions
    const recentTxCount = recentBlocks.slice(0, 5).reduce((sum, block) => sum + block.transactionCount, 0);
    const timeWindow = recentBlocks.length > 1 
      ? (recentBlocks[0].timestamp - recentBlocks[recentBlocks.length - 1].timestamp) / 1000 
      : avgBlockTime * recentBlocks.length;
    
    const tps = timeWindow > 0 ? recentTxCount / timeWindow : 0;
    
    // Determine network health
    let health: 'excellent' | 'good' | 'slow' = 'excellent';
    if (avgBlockTime > 3) health = 'slow';
    else if (avgBlockTime > 2.5) health = 'good';
    
    // Gas price history (mock for now - would track over time)
    const gasPriceHistory = Array.from({ length: 10 }, (_, i) => 
      gasPrice + (Math.random() - 0.5) * 5
    );

    return {
      blockHeight: currentBlock,
      tps,
      avgTps: tps * 0.9, // Slightly lower average
      gasPrice,
      gasPriceHistory,
      avgBlockTime,
      pendingTx: Math.floor(Math.random() * 100), // Mock pending transactions
      validatorCount: 156, // Mock validator count
      health
    };
  }

  async getDashboardData(): Promise<BlockchainData> {
    try {
      // Fetch core blockchain data
      const [currentBlock, gasPrice, recentBlocks, recentTransactions] = await Promise.all([
        this.getCurrentBlock(),
        this.getGasPrice(),
        this.getRecentBlocks(10),
        this.getRecentTransactions(20)
      ]);

      // Calculate metrics
      const networkMetrics = await this.calculateNetworkMetrics(recentBlocks);
      
      const transactionMetrics: TransactionMetrics = {
        totalTransactions: recentTransactions.length * 100, // Extrapolate
        tps: networkMetrics.tps,
        volume: recentTransactions.reduce((sum, tx) => sum + tx.value, 0),
        successRate: 0.95 // Mock success rate
      };

      const blockMetrics: BlockMetrics = {
        avgBlockTime: networkMetrics.avgBlockTime,
        blocksPerMinute: 60 / networkMetrics.avgBlockTime,
        lastBlockTime: recentBlocks.length > 1 
          ? (recentBlocks[0].timestamp - recentBlocks[1].timestamp) / 1000 
          : networkMetrics.avgBlockTime
      };

      const tokenPrices = await this.getTokenPrices();
      const tokenMetrics: TokenMetrics = {
        currentGasPrice: gasPrice,
        gasUsed24h: recentBlocks.reduce((sum, block) => sum + block.gasUsed, 0),
        tokenPairs: tokenPrices
      };

      const swapActivity: SwapActivity = {
        totalSwaps: Math.floor(Math.random() * 1000 + 500),
        volume24h: Math.random() * 1000000 + 500000
      };

      return {
        currentBlock,
        networkMetrics,
        transactionMetrics,
        blockMetrics,
        tokenMetrics,
        swapActivity,
        recentTransactions,
        recentBlocks,
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch blockchain data');
    }
  }
}
