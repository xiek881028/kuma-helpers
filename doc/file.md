# file

一个将文件树拍平成数组或json的方法。

## 使用

```javascript
const file = require('kuma-helpers/node/file');
file(path, [ops]);
```

## 入参

方法接收2个参数，``path``和``ops``;

### path

``type： String``

必传，入口文件路径。可以是文件夹路径或文件路径。

### ops

``type: Object``

非必传，各种配置项。

#### loop

``type: Bool``
``defualt: false``

是否递归循环所有下层目录。

#### igroneFile

``type: Bool``
``defualt: false``

是否忽略目录下的文件只输出文件夹

#### igroneDir

``type: Bool``
``defualt: false``

是否忽略目录下的文件夹只输出文件

#### igroneExp

``type: RegExp``
``defualt: null``

忽略指定正则匹配的文件与文件夹

#### igroneArr

``type: Array``
``defualt: []``

需要忽略的文件数组

#### igroneEmptyDir

``type: Bool``
``defualt: false``

是否忽略空文件夹

#### json

``type: Bool``
``defualt: true``

是否输出json结构。false输出数组``[文件路径...]``，true输出json``{文件名：文件路径}``。
