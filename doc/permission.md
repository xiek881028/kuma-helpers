# permission

一个用于判断用户权限的方法。

## 使用

```javascript
const Permission = require('kuma-helpers/web/permission');
const permission = new Permission({
  ...ops,
});
permission.hasPermission([permissionStr]);
// or
await permission.hasPermissionSync([permissionStr]);
```

### 注意事项

-----

- 配置项`ajax`，`getFn`，`setPermission`，`permissionList`都是用来设置权限列表来源的。四个配置必须配置其中一个，否则组件无法工作。当同时配置多个时，只有一个配置会生效，其优先级顺序为：`permissionList > getFn > setPermission > ajax`。
- 为保证初始化时数据是干净的。初始化会调用清除方法清空权限信息。**多次初始化，将会导致之前的权限信息丢失**，如果需要同时维护多个权限组件，配置`permissionList`或`getFn`均可满足要求。如果是通过配置`ajax`初始化组件的，可以通过配置`saveName`区别名称，避免之前权限信息被删除。
- 组件上层封装使用了`window`、`sessionStorage`、`cookie`等浏览器特有属性，故无法在浏览器外的环境使用。如需在其他环境使用，可以引入核心逻辑包`kuma-helpers/web/permission/base`，核心包只有`sep`、`permissionMode`、`getFn`、`permissionList`4项配置，可在小程序、node、RN等平台使用，或自行进行二次封装。
- 权限数组为一个拍平的字符串数组，建议命名规则为`模块:操作`，例如`order:find`或`user:del`。

## API

### hasPermission(permission, [cb, ops])

异步返回用户权限。

首个入参为需要判断的权限字符串`permission`（必传），可选参数异步回调参数`cb<Function>`。配置后`hasPermission`将不再有返回值。权限校验结果将在`cb`内返回。可选参数`ops<Object>`，可以在当前方法调用时临时覆盖组件初始化的配置参数。

> 如果权限列表是异步返回的或是配置了`ajax`，同时没有配置`cb`，`hasPermission`将返回`null`，表示权限未知，区别于无权限`false`。

```javascript
const Permission = require('kuma-helpers/web/permission');
const permissionTest = new Permission({
  ajax() {
    return Promise.resolve(['find']);
  },
});

permissionTest.hasPermission(['find'], res => {
  console.log(res); // res => true
});

console.log(permissionTest.hasPermission(['find'])); //  res => null

const permissionTest2 = new Permission({
  permissionList: ['find', 'add'],
});

permissionTest2.hasPermission('del', res => {
  console.log(res); // res => false
});

console.log(permissionTest2.hasPermission('del')); //  res => false
```

### hasPermissionSync(permission, [ops])

同步返回用户权限方法。首个入参为需要判断的权限字符串`permission`（必传）。可选参数`ops<Object>`，可以在当前方法调用时临时覆盖组件初始化的配置参数。返回值为`Promise`。

```javascript
const Permission = require('kuma-helpers/web/permission');
const permissionTest = new Permission({
  ajax() {
    return Promise.resolve(['find']);
  },
});

(async => {
const permission = await permission.hasPermissionSync(['add', 'find', 'del']);
console.log(permission); // res => true
})();
```

### setting(ops, [overwrite=false])

更新组件配置。默认只更新有变动的配置。`overwrite`为设置覆写模式。设置为`true`时会将`ops`全量覆盖原有配置。

### clearPermission

清除权限列表。仅能清除`ajax`、`setPermission`设置的权限列表。

### setPermission(permissionList, [ops])

设置权限列表。首个入参为权限列表`permissionList<Array>`（必传）。可选参数`ops<Object>`，可以在当前方法调用时临时覆盖组件初始化的配置参数。

### getPermission([ops])

获取权限列表。仅能获取`ajax`、`setPermission`设置的权限列表。仅能获取可选参数`ops<Object>`，可以在当前方法调用时临时覆盖组件初始化的配置参数。

## OPTIONS

### ajax

``type： Fn<Permission>``

非必传，请求权限列表的方法。返回值必须为一个拍平的数组权限列表。

### saveName

``type: String``

非必传，权限列表的保存名称。与ajax或setPermission搭配配置，单独配置无效。

#### splitFlag

``type: RegExp``

``default： ,``

非必传，分割权限列表的标识符，默认为`,`。与ajax或setPermission搭配配置，单独配置无效。

