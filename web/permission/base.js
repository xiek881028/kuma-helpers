import "core-js/modules/es.symbol";
import "core-js/modules/es.array.filter";
import "core-js/modules/es.array.for-each";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.object.get-own-property-descriptor";
import "core-js/modules/es.object.get-own-property-descriptors";
import "core-js/modules/es.object.keys";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.promise";
import "core-js/modules/es.set";
import "core-js/modules/es.string.iterator";
import "core-js/modules/es.weak-set";
import "core-js/modules/esnext.set.add-all";
import "core-js/modules/esnext.set.delete-all";
import "core-js/modules/esnext.set.difference";
import "core-js/modules/esnext.set.every";
import "core-js/modules/esnext.set.filter";
import "core-js/modules/esnext.set.find";
import "core-js/modules/esnext.set.intersection";
import "core-js/modules/esnext.set.is-disjoint-from";
import "core-js/modules/esnext.set.is-subset-of";
import "core-js/modules/esnext.set.is-superset-of";
import "core-js/modules/esnext.set.join";
import "core-js/modules/esnext.set.map";
import "core-js/modules/esnext.set.reduce";
import "core-js/modules/esnext.set.some";
import "core-js/modules/esnext.set.symmetric-difference";
import "core-js/modules/esnext.set.union";
import "core-js/modules/esnext.weak-set.add-all";
import "core-js/modules/esnext.weak-set.delete-all";
import "core-js/modules/web.dom-collections.for-each";
import "core-js/modules/web.dom-collections.iterator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

import { isArray, isFunction, isPlainObject } from 'lodash/lang';

var _isPromise = new WeakSet();

var _getPermissionSync = new WeakSet();

var _getPermission = new WeakSet();

var _hasFn = new WeakSet();

