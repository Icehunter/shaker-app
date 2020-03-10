import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import jsx from 'acorn-jsx';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';

const input = './src/index.ts';
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@material-ui/core': 'MaterialUI'
};
const babelOptions = {
  exclude: /node_modules/,
  // We are using @babel/plugin-transform-runtime
  runtimeHelpers: true,
  configFile: './babel.config.js'
};
const commonjsOptions = {
  ignoreGlobal: true,
  include: /node_modules/,
  namedExports: {
    './node_modules/prop-types/index.js': ['elementType', 'bool', 'func', 'object', 'oneOfType', 'element'],
    './node_modules/react-is/index.js': ['ForwardRef', 'isFragment', 'isLazy', 'isMemo', 'Memo', 'isValidElementType']
  }
};

export default [
  process.env.BABEL_ENV === 'rollup' && {
    input,
    output: {
      file: 'lib/index.cjs.js',
      format: 'cjs',
      globals
    },
    acornInjectPlugins: [jsx()],
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      typescript(),
      babel(babelOptions),
      commonjs(commonjsOptions),
      nodeGlobals(), // Wait for https://github.com/cssinjs/jss/pull/893
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
    ]
  },
  process.env.BABEL_ENV === 'rollup' && {
    input,
    output: {
      file: 'lib/index.es.js',
      format: 'es',
      globals
    },
    acornInjectPlugins: [jsx()],
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      typescript(),
      babel(babelOptions),
      nodeGlobals(), // Wait for https://github.com/cssinjs/jss/pull/893
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
    ]
  },
  process.env.BABEL_ENV === 'production-umd' && {
    input,
    output: {
      file: 'lib/umd/icehunter-big-package.js',
      format: 'umd',
      name: 'IcehunterBigPackage',
      globals
    },
    acornInjectPlugins: [jsx()],
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      typescript(),
      babel(babelOptions),
      commonjs(commonjsOptions),
      nodeGlobals(), // Wait for https://github.com/cssinjs/jss/pull/893
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
    ]
  },
  process.env.BABEL_ENV === 'production-umd' && {
    input,
    output: {
      file: 'lib/umd/icehunter-big-package.min.js',
      format: 'umd',
      name: 'IcehunterBigPackage',
      globals
    },
    acornInjectPlugins: [jsx()],
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      typescript(),
      babel(babelOptions),
      commonjs(commonjsOptions),
      nodeGlobals(), // Wait for https://github.com/cssinjs/jss/pull/893
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      sizeSnapshot({ snapshotPath: 'size-snapshot.json' }),
      terser({
        parse: {
          // We want terser to parse ecma 8 code. However, we don't want it
          // to apply any minification steps that turns valid ecma 5 code
          // into invalid ecma 5 code. This is why the 'compress' and 'output'
          // sections only apply transformations that are ecma 5 safe
          // https://github.com/facebook/create-react-app/pull/4234
          ecma: 8
        },
        compress: {
          ecma: 5,
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebook/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
          // Disabled because of an issue with Terser breaking valid code:
          // https://github.com/facebook/create-react-app/issues/5250
          // Pending further investigation:
          // https://github.com/terser-js/terser/issues/120
          inline: 2
        },
        mangle: {
          safari10: true
        },
        // Added for profiling in devtools
        keep_classnames: true,
        keep_fnames: true,
        output: {
          ecma: 5,
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          ascii_only: true
        }
      })
    ]
  }
].filter(Boolean);
