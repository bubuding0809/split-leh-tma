import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Setup code to run before all tests
beforeAll(() => {
  // Initialize global resources, e.g., database connections
  console.log('🚀 Running before all tests');
});

// Cleanup code to run after all tests
afterAll(() => {
  // Cleanup global resources
  console.log('🌚 Running after all tests');
});

// Setup code to run before each test
beforeEach(() => {
  // Reset state before each test
  console.log('🏁 Running before each test');
});

// Cleanup code to run after each test
afterEach(() => {
  // Cleanup state after each test
  console.log('🔚 Running after each test');
});
