import "core-js/modules/es.symbol";
import "core-js/modules/es.array.filter";
import "core-js/modules/es.array.for-each";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.array.join";
import "core-js/modules/es.object.get-own-property-descriptor";
import "core-js/modules/es.object.get-own-property-descriptors";
import "core-js/modules/es.object.keys";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.promise";
import "core-js/modules/es.regexp.exec";
import "core-js/modules/es.string.iterator";
import "core-js/modules/es.string.split";
import "core-js/modules/es.weak-map";
import "core-js/modules/esnext.weak-map.delete-all";
import "core-js/modules/web.dom-collections.for-each";
import "core-js/modules/web.dom-collections.iterator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _classPrivateFieldGet from "@babel/runtime/helpers/classPrivateFieldGet";
import _classPrivateFieldSet from "@babel/runtime/helpers/classPrivateFieldSet";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import storageAvailable from '../storageAvailable/index';
import Cookies from 'js-cookie';
import BasePermission from './base';
import { isArray, isFunction, isPlainObject } from 'lodash/lang';

var _getLoading = new WeakMap();

var _saveName = new WeakMap();

var _basePermission = new WeakMap();

var Permission = /*#__PURE__*/function () {
  function Permission(props) {
    var _this$ops$saveName, _this$ops;

    _classCallCheck(this, Permission);

    _getLoading.set(this, {
      writable: true,
      value: {}
    });

    _saveName.set(this, {
      writable: true,
      value: void 0
    });

    _basePermission.set(this, {
      writable: true,
      value: void 0
    });

    // ajax 获取权限的ajax，返回值需要为一个promise
    // saveName 在sessionStorage或cookie下保存权限信息的名称
    // splitFlag 自定义分割字符串。因为储存信息为字符串，转换为数组时可能出现错误分割，在window设置时该配置项无效
    // loop 是否需要立即返回权限校验结果，而不等ajax返回结果（无结果时返回null，有权限返回true，无权限返回false）,与ajax配置项配合使用，单独使用配置无效
    // time 每隔500毫秒查询一次权限是否有返回结果,与ajax配置项配合使用，单独使用配置无效
    // max 最大查询循环次数,与ajax配置项配合使用，单独使用配置无效
    // window 是否储存在window全局变量里,与ajax配置项配合使用，单独使用配置无效
    // sep 是否分开返回每个传入权限的结果
    // permissionMode 权限模式，默认为或
    // getFn 返回权限列表的方法，return 一个数组。优先级高于window、saveName配置
    // permissionList 权限列表，必须为一个数组，与配置项ajax、getFn互斥，优先级高于ajax、getFn
    this.ops = props;

    _classPrivateFieldSet(this, _basePermission, new BasePermission(this.ops));

    _classPrivateFieldSet(this, _saveName, (_this$ops$saveName = (_this$ops = this.ops) === null || _this$ops === void 0 ? void 0 : _this$ops.saveName) !== null && _this$ops$saveName !== void 0 ? _this$ops$saveName : '__global__bagazhu__permission__');

    this.clearPermission();
  } // 清除权限储存


  _createClass(Permission, [{
    key: "clearPermission",
    value: function clearPermission() {
      storageAvailable('sessionStorage') && sessionStorage.removeItem(_classPrivateFieldGet(this, _saveName));
      window[_classPrivateFieldGet(this, _saveName)] = undefined;
      Cookies.remove(_classPrivateFieldGet(this, _saveName));
    } // 设置权限

  }, {
    key: "setPermission",
    value: function setPermission() {
      var _ops$saveName, _ops$splitFlag;

      var _permission = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var _ops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var ops = _objectSpread(_objectSpread({}, this.ops), _ops);

      var saveName = (_ops$saveName = ops === null || ops === void 0 ? void 0 : ops.saveName) !== null && _ops$saveName !== void 0 ? _ops$saveName : _classPrivateFieldGet(this, _saveName);
      var permission = typeof _permission === 'string' ? [_permission] : _permission;
      var permissionStr = permission.join((_ops$splitFlag = ops === null || ops === void 0 ? void 0 : ops.splitFlag) !== null && _ops$splitFlag !== void 0 ? _ops$splitFlag : ',');

      if (ops === null || ops === void 0 ? void 0 : ops.window) {
        window[saveName] = permission;
      } else if (storageAvailable('sessionStorage')) {
        sessionStorage.setItem(saveName, permissionStr);
      } else {
        // 浏览器不支持sessionStorage，放入cookie
        Cookies.set(saveName, permissionStr);
      }
    } // 同步获取权限

  }, {
    key: "getPermission",
    value: function getPermission() {
      var _ops$saveName2;

      var _ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var ops = _objectSpread(_objectSpread({}, this.ops), _ops);

      var saveName = (_ops$saveName2 = ops === null || ops === void 0 ? void 0 : ops.saveName) !== null && _ops$saveName2 !== void 0 ? _ops$saveName2 : _classPrivateFieldGet(this, _saveName);

      if (ops === null || ops === void 0 ? void 0 : ops.window) {
        var _window$saveName;

        return (_window$saveName = window[saveName]) !== null && _window$saveName !== void 0 ? _window$saveName : null;
      } else if (storageAvailable('sessionStorage')) {
        var _sessionStorage$getIt, _sessionStorage$getIt2, _ops$splitFlag2;

        return (_sessionStorage$getIt = (_sessionStorage$getIt2 = sessionStorage.getItem(saveName)) === null || _sessionStorage$getIt2 === void 0 ? void 0 : _sessionStorage$getIt2.split((_ops$splitFlag2 = ops === null || ops === void 0 ? void 0 : ops.splitFlag) !== null && _ops$splitFlag2 !== void 0 ? _ops$splitFlag2 : ',')) !== null && _sessionStorage$getIt !== void 0 ? _sessionStorage$getIt : null;
      } else {
        var _Cookies$get$split, _Cookies$get, _ops$splitFlag3;

        return (_Cookies$get$split = (_Cookies$get = Cookies.get(saveName)) === null || _Cookies$get === void 0 ? void 0 : _Cookies$get.split((_ops$splitFlag3 = ops === null || ops === void 0 ? void 0 : ops.splitFlag) !== null && _ops$splitFlag3 !== void 0 ? _ops$splitFlag3 : ',')) !== null && _Cookies$get$split !== void 0 ? _Cookies$get$split : null;
      }
    } // 同步判断权限

  }, {
    key: "hasPermissionSync",
    value: function () {
      var _hasPermissionSync = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
        var _this = this;

        var _permission,
            _ops,
            ops,
            _args3 = arguments;

        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _permission = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : [];
                _ops = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
                ops = _objectSpread(_objectSpread({
                  getFn: function () {
                    var _getFn = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
                                var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(resolve) {
                                  var _ops$loop, _ops$time, _ops$max;

                                  var ops, ajax, loop, time, max, permissionList, ajaxRes, _res, index, timer;

                                  return _regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                      switch (_context.prev = _context.next) {
                                        case 0:
                                          ops = _objectSpread(_objectSpread({}, _this.ops), _ops);
                                          ajax = ops === null || ops === void 0 ? void 0 : ops.ajax;
                                          loop = (_ops$loop = ops === null || ops === void 0 ? void 0 : ops.loop) !== null && _ops$loop !== void 0 ? _ops$loop : true;
                                          time = (_ops$time = ops === null || ops === void 0 ? void 0 : ops.time) !== null && _ops$time !== void 0 ? _ops$time : 500;
                                          max = (_ops$max = ops === null || ops === void 0 ? void 0 : ops.max) !== null && _ops$max !== void 0 ? _ops$max : 120;
                                          permissionList = _this.getPermission(ops); // permission为null表示未初始化，区别于无任何权限的[]

                                          if (!(permissionList === null)) {
                                            _context.next = 28;
                                            break;
                                          }

                                          if (loop) {
                                            _context.next = 9;
                                            break;
                                          }

                                          return _context.abrupt("return", resolve(null));

                                        case 9:
                                          if (isFunction(ajax)) {
                                            _context.next = 11;
                                            break;
                                          }

                                          throw new Error('ajax 必须是一个 Function');

                                        case 11:
                                          if (_classPrivateFieldGet(_this, _getLoading)[ops.saveName]) {
                                            _context.next = 24;
                                            break;
                                          }

                                          _classPrivateFieldGet(_this, _getLoading)[ops.saveName] = true;
                                          _context.next = 15;
                                          return ajax();

                                        case 15:
                                          ajaxRes = _context.sent;

                                          if (isArray(ajaxRes)) {
                                            _context.next = 18;
                                            break;
                                          }

                                          throw new Error('ajax 必须返回 array 或 string');

                                        case 18:
                                          _this.setPermission(ajaxRes, ops);

                                          _res = _this.getPermission(ops);
                                          _classPrivateFieldGet(_this, _getLoading)[ops.saveName] = false;
                                          resolve(_res);
                                          _context.next = 26;
                                          break;

                                        case 24:
                                          index = 0;
                                          timer = setInterval(function () {
                                            // 设置loop，防止死循环
                                            var res = _this.getPermission(ops);

                                            if (index > max || res !== null) {
                                              clearInterval(timer);
                                              resolve(res !== null && res !== void 0 ? res : []);
                                            } else {
                                              index += 1;
                                            }
                                          }, time);

                                        case 26:
                                          _context.next = 29;
                                          break;

                                        case 28:
                                          resolve(permissionList);

                                        case 29:
                                        case "end":
                                          return _context.stop();
                                      }
                                    }
                                  }, _callee);
                                }));

                                return function (_x) {
                                  return _ref.apply(this, arguments);
                                };
                              }()));

                            case 1:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    }));

                    function getFn() {
                      return _getFn.apply(this, arguments);
                    }

                    return getFn;
                  }()
                }, this.ops), _ops);
                return _context3.abrupt("return", _classPrivateFieldGet(this, _basePermission).hasPermissionSync(_permission, ops));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function hasPermissionSync() {
        return _hasPermissionSync.apply(this, arguments);
      }

      return hasPermissionSync;
    }() // 异步判断权限

  }, {
    key: "hasPermission",
    value: function hasPermission() {
      var _this2 = this;

      var _permission = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var cb, _ops;

      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      for (var _i = 0, _params = params; _i < _params.length; _i++) {
        var item = _params[_i];

        if (isFunction(item)) {
          cb = item;
        } else if (isPlainObject(item)) {
          _ops = item;
        }
      }

      var mergeOps = _objectSpread(_objectSpread({}, this.ops), _ops);

      var ops = _objectSpread({
        getFn: function getFn() {
          return _this2.getPermission(mergeOps);
        }
      }, mergeOps);

      if (cb) {
        this.hasPermissionSync(_permission, mergeOps).then(function (res) {
          cb(res);
        });
        return;
      }

      return _classPrivateFieldGet(this, _basePermission).hasPermission(_permission, ops);
    }
  }, {
    key: "setting",
    value: function setting(ops) {
      var overwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.ops = overwrite ? ops : _objectSpread(_objectSpread({}, this.ops), ops);
      return _classPrivateFieldGet(this, _basePermission).setting(this.ops, overwrite);
    }
  }]);

  return Permission;
}();

export default Permission;