const path = require('path');
const fs = require('fs-extra');

// 循环指定目录，输出目录内所有文件列表的数组
// file{String} 文件名或文件夹名
// loop{Bool} 是否循环遍历所有子目录
// igroneFile{Bool} 是否忽略文件只要文件夹
// igroneDir{Bool} 是否忽略文件夹只要文件
// igroneExp{RegExp} 忽略正则表达式
// igroneArr{Array} 忽略文件数组
// igroneEmptyDir{Bool} 忽略空文件夹
// json{Bool} json化输出，true输出{fileName: filePath}，false输出[filePath]
module.exports = function (file, options = {}) {
  const ops = {
    loop: false,
    igroneFile: false,
    igroneDir: false,
    igroneExp: null,
    igroneArr: [],
    igroneEmptyDir: false,
    json: true,
    ...options,
  };
  let fileList = ops.json ? {} : [];
  function outFormat(filePath, isJson) {
    if (isJson) {
      fileList[path.basename(filePath)] = filePath;
    } else {
      fileList.push(filePath);
    }
  }
  function inIgrone(file) {
    if (!ops.igroneArr.length && !ops.igroneExp) return false;
    let hasIgrone = false;
    // 优先正则匹配
    if (ops.igroneExp) hasIgrone = ops.igroneExp.test(file);
    // 正则匹配失败，寻找是否在忽略数组里
    if (!hasIgrone) {
      for (let i = 0, max = ops.igroneArr.length; i < max; i++) {
        if (ops.igroneArr[i] === path.basename(file)) {
          hasIgrone = true;
        }
      }
    }
    return hasIgrone;
  }
  function walk(file) {
    //如果入参是文件，直接加入数组返回
    if (!fs.statSync(file).isDirectory()) {
      // 优先排查文件是否在忽略数组里
      if (inIgrone(file)) return;
      outFormat(file, ops.json);
      return;
    }
    let dirlist = fs.readdirSync(file);
    dirlist.forEach(function (item) {
      // 优先排查文件是否在忽略数组里
      if (inIgrone(item)) return;
      let itemPath = path.resolve(file, item);
      let isDirectory = fs.statSync(itemPath).isDirectory();
      if (isDirectory) {
        if (ops.igroneDir) return;
        const nextPath = fs.readdirSync(itemPath);
        if (ops.loop) {
          // 下层为空文件夹且不忽略空文件夹，将文件夹加入输出，退出
          if (!nextPath.length && !ops.igroneEmptyDir) {
            outFormat(itemPath, ops.json);
            return;
          }
          // 下层不为空，递归循环。忽略空文件夹的空输出在下次循环中处理
          walk(itemPath);
        } else {
          if (!nextPath.length && ops.igroneEmptyDir) return;
          outFormat(itemPath, ops.json);
        }
      } else {
        if (ops.igroneFile) return;
        outFormat(itemPath, ops.json);
      }
    });
  };
  walk(file);
  return fileList;
}
