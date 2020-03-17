/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const { ANALYZE } = process.env;

const compose = (funcs) => {
  switch (funcs.length) {
    case 0:
      return (arg) => arg;
    case 1:
      return funcs[0];
    default:
      return funcs.reduce((a, b) => (...args) => a(b(...args)));
  }
};

module.exports = (phase) => {
  const transpiledModules = [];

  const plugins = [
    ANALYZE &&
      require('@next/bundle-analyzer')({
        enabled: process.env.ANALYZE === 'true'
      }),
    transpiledModules.length && require('next-transpile-modules')(transpiledModules)
  ].filter(Boolean);

  return compose(plugins)({
    webpack: (webpackConfig) => {
      webpackConfig.resolve.alias['~'] = path.join(__dirname, 'src');

      // Fixes npm packages that depend on `fs` module
      webpackConfig.node = {
        fs: 'empty'
      };

      // serverside has externals and it's an array function that needs to be pushed to
      // client side doesn't have externals defined
      const externals = {
        react: 'React',
        'react-dom': 'ReactDOM'
      };

      if (Array.isArray(webpackConfig.externals)) {
        webpackConfig.externals.push(externals);
      } else {
        webpackConfig.externals = externals;
      }

      webpackConfig.stats = {
        // Examine all modules
        maxModules: Infinity,
        // Display bailout reasons
        optimizationBailout: true
      };

      return webpackConfig;
    }
  });
};
