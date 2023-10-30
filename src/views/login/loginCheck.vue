<script lang="ts" setup name="loginChech">
  import { onMounted } from 'vue';
  import { param2Obj } from '@/utils/comm';
  import { useRouter } from 'vue-router';
  import { loginFromComplexPlatform } from '@/api/index';
  import { checkPermission } from '@/utils/public.js';
  import { showNotify } from 'vant';

  const router = useRouter();

  onMounted(() => {
    sessionStorage.clear();
    getUserinfor();
  });

  // 重新去登录平台走微信登录
  const getUrl = async () => {
    const url = import.meta.env.VITE_LOGIN_URL;
    if (url !== '/') {
      window.location.replace(url);
    }
  };

  // 网维免登陆获取信息
  const getloginFromComplexPlatform = async (data) => {
    const res = await loginFromComplexPlatform(data);
    if (res.code === 0) {
      console.log('我从网维平台跳转免登陆成功');
      sessionStorage.setItem('loginInfor', JSON.stringify(res.data));
      if (!checkPermission(['batch-game'])) {
        showNotify('暂无权限');
        router.push({
          path: 'noAuth',
          query: {
            type: 1,
          },
        });
        return;
      }
      console.log(res);
      router.push({
        path: 'gameDownload',
        query: {
          state: res.data.state,
        },
      });
    }
  };

  // 验证逻辑
  const getUserinfor = async () => {
    const data = param2Obj(window.location.href);
    console.log(data);
    // 是否微信重定向
    if (data.identity && data.productKey) {
      getloginFromComplexPlatform(data);
    } else if (data.batchTaskId) {
      //微信模板消息跳转使用
      router.push({
        path: 'taskDetails',
        query: {
          ...data,
        },
      });
    } else {
      console.log('没有参数identity或者productKey');
      getUrl();
    }
  };
</script>
<template>
  <div></div>
</template>
<style scoped lang="scss"></style>
