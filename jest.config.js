module.exports = {
  projects: ['<rootDir>/jest.unit.config.js', '<rootDir>/jest.views.config.js'],
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/main/**/*.{js,ts}', '!src/main/**/*.d.ts', '!src/main/assets/**'],
};
