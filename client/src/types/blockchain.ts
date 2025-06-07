export interface Transaction {
  hash: string;
  value: number;
  from: string;
  to: string;
  status: 'success' | 'failed';
  timestamp: number;
  gasUsed: number;
}

export interface Block {
  number: number;
  timestamp: number;
  transactionCount: number;
  gasUsed: number;
  miner: string;
}

export interface NetworkMetrics {
  blockHeight: number;
  tps: number;
  avgTps: number;
  gasPrice: number;
  gasPriceHistory: number[];
  avgBlockTime: number;
  pendingTx: number;
  validatorCount: number;
  health: 'excellent' | 'good' | 'slow';
}

export interface TransactionMetrics {
  totalTransactions: number;
  tps: number;
  volume: number;
  successRate: number;
}

export interface BlockMetrics {
  avgBlockTime: number;
  blocksPerMinute: number;
  lastBlockTime: number;
}

export interface TokenPair {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
}

export interface TokenMetrics {
  currentGasPrice: number;
  gasUsed24h: number;
  tokenPairs: TokenPair[];
}

export interface SwapActivity {
  totalSwaps: number;
  volume24h: number;
}

export interface BlockchainData {
  currentBlock: number;
  networkMetrics: NetworkMetrics;
  transactionMetrics: TransactionMetrics;
  blockMetrics: BlockMetrics;
  tokenMetrics: TokenMetrics;
  swapActivity: SwapActivity;
  recentTransactions: Transaction[];
  recentBlocks: Block[];
  lastUpdated: number;
}
