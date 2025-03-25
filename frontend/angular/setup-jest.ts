import 'jest-preset-angular/setup-jest';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock window.URL.createObjectURL
Object.defineProperty(window.URL, 'createObjectURL', { value: jest.fn() });

// Mock window.URL.revokeObjectURL
Object.defineProperty(window.URL, 'revokeObjectURL', { value: jest.fn() });
