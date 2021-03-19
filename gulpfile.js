const { src, dest, series, parallel } = require('gulp');
const argv = require('yargs').argv;
const babel = require('gulp-babel');
const fs = require('fs-extra');
// const path = require('path');

const { mode } = argv;

// babel
const babelFn = mode => () => {
  return src(`src/${mode}/**/*.js`)
    .pipe(
      babel({
        presets: [
          [
            '@babel/env',
            {
              targets: {
                ie: 11,
                // "browsers": "> 1%, not dead",
                node: 10,
              },
              modules: mode === 'node' ? 'commonjs' : false,
              useBuiltIns: 'usage',
              corejs: { version: 3, proposals: true },
            },
          ],
        ],
        plugins:
          mode === 'node'
            ? []
            : [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties', // class的方法可以用箭头函数自动bind this
                '@babel/plugin-proposal-private-methods', // 允许class定义私有方法
              ],
        ignore: [
          filename => {
            return false;
          },
        ],
        sourceType: 'unambiguous',
      })
    )
    .pipe(dest(mode));
};

// clear
const clear = dest => cb => {
  fs.removeSync(dest);
  cb();
};

// 暴露编译js方法
exports.default = (() => {
  if (mode === 'web' || mode === 'node') {
    // 编译es或lib
    return series(clear(mode), babelFn(mode));
  } else {
    // 编译全部
    return series(parallel(clear('web'), clear('node')), parallel(babelFn('web'), babelFn('node')));
  }
})();
