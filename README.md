# kuma-helpers

``kuma-helpers``是一个自用的工具集。

## 安装

```bash
npm install -save kuma-helpers
```

```bash
yarn add kuma-helpers
```

## 目录

```bash
# 用于node层的公共方法
node/
# 用于web端的公共方法
web/
```

## 引入

```javascript
// node
const helpers = require('kuma-helpers/node');
// 或直接调用某一个组件
const file = require('kuma-helpers/node/file');
```

## 组件文档

- [file](doc/file.md) 获取文件树
- [permission](doc/permission.md) 判断用户权限
- [storageAvailable](doc/storageAvailable.md) 判断浏览器是否支持storage

## 更新日志
