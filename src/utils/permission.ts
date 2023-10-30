export const Permission = {
  install(Vue) {
    // 自定义指令v-permission：
    Vue.directive('permission', {
      mounted(el, binding) {
        checkPermission(el, binding);
      },
      updated(el, binding) {
        checkPermission(el, binding);
      },
    });
    // 权限检查方法
    function checkPermission(el, binding) {
      /** 存放value值 */
      const btnRoles = binding.value;
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
            if (!hasPermission) {
              el.parentNode && el.parentNode.removeChild(el);
            }
          } else {
            throw new Error("传入关于权限的数组，如 v-permission=\"['single','single-game']\"");
          }
        }
      }
    }
  },
};
export default Permission;
