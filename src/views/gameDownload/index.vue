<script lang="ts" setup>
  import myHeard from '@/components/Heard/index.vue';
  import myTree from '@/components/tree/index.vue';
  import { getChooseBarTree, getResourceList, batchDownload } from '@/api/index';
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { checkPermission } from '@/utils/public.js';
  import { showNotify } from 'vant';

  const route = useRoute();
  const router = useRouter();

  // 加载动画
  const loading = ref(false);
  // interface LinkItem {
  //   resourceId: number;
  //   resourceName: string;
  //   dpValue: number;
  //   editTime: string;
  //   pkgSize: number;
  //   sourceName: string;
  // }
  let timeout: ReturnType<typeof setTimeout>;
  const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
    clearTimeout(timeout);
    console.log(queryString, 111111);
    let myqueryString = queryString;
    if (myqueryString.length > 100) {
      myqueryString = myqueryString.slice(0, 100);
    }
    timeout = setTimeout(() => {
      getResourceList({
        keyWord: myqueryString,
        page: 1,
        pageSize: 10,
      }).then((res) => {
        if (res.code === 0) {
          cb(res.data.result);
        } else {
          cb({});
        }
      });
    }, 1000);
  };

  // 搜索与分页
  const inputValue: any = ref('');
  const flagClick = ref(true);
  const inofrList = ref<any[]>([]);
  // 记录列表
  const page = ref(1);
  const total = ref(1);
  const mygetResourceList = async (type) => {
    const data = {
      keyWord: inputValue.value,
      page: 1,
      pageSize: 10,
    };
    if (type === 1) {
      loading.value = false;
      data.page = page.value;
    } else {
      loading.value = true;
      inofrList.value = [];
    }
    const res = await getResourceList(data).catch(() => {
      loading.value = false;
    });
    if (res && res.code === 0) {
      console.log(res);
      inofrList.value.push(...res.data.result);
      page.value = res.data.page;
      total.value = res.data.total;
      setTimeout(() => {
        flagClick.value = false;
        loading.value = false;
      }, 1000);
    }
  };
  const handleSelect = (item: Record<string, any>) => {
    inputValue.value = item.resourceName;
    console.log(item.resourceName);
  };

  // 加载更多
  const loadings = ref(false);
  const noMore = ref(false);
  const load = () => {
    if (inofrList.value.length >= total.value) {
      noMore.value = true;
      loadings.value = false;
      return;
    }
    loadings.value = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      page.value++;
      mygetResourceList(1);
    }, 2000);
  };

  const myscroll = (e) => {
    const element = e.target;
    const isLoad = element.scrollHeight - Math.abs(element.scrollTop) - element.clientHeight;
    if (isLoad <= 1) {
      load();
    }
  };

  // 获取网吧设置状态
  const barStatus = ref(0);
  const treeData: any = ref([]);
  // 递归网吧树-修改数据
  const editTree = (child: any) => {
    const arr: any = [];
    child.forEach((item) => {
      if (item.barGroupList && item.barGroupList.length > 0) {
        editTree(item.barGroupList);
      }
      item.barId = item.barGroupId;
      item.barName = item.groupName;
      if (item.barList) {
        item.barGroupList.push(...item.barList);
      }
      arr.push(item);
    });
    return arr;
  };
  // 选中的网吧
  let barIds = ref('');
  const checkedBar = (item: any) => {
    barIds.value = item;
  };
  // 获取网吧个数
  const mygetBarGroupTree = async (item) => {
    treeData.value = [];
    resourceIds = item.resourceId + '';
    loading.value = true;
    const res = await getChooseBarTree({}).catch(() => {
      loading.value = false;
    });
    if (res && res.code === 0) {
      if (res.data && !res.data.barGroupList) {
        barStatus.value = 2;
      } else {
        const barGroupList = editTree(res.data.barGroupList);
        treeData.value = [
          {
            barId: -100,
            barName: '全部',
            barNum: res.data.barNum,
            barGroupList: [...barGroupList],
          },
        ];
      }
    }
    show.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  };

  // 下载游戏
  const show = ref(false);
  let resourceIds = '';
  const downLoad = (item) => {
    if (!checkPermission(['batch-game-add'])) {
      showNotify('暂无权限');
    } else {
      mygetBarGroupTree(item);
    }
  };

  // 确认下载
  const sureDownload = async () => {
    loading.value = true;
    const data = {
      resourceIds,
      barIds: barIds.value,
      updateMode: 1,
    };
    const res = await batchDownload(data);
    if (res.code === 0) {
      setTimeout(() => {
        loading.value = false;
        router.push('/downloadRecord');
      }, 1000);
    }
  };

  onMounted(() => {
    const state = Number(route.query.state);
    if (state === 0) {
      barStatus.value = 1;
    }
  });
