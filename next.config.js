/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-var-requires */

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
    webpack: (config, options) => {
      config.stats = {
        // Examine all modules
        maxModules: Infinity,
        // Display bailout reasons
        optimizationBailout: true
      };
      return config;
    }
  });
};