var BasePermission = /*#__PURE__*/function () {
  function BasePermission(props) {
    _classCallCheck(this, BasePermission);

    _hasFn.add(this);

    _getPermission.add(this);

    _getPermissionSync.add(this);

    _isPromise.add(this);

    // sep 是否分开返回每个传入权限的结果
    // permissionMode 权限模式，默认为或
    // getFn 返回权限列表的方法，return 一个数组。
    // permissionList 权限列表，必须为一个数组。
    this.ops = props;
  } // 判断方法是否为promise


  _createClass(BasePermission, [{
    key: "hasPermissionSync",
    // 同步判断权限
    value: function hasPermissionSync() {
      var _ops$permissionMode,
          _ops$sep,
          _this = this;

      var _permission = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var _ops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var ops = _objectSpread(_objectSpread({}, this.ops), _ops);

      var permissionMode = (_ops$permissionMode = ops === null || ops === void 0 ? void 0 : ops.permissionMode) !== null && _ops$permissionMode !== void 0 ? _ops$permissionMode : '|';
      var sep = (_ops$sep = ops === null || ops === void 0 ? void 0 : ops.sep) !== null && _ops$sep !== void 0 ? _ops$sep : false;
      var permission = typeof _permission === 'string' ? [_permission] : _permission; // 因为如果本地没有获取到权限，需要接口请求获取，所以返回一个promise

      return new Promise( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(resolve) {
          var permissionList, out, i, el;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _classPrivateMethodGet(_this, _getPermissionSync, _getPermissionSync2).call(_this, ops);

                case 2:
                  permissionList = _context.sent;

                  if (!(permissionList === null)) {
                    _context.next = 5;
                    break;
                  }

                  return _context.abrupt("return", resolve(null));

                case 5:
                  if (!sep) {
                    _context.next = 11;
                    break;
                  }

                  out = {};

                  for (i = 0; i < permission.length; i++) {
                    el = permission[i];
                    out[el] = _classPrivateMethodGet(_this, _hasFn, _hasFn2).call(_this, permissionList, [el], permissionMode);
                  }

                  return _context.abrupt("return", resolve(out));

                case 11:
                  return _context.abrupt("return", resolve(_classPrivateMethodGet(_this, _hasFn, _hasFn2).call(_this, permissionList, permission, permissionMode)));

                case 12:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    } // 异步判断权限

  }, {
    key: "hasPermission",
    value: function hasPermission() {
      var _ops$sep2, _ops$permissionMode2;

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

      var ops = _objectSpread(_objectSpread({}, this.ops), _ops);

      if (cb) {
        this.hasPermissionSync(_permission, ops).then(function (res) {
          cb(res);
        });
        return;
      }

      var permissionList = _classPrivateMethodGet(this, _getPermission, _getPermission2).call(this, ops);

      var permission = typeof _permission === 'string' ? [_permission] : _permission;
      var sep = (_ops$sep2 = ops === null || ops === void 0 ? void 0 : ops.sep) !== null && _ops$sep2 !== void 0 ? _ops$sep2 : false;
      var permissionMode = (_ops$permissionMode2 = ops === null || ops === void 0 ? void 0 : ops.permissionMode) !== null && _ops$permissionMode2 !== void 0 ? _ops$permissionMode2 : '|';
      if (permissionList === null) return null;

      if (sep) {
        var out = {};

        for (var i = 0; i < permission.length; i++) {
          var el = permission[i];
          out[el] = _classPrivateMethodGet(this, _hasFn, _hasFn2).call(this, permissionList, [el], permissionMode);
        }

        return out;
      } else {
        return _classPrivateMethodGet(this, _hasFn, _hasFn2).call(this, permissionList, permission, permissionMode);
      }
    } // 更新配置

  }, {
    key: "setting",
    value: function setting() {
      var ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var overwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.ops = overwrite ? ops : _objectSpread(_objectSpread({}, this.ops), ops);
    }
  }]);

  return BasePermission;
}();

var _isPromise2 = function _isPromise2(fn) {
  return fn && typeof fn.then === 'function' && typeof fn.catch === 'function';
};

var _getPermissionSync2 = function _getPermissionSync2() {
  var _this2 = this;

  var _ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return new Promise( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(resolve) {
      var ops, res;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              ops = _objectSpread(_objectSpread({}, _this2.ops), _ops); // permissionList优先级最高

              if (!((ops === null || ops === void 0 ? void 0 : ops.permissionList) !== undefined)) {
                _context2.next = 5;
                break;
              }

              if (isArray(ops.permissionList)) {
                _context2.next = 4;
                break;
              }

              throw new Error('permissionList 必须为 array');

            case 4:
              return _context2.abrupt("return", resolve(ops.permissionList));

            case 5:
              _context2.next = 7;
              return ops.getFn();

            case 7:
              res = _context2.sent;

              if (!(!isArray(res) && res !== null)) {
                _context2.next = 10;
                break;
              }

              throw new Error('getFn 必须返回 array 或 null');

            case 10:
              return _context2.abrupt("return", resolve(res));

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
};

var _getPermission2 = function _getPermission2() {
  var _ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var ops = _objectSpread(_objectSpread({}, this.ops), _ops); // permissionList优先级最高


  if ((ops === null || ops === void 0 ? void 0 : ops.permissionList) !== undefined) {
    if (!isArray(ops.permissionList)) {
      throw new Error('permissionList 必须为 array');
    }

    return ops === null || ops === void 0 ? void 0 : ops.permissionList;
  }

  var noWaitRes = ops.getFn(); // 如果是promise直接返回null

  if (_classPrivateMethodGet(this, _isPromise, _isPromise2).call(this, noWaitRes)) {
    return null;
  } else {
    return noWaitRes;
  }
};

var _hasFn2 = function _hasFn2() {
  var permissionList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var permission = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var permissionMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '|';
  var flag = false;
  var set = new Set(permissionList);
  var allIndex = 0;

  for (var i = 0; i < permission.length; i++) {
    var el = permission[i];

    if (set.has(el)) {
      if (permissionMode === '|') {
        flag = true;
        break;
      } else {
        allIndex += 1;
      }
    }
  }

  if (permissionMode !== '|' && allIndex === permission.length) {
    flag = true;
  }

  return flag;
};

export default BasePermission;