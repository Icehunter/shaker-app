module.exports = (api) => {
  api.cache(true);

  return {
    presets: ['next/babel'],
    env: {
      test: {
        presets: ['@babel/env', '@babel/react']
      }
    }
  };
};
