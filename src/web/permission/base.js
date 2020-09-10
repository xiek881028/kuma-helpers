import { isArray, isFunction, isPlainObject } from 'lodash/lang';

class BasePermission {
  constructor(props) {
    // sep 是否分开返回每个传入权限的结果
    // permissionMode 权限模式，默认为或
    // getFn 返回权限列表的方法，return 一个数组。
    // permissionList 权限列表，必须为一个数组。
    this.ops = props;
  }

  // 判断方法是否为promise
  #isPromise(fn) {
    return fn && typeof fn.then === 'function' && typeof fn.catch === 'function';
  }

  // 同步获取权限
  #getPermissionSync(_ops = {}) {
    return new Promise(async resolve => {
      const ops = { ...this.ops, ..._ops };
      // permissionList优先级最高
      if (ops?.permissionList !== undefined) {
        if (!isArray(ops.permissionList)) {
          throw new Error('permissionList 必须为 array');
        }
        return resolve(ops.permissionList);
      }
      const res = await ops.getFn();
      if (!isArray(res) && res !== null) {
        throw new Error('getFn 必须返回 array 或 null');
      }
      return resolve(res);
    });
  }

  // 异步获取权限
  #getPermission(_ops = {}) {
    const ops = { ...this.ops, ..._ops };
    // permissionList优先级最高
    if (ops?.permissionList !== undefined) {
      if (!isArray(ops.permissionList)) {
        throw new Error('permissionList 必须为 array');
      }
      return ops?.permissionList;
    }
    const noWaitRes = ops.getFn();
    // 如果是promise直接返回null
    if (this.#isPromise(noWaitRes)) {
      return null;
    } else {
      return noWaitRes;
    }
  }

  // 是否拥有权限判断方法
  #hasFn(permissionList = [], permission = [], permissionMode = '|') {
    let flag = false;
    const set = new Set(permissionList);
    let allIndex = 0;
    for (let i = 0; i < permission.length; i++) {
      const el = permission[i];
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
  }

  // 同步判断权限
  hasPermissionSync(_permission = [], _ops = {}) {
    const ops = { ...this.ops, ..._ops };
    const permissionMode = ops?.permissionMode ?? '|';
    const sep = ops?.sep ?? false;
    const permission = typeof _permission === 'string' ? [_permission] : _permission;
    // 因为如果本地没有获取到权限，需要接口请求获取，所以返回一个promise
    return new Promise(async resolve => {
      const permissionList = await this.#getPermissionSync(ops);
      if (permissionList === null) return resolve(null);
      if (sep) {
        const out = {};
        for (let i = 0; i < permission.length; i++) {
          const el = permission[i];
          out[el] = this.#hasFn(permissionList, [el], permissionMode);
        }
        return resolve(out);
      } else {
        return resolve(this.#hasFn(permissionList, permission, permissionMode));
      }
    });
  }

  // 异步判断权限
  hasPermission(_permission = [], ...params) {
    let cb, _ops;
    for (const item of params) {
      if (isFunction(item)) {
        cb = item;
      } else if (isPlainObject(item)) {
        _ops = item;
      }
    }
    const ops = { ...this.ops, ..._ops };
    if (cb) {
      this.hasPermissionSync(_permission, ops).then(res => {
        cb(res);
      });
      return;
    }
    const permissionList = this.#getPermission(ops);
    const permission = typeof _permission === 'string' ? [_permission] : _permission;
    const sep = ops?.sep ?? false;
    const permissionMode = ops?.permissionMode ?? '|';
    if (permissionList === null) return null;
    if (sep) {
      const out = {};
      for (let i = 0; i < permission.length; i++) {
        const el = permission[i];
        out[el] = this.#hasFn(permissionList, [el], permissionMode);
      }
      return out;
    } else {
      return this.#hasFn(permissionList, permission, permissionMode);
    }
  }

  // 更新配置
  setting(ops = {}, overwrite = false) {
    this.ops = overwrite ? ops : {
      ...this.ops,
      ...ops,
    };
  }
}

export default BasePermission;
