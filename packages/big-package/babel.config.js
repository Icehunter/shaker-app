let defaultPresets;

// release a ES version of Icehunter-BigPackage.
// It's something that matches the latest official supported features of JavaScript.
// Nothing more (stage-1, etc), nothing less (require, etc).
if (process.env.BABEL_ENV === 'es') {
  defaultPresets = [];
} else {
  defaultPresets = [
    [
      '@babel/preset-env',
      {
        modules: ['esm'].includes(process.env.BABEL_ENV) ? false : 'commonjs'
      }
    ]
  ];
}

const productionPlugins = [
  '@babel/plugin-transform-react-constant-elements',
  'babel-plugin-transform-dev-warning',
  ['babel-plugin-react-remove-properties', { properties: ['data-testid'] }],
  [
    'babel-plugin-transform-react-remove-prop-types',
    {
      mode: 'unsafe-wrap'
    }
  ]
];

module.exports = {
  presets: defaultPresets.concat(['@babel/preset-react', '@babel/preset-typescript']),
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    // any package needs to declare 7.4.4 as a runtime dependency. default is ^7.0.0
    ['@babel/plugin-transform-runtime', { version: '^7.4.4' }],
    // for IE 11 support
    '@babel/plugin-transform-object-assign'
  ],
  ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
  env: {
    cjs: {
      plugins: productionPlugins
    },
    esm: {
      plugins: [...productionPlugins, ['@babel/plugin-transform-runtime', { useESModules: true }]]
    },
    es: {
      plugins: [...productionPlugins, ['@babel/plugin-transform-runtime', { useESModules: true }]]
    },
    rollup: {
      plugins: [...productionPlugins, ['@babel/plugin-transform-runtime', { useESModules: true }]]
    }
  }
};
