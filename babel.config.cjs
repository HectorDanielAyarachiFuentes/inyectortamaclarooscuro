module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // Transpile ESM to CJS for Jest, but keep it for Node.
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
        targets: { node: 'current' },
      },
    ],
  ],
};