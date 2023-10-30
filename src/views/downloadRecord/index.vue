<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { getDownloadRecordsList } from '@/api/index';

  const router = useRouter();
  const gopage = (path, batchTaskId) => {
    if (path === -1) {
      router.go(path);
    } else {
      router.push({
        path: '/taskDetails',
        query: { batchTaskId },
      });
    }
  };

  // loading
  const loadings = ref(false);

  // 记录列表
  const page = ref(1);
  const total = ref(1);
  const recordsList: any = ref([]);
  const mygetDownloadRecordsList = async () => {
    const data = {
      page: page.value,
      pageSize: 10,
    };
    const res = await getDownloadRecordsList(data).catch(() => {
      loadings.value = false;
    });
    if (res && res.code === 0 && res.data.result) {
      recordsList.value.push(...res.data.result);
      total.value = res.data.total;
      page.value = res.data.page;
    }
    loadings.value = false;
  };

  try {
    mygetDownloadRecordsList;
  } catch {
    console.log(1111);
  }
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
      mygetDownloadRecordsList();
    }, 2000);
  };

  const myscroll = (e) => {
    const element = e.target;
    const isLoad = element.scrollHeight - Math.abs(element.scrollTop) - element.clientHeight;
    if (isLoad <= 1) {
      load();
    }
  };

  onMounted(() => {
    recordsList.value = [];
    loadings.value = true;
    setTimeout(() => {
      mygetDownloadRecordsList();
    }, 1000);
  });
</script>
<template>
  <div class="downloadRecord" v-loading.fullscreen.lock="loadings" element-loading-text="努力加载中...">
    <van-icon @click="gopage(-1, '')" style="font-size: 25px; margin-bottom: 15px" name="arrow-left" />
    <div v-if="recordsList.length == 0 && !loadings" class="noList">
      <div>暂无数据</div>
    </div>
    <div class="infinite-list-wrapper" @scroll="myscroll" v-if="recordsList.length > 0">
      <ul class="list">
        <li v-for="item in recordsList" @click="gopage(1, item.batchTaskId)" :key="item" class="list-item">
          <img class="list-item-img" v-if="item.state === 1" src="../../assets/loading.png" alt="" />
          <img class="list-item-img" v-if="item.state === 2" src="../../assets//accomplish.png" alt="" />
          <img class="list-item-img" v-if="item.state === 3" src="../../assets/cancel.png" alt="" />
          <div class="list-item_left">
            <div class="left_name">游戏名称：{{ item.gameCountAndName }}</div>
            <div>异常网吧数: {{ item.errorCount }}</div>
            <div>创建人: {{ item.userName }}</div>
            <div style="color: #666666">创建时间: {{ item.createTime }}</div>
            <div class="list-item-other"><div> 查看详情 > </div></div>
          </div>
        </li>
      </ul>
      <div class="list-loadTitle">
        <div v-if="loading">
          <el-icon size="" color="" class="is-loading"> <Loading /> </el-icon>正在加载
        </div>
        <div v-if="noMore">没有更多了</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .downloadRecord {
    .noList {
      height: 90vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      font-weight: bold;
    }
  }
  .infinite-list-wrapper {
    height: 90vh;
    overflow-y: auto;
    .list {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .list-item {
        height: 290px;
        width: 700px;
        border: 1px solid #dddddd;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        .list-item-img {
          position: absolute;
          width: 90px;
          height: 100px;
          right: 0px;
          top: 0px;
        }
        .list-item_left {
          padding: 30px 50px;
          color: #1e1e1e;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          .left_name {
            width: 90%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .list-item-other {
          display: flex;
          justify-content: flex-end;
          margin-top: 5px;
          color: #ff9423;
        }
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

  .infinite-list-wrapper .list-item + .list-item {
    margin-top: 55px;
  }
</style>