</script>
<template>
  <my-heard />
  <div class="gameDownload" v-loading.fullscreen.lock="loading" element-loading-text="努力加载中...">
    <div class="gameDownload-error">
      <img v-if="barStatus === 1" src="../../assets/errorDownload.png" alt="" />
      <div v-if="barStatus === 1">当前账号被禁用</div>
      <div v-if="barStatus === 1">请联系加盟商启用员工状态</div>
    </div>
    <div v-if="barStatus !== 1">
      <div class="gameDownload_seach">
        <el-autocomplete
          style="width: 73%"
          v-model="inputValue"
          size="large"
          value-key="resourceName"
          label=""
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入游戏名称"
          @select="handleSelect"
        />
        <el-button icon="" size="large" clearable type="primary" @click="mygetResourceList">搜索资源</el-button>
      </div>
      <div v-if="flagClick" style="margin-top: 20px">
        <div style="font-weight: bold">温馨提示：</div>
        <div style="font-size: 15px; margin: 7px 0">
          <div>1、禁止下载黄色、赌博、暴力、政治倾向等游戏。</div>
          <div>2、游戏下载成功后，会在您关注的公众号中发送通知。</div>
        </div>
      </div>
      <div v-if="inofrList.length > 0">
        <div style="margin: 10px 0; font-weight: bold">资源列表</div>
        <div class="infinite-list-wrapper" @scroll="myscroll" style="overflow: auto">
          <ul class="list">
            <li v-for="item in inofrList" :key="item.resourceId" class="list-item">
              <div class="list-item_left">
                <div class="left_name">游戏名称：{{ item.resourceName }}</div>
                <div class="left_name">来源：{{ item.sourceName }}</div>
                <div>大小: {{ item.pkgSize }}MB</div>
                <div style="color: #666666">更新时间: {{ item.editTime }}</div>
              </div>
              <el-button @click="downLoad(item)" icon="" size="large" clearable type="primary">下载</el-button>
            </li>
          </ul>
          <div class="list-loadTitle">
            <div v-if="loadings">
              <el-icon size="" color="" class="is-loading"> <Loading /> </el-icon>正在加载
            </div>
            <div v-if="noMore">没有更多了</div>
          </div>
        </div>
      </div>
      <div v-if="inofrList.length == 0 && flagClick === false" class="gameDownload_noList">
        <img src="../../assets/noList.png" alt="" />
      </div>
    </div>
    <div>
      <van-action-sheet v-if="show" v-model:show="show" title="选择需要下载的网吧" safe-area-inset-bottom>
        <div v-if="treeData.length === 0" class="notree">
          <img v-if="barStatus === 2" src="../../assets/errorDownload.png" alt="" />
          <div v-if="barStatus === 2">当前账号下暂无关联网吧，请前往加盟商平台</div>
          <div v-if="barStatus === 2">(https://swboss.icafe8.com/) 授权</div>
          <div v-if="barStatus === 2">或使用其他账号。</div>
        </div>
        <div v-else class="sheet_content">
          <div class="sheet_content_tree">
            <myTree @checked-bar="checkedBar" :treeData="treeData" />
          </div>
          <div class="sheet_content_button">
            <el-button @click="sureDownload" :disabled="barIds == ''" icon="" size="default" clearable type="primary">确认下载</el-button>
          </div>
        </div>
      </van-action-sheet>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .gameDownload {
    .gameDownload-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      div {
        margin-bottom: 10px;
        font-size: 30px;
        color: rgb(153, 153, 153);
      }
    }
    .gameDownload_seach {
      margin: 50px 0;
      display: flex;
      justify-content: space-between;
    }
    .infinite-list-wrapper {
      margin: 0 auto;
      height: calc(100vh - 390px);
      width: 680px;
    }
    .infinite-list-wrapper .list {
      padding: 0;
      margin: 0;
      list-style: none;
    }

    .infinite-list-wrapper .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 45px;
      height: 200px;
      border: 1px solid #dddddd;
      border-radius: 10px;
      .list-item_left {
        width: 77%;
        color: #1e1e1e;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
        .left_name {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .infinite-list-wrapper .list-item + .list-item {
      margin-top: 50px;
    }
    .sheet_content {
      height: 70vh;
      padding: 0px 40px;
      .sheet_content_tree {
        height: 85%;
        overflow-y: auto;
      }
      .sheet_content_button {
        display: flex;
        justify-content: center;
        margin-top: 30px;
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

    .gameDownload_noList {
      img {
        margin-top: 20px;
        width: 100%;
      }
    }

    .notree {
      display: flex;
      height: 70vh;
      flex-direction: column;
      align-items: center;
      img {
        width: 600px;
      }
    }
  }
</style>