> 权限列表默认储存在sessionStorage下，当浏览器不支持sessionStorage时将会储存在cookie中。由于sessionStorage与cookie都只支持存储字符串，所以需要将权限列表数组转成字符串存储。如果在权限数据中含有`,`，会造成权限字符串还原成数组时错误的分割数组。这时可以通过该配置项指定其他的分隔标识符。

```javascript
const Permission = require('kuma-helpers/web/permission');
const permissionTest = new Permission({
  ajax() {
    return Promise.resolve(['find', 'add', 'del']);
  },
  // 权限列表储存时将会被转换为 "find@add@del"
  splitFlag: '@'
});

```

#### loop

``type: Bool``
``defualt: true``

非必传，是否不等待ajax方法返回resolve直接返回权限校验结果。当resolve未返回时，权限将返回`null`。与ajax或setPermission搭配配置，单独配置无效。

> 如果您能确定权限列表不为空（通过其他方式设置了或之前已经发送过请求获取），可以设置为`false`避免意外造成的额外请求或等待。
>
> 如果在全局配置`loop = false`，由于`loop`配置优先级高于`ajax`，将导致不获取权限所有权限直接返回`null`。

```javascript
const Permission = require('kuma-helpers/web/permission');
const permissionTest = new Permission({
  ajax() {
    return new Promise(resolve => {
      setTimeout(() => resolve(['add', 'del']), 1000);
    });
  },
});

(async => {
const permission = await permission.hasPermissionSync(['add', 'find', 'del'], {
  loop: false,
});
// 结果将会立即返回
console.log(permission); // res => null
})();
```

#### time

``type: Number``
``defualt: 500``

非必传，轮询查询ajax方法是否已有返回值。默认500毫秒查询一次。与loop搭配配置，单独配置无效。

#### max

``type: Number``
``defualt: 120``

非必传，最大轮询查询次数。默认在120次停止查询，判断为服务器超时。与loop搭配配置，单独配置无效。

#### window

``type: Bool``

``defualt: false``

非必传，是否将权限列表储存在window变量下。与ajax或setPermission搭配配置，单独配置无效。

> 与配置项`splitFlag`互斥。因为window可以直接储存数组，无需再将权限列表数组转换为字符串储存。

#### sep

``type: Bool``

``defualt: false``

非必传，是否分别返回每一个传入权限的判断结果。

```javascript
const Permission = require('kuma-helpers/web/permission');
const permissionTest = new Permission({
  ajax() {
    return Promise.resolve(['find', 'add']);
  },
});

permissionTest.hasPermission(['find', 'del'], {
  sep: true,
}, res => {
  console.log(res); // res => { find: true, del: false }
});
```

#### permissionMode

``type: String< | or & >``

``defualt: |``

非必传，当传入多个权限时，权限的判断模式。默认为`或`关系。当多个权限有一个满足时，返回true。当设置为`与`关系时，需所有权限都满足，才返回true。入参可以为`|`或`&`。当配置项`sep`为true时，该配置项无效。

```javascript
const Permission = require('kuma-helpers/web/permission');
const permissionTest = new Permission({
  ajax() {
    return Promise.resolve(['find', 'add']);
  },
});

permissionTest.hasPermission(['find', 'del'], res => {
  console.log(res); // res => true
});

permissionTest.hasPermission(['find', 'del'], {
  permissionMode: '&',
}, res => {
  console.log(res); // res => false
});
```

#### getFn

``type: Function<Array>``

非必传，获取权限列表的方法。替换组件默认的权限获取方法。组件将不再负责获取权限列表，由您自己决定从哪里获取权限列表，例如`redux`或`vuex`。配置后`saveName`、`splitFlag`、`window`、`ajax`失效。需要返回权限列表的数组，也可以异步返回一个`Promise`。

```javascript
const Permission = require('kuma-helpers/web/permission');
const permissionTest = new Permission({
  getFn() {
    // 数据可以是同步返回或异步返回，具体逻辑自行定义
    return ['add', 'find'];
  },
});
```

#### permissionList

``type: Array``

非必传，传入权限列表。该配置优先级最高，配置后`getFn`、`saveName`、`splitFlag`、`window`、`ajax`失效。您可以随心所欲的用任何方式获取权限列表，组件将只负责权限的判断。

```javascript
const Permission = require('kuma-helpers/web/permission');

// 任意逻辑
// ...
const permissionList = ['find', 'del'];

const permissionTest = new Permission({
  permissionList,
});
```
