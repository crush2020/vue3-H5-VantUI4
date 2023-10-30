// 权限检查方法
export function checkPermission(btnRoles: Array<any>) {
  /** 存放value值 */
  const userInfo = JSON.parse(sessionStorage.getItem('loginInfor') ?? '{}');
  // 排除加盟商（拥有所有权限）
  if (userInfo.parentUserId && userInfo.parentUserId !== 0) {
    // 取一下本地存的账号权限
    const userRoles = userInfo.permissions ?? [];
    // 判断自定义指令的传值，在账号权限数组中能否找到
    if (btnRoles && btnRoles instanceof Array) {
      if (btnRoles.length) {
        // 能找到返回true
        const hasPermission = userRoles.some((v) => {
          return btnRoles.includes(v);
        });
        // 找不到返回false，使用自定义指令的钩子函数，操作dom元素删除该节点
        return hasPermission;
      } else {
        throw new Error("传入关于权限的数组，如['single','single-game']");
      }
    }
  }
  return true;
}
/**
 * [fnFormatData 标准日期/时间戳 格式化]
 * @param  {[Date,number]} pDate [需要格式的标准日期/时间戳]
 * @param  {[String]} pFmt  [例子：yyyy-MM-dd hh:mm:ss 连接上做处理]
 * @return {[String]}      [返回格式化后的的时间]
 * like 1610092364000 => 2021-01-08 15:52:44
 */
export function fnFormatData(pDate: number | Date, pFmt = 'yyyy-MM-dd hh:mm:ss'): any {
  if (!pDate) return '';
  const aDate = new Date(+pDate);
  const o = {
    'M+': aDate.getMonth() + 1, // 月份
    'd+': aDate.getDate(), // 日
    'h+': aDate.getHours(), // 小时
    'm+': aDate.getMinutes(), // 分
    's+': aDate.getSeconds(), // 秒
    'q+': Math.floor((aDate.getMonth() + 3) / 3), // 季度
    S: aDate.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(pFmt)) {
    pFmt = pFmt.replace(RegExp.$1, (aDate.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(pFmt)) {
      pFmt = pFmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  // console.log(pFmt)
  return pFmt;
}
