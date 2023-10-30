<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { getDownloadRecordDetailListForWechats, getDownloadRecordDetailListWechat } from '@/api/index';

  const router = useRouter();
  const reoute = useRoute();
  const loadings = ref(false);

  const loginInfor = sessionStorage.getItem('loginInfor');

  const gopage = (path) => {
    if (path === -1) {
      router.go(path);
    } else {
      router.push('/taskDetails');
    }
  };

  // 记录详情列表
  const page = ref(1);
  const total = ref(1);
  const recordsList: any = ref([]);
  const batchTaskId = reoute.query.batchTaskId;
  const mygetDownloadRecordDetailList = async () => {
    const data = {
      batchTaskId,
      page: page.value,
      pageSize: 10,
    };
    try {
      const res = await getDownloadRecordDetailListForWechats(data);
      if (res.code === 0) {
        recordsList.value.push(...res.data.result);
        total.value = res.data.total;
        page.value = res.data.page;
        loadings.value = false;
        console.log(res);
      }
      loadings.value = false;
    } catch (e) {
      loadings.value = false;
    }
  };

  // 微信模板消息跳转使用getDownloadRecordDetailListWechat
  const mygetDownloadRecordDetailListWechat = async () => {
    const data = {
      ...reoute.query,
      page: page.value,
      pageSize: 10,
    };
    try {
      const res = await getDownloadRecordDetailListWechat(data);
      if (res.code === 0) {
        recordsList.value.push(...res.data.result);
        total.value = res.data.total;
        page.value = res.data.page;
        loadings.value = false;
      }
      loadings.value = false;
    } catch (e) {
      loadings.value = false;
    }
  };

  // 加载更多
  const loading = ref(false);
  const noMore = ref(false);
  let timeout: ReturnType<typeof setTimeout>;
  const load = () => {
    if (recordsList.value.length >= total.value) {
      noMore.value = true;
      loading.value = false;
      return;
    }
    loading.value = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      page.value++;
      if (loginInfor) {
        mygetDownloadRecordDetailList();
      } else {
        mygetDownloadRecordDetailListWechat();
      }
    }, 2000);
  };

  const myscroll = (e) => {
    const element = e.target;
    const isLoad = element.scrollHeight - Math.abs(element.scrollTop) - element.clientHeight;
    if (isLoad <= 1) {
      load();
    }
  };

  const dloadDetail = () => {
    const url = import.meta.env.VITE_LOGIN_URL;
    console.log(url);
    if (url !== '/') {
      window.location.replace(url);
    }
  };

  onMounted(() => {
    loadings.value = true;
    if (loginInfor) {
      setTimeout(() => {
        mygetDownloadRecordDetailList();
      }, 1000);
    } else {
      setTimeout(() => {
        mygetDownloadRecordDetailListWechat();
      }, 1000);
    }
  });
</script>
<template>
  <div class="taskDetails" v-loading.fullscreen.lock="loadings" element-loading-text="努力加载中...">
    <van-icon v-if="loginInfor" @click="gopage(-1)" style="font-size: 25px; margin-bottom: 15px" name="arrow-left" />
    <div v-else style="height: 40px"></div>
    <div v-if="recordsList.length == 0 && !loadings" class="noList">
      <div>暂无数据</div>
    </div>
    <div
      v-if="recordsList.length > 0"
      class="taskDetails-scroll"
      :style="{ 'max-height': loginInfor ? '90vh' : '80vh' }"
      @scroll="myscroll"
    >
      <div class="scroll-list" v-for="item in recordsList" :key="item.barId">
        <div class="scroll-list-name">{{ item.barName }}</div>
        <div v-if="item.taskBarState === 4" style="color: #ff0000">下载异常</div>
        <div v-if="item.taskBarState === 1 || item.taskBarState === 2" style="color: #7ade81">下载中</div>
        <div v-if="item.taskBarState === 3" style="color: #ff9423">已完成</div>
        <div v-if="item.taskBarState === 5" style="color: #c0c0c0">已取消</div>
      </div>
      <div class="list-loadTitle">
        <div v-if="loading">
          <el-icon size="" color="" class="is-loading"> <Loading /> </el-icon>正在加载
        </div>
        <div v-if="noMore">没有更多了</div>
      </div>
    </div>
    <div v-if="recordsList.length > 0 && !loginInfor" class="taskDetails-load">
      <el-button icon="" size="large" type="primary" @click="dloadDetail">进入游戏下载</el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .taskDetails-scroll {
    max-height: 90vh;
    overflow-y: auto;
    .scroll-list {
      height: 100px;
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
      align-items: center;
      border: 1px solid #c0c0c0;
      margin-bottom: 50px;
      border-radius: 10px;
      .scroll-list-name {
        width: 80%;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .list-loadTitle {
      font-size: 30px;
      color: rgb(192, 192, 192);
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
    }
  }
  .noList {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
  }
  .taskDetails-load {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
</style>
