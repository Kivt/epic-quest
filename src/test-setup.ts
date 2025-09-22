// Test setup file for global types and mocks
import { vi } from 'vitest'

// Extend global interface for test environment
declare global {
  interface Window {
    Image: typeof Image
  }
}

// Mock Image constructor for tests
const mockImage = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    src: '',
    onload: null as (() => void) | null,
    onerror: null as (() => void) | null
}

// Set up global Image mock
Object.defineProperty(globalThis, 'Image', {
    value: vi.fn(() => mockImage),
    writable: true,
    configurable: true
})

export { mockImage }