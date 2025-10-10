/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  // Indica a Jest de qué archivos debe recolectar información de cobertura.
  collectCoverageFrom: [
    'theme-generator.js',
    // Puedes añadir más archivos aquí si tu proyecto crece.
  ],
};

export default config;