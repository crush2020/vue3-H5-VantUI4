import { http } from '@/utils/request';

// Ⅸ--网维综合平台免登
export function loginFromComplexPlatform(data) {
  return http.post(`/wangwei/loginFromComplexPlatform`, data);
}

// 分页获取资源游戏列表
export function getResourceList(data) {
  return http.get(`/wangwei/auth/getResourceList`, {
    params: data,
  });
}

// Ⅸ-网吧分组树查询
export function getChooseBarTree(data) {
  return http.get(`/wangwei/auth/getChooseBarTree`, {
    params: data,
  });
}

// Ⅸ-批量下载
export function batchDownload(data) {
  return http.post(`/wangwei/auth/batchDownload`, data);
}

// 查询下载记录列表
export function getDownloadRecordsList(data) {
  return http.get(`/wangwei/auth/getDownloadRecordsList`, {
    params: data,
  });
}

// 下载记录详情分页查询
export function getDownloadRecordDetailListForWechats(data) {
  return http.get(`/wangwei/batch/getDownloadRecordDetailListForWechat`, {
    params: data,
  });
}

// 下载记录详情分页查询（微信模板消息跳转使用）
export function getDownloadRecordDetailListWechat(data) {
  return http.get(`/wangwei/getDownloadRecordDetailList`, {
    params: data,
  });
}
