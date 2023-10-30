<template>
  <div class="my_tree">
    <el-tree
      :data="MytreeData"
      :default-expanded-keys="expandedKeys"
      :props="treeprops"
      check-on-click-node
      node-key="barId"
      show-checkbox
      @check="checkTree"
    >
      <template #default="{ data }">
        <span
          >{{ data.barName }}<span v-if="data.barGroupList && data.barGroupList.length > 0">({{ data.barNum }})</span></span
        >
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';

  const emit = defineEmits(['checkedBar']);

  const props = defineProps({
    treeData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  });

  const treeprops = {
    children: 'barGroupList',
    label: 'barName',
  };

  const MytreeData: any = ref([]);
  // 选中的网吧列表
  const checkedBar = ref([]);
  // 默认展开的key
  const expandedKeys = ref([-100]);
  // 网吧分组被选中
  const checkTree = (_data: any, node: any) => {
    const { checkedNodes } = node;
    const checkedArr: any = [];
    checkedNodes.forEach((item) => {
      if (!item.barGroupId && item.barId !== -100) {
        checkedArr.push(item.barId);
      }
    });
    checkedBar.value = checkedArr;
    emit('checkedBar', checkedBar.value.join(','));
  };

  onMounted(() => {
    MytreeData.value = props.treeData;
    console.log(MytreeData.value);
  });
</script>
<style scoped lang="scss"></style>
