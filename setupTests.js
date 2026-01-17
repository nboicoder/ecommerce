// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => (
    <img src={src} alt={alt} {...props} data-testid="mock-image" />
  ),
}));