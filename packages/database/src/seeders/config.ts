export const seederConfig = {
  // Default batch size for bulk inserts
  defaultBatchSize: 100,
  
  // Whether to run seeders in transactions by default
  useTransactions: true,
  
  // Default timeout for seeder operations (in milliseconds)
  timeout: 30000,
  
  // Logging configuration
  logging: {
    enabled: true,
    verbose: false,
    showTiming: true
  },
  
  // Seeder execution order (if not specified, runs in registration order)
  executionOrder: [
    'users',
    'posts'
  ],
  
  // Environment-specific configurations
  environments: {
    development: {
      force: false,
      verbose: true
    },
    production: {
      force: false,
      verbose: false
    },
    test: {
      force: true,
      verbose: false
    }
  }
} as const;
