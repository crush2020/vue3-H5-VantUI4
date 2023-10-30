<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue';

  const router = useRouter();
  const kedouId = ref('');
  // 重定向至微信登录重新获取ticket
  const gopage = (path) => {
    if (path === '') {
      window.location.href = '';
    } else {
      router.push(path);
    }
  };

  onMounted(() => {
    let loginInfor: any = sessionStorage.getItem('loginInfor');
    loginInfor = JSON.parse(loginInfor);
    kedouId.value = loginInfor.kedouId;
  });
</script>
<template>
  <div class="heard">
    <div @click="gopage('')" class="heard_left">
      <img src="../../assets/user.png" alt="" />
      <div class="heard_name">{{ kedouId }}</div>
      <van-icon name="sort" />
    </div>
    <div class="heard_right" @click="gopage('downloadRecord')">
      <img src="../../assets/download.png" alt="" />
      <div>下载记录</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .heard {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
    .heard_left {
      display: flex;
      align-items: center;
      width: 68%;
      .heard_name {
        margin: 0 5px;
        max-width: 90%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      img {
        width: 40px;
        height: 40px;
      }
    }
    .heard_right {
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
      }
      div {
        margin-left: 8px;
        margin-bottom: 2px;
      }
    }
  }
</style>
