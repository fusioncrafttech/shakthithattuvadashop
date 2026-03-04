// Test file to check bulk orders functionality
import { bulkOrderService } from './src/lib/bulkOrderService.js';

console.log('Testing bulk order service...');

// Test get config
bulkOrderService.getBulkOrderConfig()
  .then(config => {
    console.log('Config loaded:', config);
  })
  .catch(error => {
    console.error('Error loading config:', error);
  });
