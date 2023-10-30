import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { showNotify } from 'vant';
import router from '../../router/index';
import qs from 'qs';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ENV || import.meta.env.VITE_BASE_API,
  withCredentials: false,
  timeout: 10000,
});

const url = import.meta.env.VITE_LOGIN_URL;

const code2Message = {
  10001: '没有权限',
  10003: '请先登录',
  10004: '没办法操作对应的网吧',
  10005: '渠道平台数据查询失败',
  10006: '用户信息不存在',
  10007: '身份校验失败',
  10008: '网吧分组不存在',
  10009: '网吧分组名称已存在',
  10010: '超出自定义分类上限32个,不可添加',
  10011: '本地游戏"分类不可删除',
  10012: '下载任务不能超过10个,请稍后再试',
  10013: '同步任务不能超过指定数量,请稍后再试',
  10014: '没有批量任务的权限',
  10015: '请检验前置权限',
  10016: '非本团队角色',
  10017: '不是自定义角色不可删除',
  10018: '该角色已关联员工，需先将关联的员工重新分配角色，才能删除该角色',
  10020: '加盟商平台员工数据校验错误',
  10021: '非本团队员工，不可更换角色',
  10022: '该用户已被禁用',
  10023: '该用户没有当前功能权限',
  10024: '请校验权限是否存在',
  10050: '验证码不匹配',
  10051: '验证码已过期',
  10052: '验证码发送失败',
  30001: '下载失败',
  30002: '同步失败',
  30003: '文件操作错误',
  30004: '分类下存在游戏',
  30005: '设置服务器缓存参数错误',
  30006: '查询不到服务器信息',
  30007: '查询不到客户机信息',
  30008: '与其他客户机信息冲突',
  30009: '分组名不能为空',
  30010: '分组名已存在',
  30011: '默认分组不能删除',
  30012: '开机命令下载失败',
  30013: '开机命令解压失败',
  30014: '开机命令索引失败',
  30015: '开机命标题已使用',
  30016: '开机命标题不能为空',
  30017: '壁纸下载错误',
  30018: '分组不存在',
  30019: '开机命令Bat写失败',
};

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let loginInfor: any = sessionStorage.getItem('loginInfor');
    loginInfor = JSON.parse(loginInfor);
    if (loginInfor) {
      config.params = Object.assign(config.params ? config.params : {}, {
        token: loginInfor.token,
        frontUserId: loginInfor.frontUserId,
        brandId: loginInfor.brandId,
      });
    }
    if (config.data) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// const gologin = (item) => {
//   const loginArr = []
//   if(loginArr.in)
// }

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    switch (res.code) {
      case 0:
        return res;
        break;
      case 10022:
        router.push('noAuth');
        break;
      case 10003:
        showNotify(code2Message[res.code]);
        if (url !== '/') {
          window.location.replace(url);
        }
        break;
      case 10007:
        showNotify(code2Message[res.code]);
        if (url !== '/') {
          window.location.replace(url);
        }
        break;
      default:
        showNotify(code2Message[res.code]);
        return Promise.reject(res.msg || 'Error');
    }
  },
  (error: AxiosError) => {
    console.log('err' + error);
    showNotify(error.message);
    return Promise.reject(error.message);
  },
);

export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};

export default service;
