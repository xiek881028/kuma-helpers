import storageAvailable from '../storageAvailable/index';
import Cookies from 'js-cookie';
import BasePermission from './base';
import { isArray, isFunction, isPlainObject } from 'lodash/lang';

class Permission {
  #getLoading = {};
  #saveName;
  #basePermission;
  constructor(props) {
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
    this.#basePermission = new BasePermission(this.ops);
    this.#saveName = this.ops?.saveName ?? '__global__bagazhu__permission__';
    this.clearPermission();
  }

  // 清除权限储存
  clearPermission() {
    storageAvailable('sessionStorage') && sessionStorage.removeItem(this.#saveName);
    window[this.#saveName] = undefined;
    Cookies.remove(this.#saveName);
  }

  // 设置权限
  setPermission(_permission = [], _ops = {}) {
    const ops = { ...this.ops, ..._ops };
    const saveName = ops?.saveName ?? this.#saveName;
    let permission = typeof _permission === 'string' ? [_permission] : _permission;
    const permissionStr = permission.join(ops?.splitFlag ?? ',');
    if (ops?.window) {
      window[saveName] = permission;
    } else if (storageAvailable('sessionStorage')) {
      sessionStorage.setItem(saveName, permissionStr);
    } else {
      // 浏览器不支持sessionStorage，放入cookie
      Cookies.set(saveName, permissionStr);
    }
  }

  // 同步获取权限
  getPermission(_ops = {}) {
    const ops = { ...this.ops, ..._ops };
    const saveName = ops?.saveName ?? this.#saveName;
    if (ops?.window) {
      return window[saveName] ?? null;
    } else if (storageAvailable('sessionStorage')) {
      return sessionStorage.getItem(saveName)?.split(ops?.splitFlag ?? ',') ?? null;
    } else {
      return Cookies.get(saveName)?.split(ops?.splitFlag ?? ',') ?? null;
    }
  }

  // 同步判断权限
  async hasPermissionSync(_permission = [], _ops = {}) {
    const ops = {
      getFn: async () => {
        return new Promise(async resolve => {
          const ops = { ...this.ops, ..._ops };
          const ajax = ops?.ajax;
          const loop = ops?.loop ?? true;
          const time = ops?.time ?? 500;
          const max = ops?.max ?? 120;
          const permissionList = this.getPermission(ops);
          // permission为null表示未初始化，区别于无任何权限的[]
          if (permissionList === null) {
            // 在请求数据时，每隔500ms询问一次权限返回结果，120次（60秒服务器默认超时504）后仍未返回，权限判断返回false
            if (!loop) return resolve(null);
            if(!isFunction(ajax)) {
              throw new Error('ajax 必须是一个 Function');
            }
            // 设置开关变量，防止多次请求服务器获取权限数据
            // 不同的saveName使用不同的开关，防止数据混合
            if (!this.#getLoading[ops.saveName]) {
              this.#getLoading[ops.saveName] = true;
              const ajaxRes = await ajax();
              if (!isArray(ajaxRes)) {
                throw new Error('ajax 必须返回 array 或 string');
              }
              this.setPermission(ajaxRes, ops);
              const _res = this.getPermission(ops);
              this.#getLoading[ops.saveName] = false;
              resolve(_res);
            } else {
              let index = 0;
              const timer = setInterval(() => {
                // 设置loop，防止死循环
                const res = this.getPermission(ops);
                if (index > max || res !== null) {
                  clearInterval(timer);
                  resolve(res ?? []);
                } else {
                  index += 1;
                }
              }, time);
            }
          } else {
            resolve(permissionList);
          }
        });
      },
      ...this.ops,
      ..._ops
    };
    return this.#basePermission.hasPermissionSync(_permission, ops);
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
    const mergeOps = { ...this.ops, ..._ops };
    let ops = {
      getFn: () => {
        return this.getPermission(mergeOps);
      },
      ...mergeOps,
    };
    if (cb) {
      this.hasPermissionSync(_permission, mergeOps).then(res => {
        cb(res);
      });
      return;
    }
    return this.#basePermission.hasPermission(_permission, ops);
  }

  setting(ops, overwrite = false) {
    this.ops = overwrite ? ops : {
      ...this.ops,
      ...ops,
    };
    return this.#basePermission.setting(this.ops, overwrite);
  }
}

export default Permission;
