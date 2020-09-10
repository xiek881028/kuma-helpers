# storageAvailable

判断浏览器是否支持storage。该方法复制于[这里](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)。

## 使用

```javascript
const storageAvailable = require('kuma-helpers/web/storageAvailable');
if(storageAvailable('localStorage')){
  // 浏览器支持 localStorage
} else {
  // 很遗憾，浏览器不支持 localStorage
}
```
