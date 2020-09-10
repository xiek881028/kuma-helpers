require("core-js/modules/es.symbol");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-own-property-descriptors");

require("core-js/modules/es.object.keys");

require("core-js/modules/web.dom-collections.for-each");

var _defineProperty = require("@babel/runtime/helpers/defineProperty");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var path = require('path');

var fs = require('fs-extra'); // 循环指定目录，输出目录内所有文件列表的数组
// exp{RegExp} 寻找指定正则匹配的文件
// file{String} 文件名或文件夹名
// loop{Bool} 是否循环遍历所有子目录
// igroneFile{Bool} 是否忽略文件只要文件夹
// igroneDir{Bool} 是否忽略文件夹只要文件
// igroneExp{RegExp} 忽略正则表达式
// igroneArr{Array} 忽略文件数组
// igroneEmptyDir{Bool} 忽略空文件夹
// json{Bool} json化输出，true输出{fileName: filePath}，false输出[filePath]


module.exports = function (file) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var ops = _objectSpread({
    exp: null,
    loop: false,
    igroneFile: false,
    igroneDir: false,
    igroneExp: null,
    igroneArr: [],
    igroneEmptyDir: false,
    json: true
  }, options);

  var fileList = ops.json ? {} : [];

  function outFormat(filePath, isJson) {
    if (isJson) {
      fileList[path.basename(filePath)] = filePath;
    } else {
      fileList.push(filePath);
    }
  }

  function inIgrone(file) {
    if (!ops.igroneArr.length && !ops.igroneExp) return false;
    var hasIgrone = false; // 优先正则匹配

    if (ops.igroneExp) hasIgrone = ops.igroneExp.test(file); // 正则匹配失败，寻找是否在忽略数组里

    if (!hasIgrone) {
      for (var i = 0, max = ops.igroneArr.length; i < max; i++) {
        if (ops.igroneArr[i] === path.basename(file)) {
          hasIgrone = true;
        }
      }
    }

    return hasIgrone;
  }

  function inExp(file) {
    var isInExp = false;

    if (ops.exp === null || ops.exp !== null && ops.exp.test(file)) {
      isInExp = true;
    }

    return isInExp;
  }

  function walk(file) {
    //如果入参是文件，直接加入数组返回
    if (!fs.statSync(file).isDirectory()) {
      // 优先排查文件是否在忽略数组里
      if (inIgrone(file) || !inExp(file)) return;
      return outFormat(file, ops.json);
    }

    var dirlist = fs.readdirSync(file);
    dirlist.forEach(function (item) {
      // 优先排查文件是否在忽略数组里
      if (inIgrone(item)) return;
      var itemPath = path.resolve(file, item);
      var isDirectory = fs.statSync(itemPath).isDirectory();

      if (isDirectory) {
        if (ops.igroneDir) return;
        var nextPath = fs.readdirSync(itemPath);

        if (ops.loop) {
          // 下层为空文件夹且不忽略空文件夹，将文件夹加入输出，退出
          if (!nextPath.length && !ops.igroneEmptyDir && inExp(itemPath)) {
            return outFormat(itemPath, ops.json);
          } // 下层不为空，递归循环。忽略空文件夹的空输出在下次循环中处理


          walk(itemPath);
        } else {
          if (!nextPath.length && ops.igroneEmptyDir || !inExp(itemPath)) return;
          outFormat(itemPath, ops.json);
        }
      } else {
        if (ops.igroneFile || !inExp(itemPath)) return;
        outFormat(itemPath, ops.json);
      }
    });
  }

  ;
  walk(file);
  return fileList;
};