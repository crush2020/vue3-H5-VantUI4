import { lang } from '@/i18n/lang/en-us';
<script setup lang="ts">
  import { useRoute } from 'vue-router';

  const route = useRoute();
</script>

<template>
  <div class="noAuth">
    <img src="@/assets/errorDownload.png" />

    <template v-if="route.query.type">
      <div>当前账号无权限查看</div>
      <div>请联系加盟商配置查看权限</div>
    </template>

    <template v-else>
      <div>当前账号被禁用</div>
      <div>请联系加盟商启用员工状态</div>
    </template>
  </div>
</template>
<style scope lang="scss">
  .noAuth {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      height: 650px;
      width: 750px;
    }
  }
</style>
