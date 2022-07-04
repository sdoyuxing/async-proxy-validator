module.exports = () => {
  return {
    presets: [ "@babel/preset-env"],
    exclude: 'node_modules/**',
    babelHelpers: 'bundled'
  };
};
