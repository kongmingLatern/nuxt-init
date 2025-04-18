<script setup lang="ts">
import { ref } from 'vue'

// 组件逻辑
</script>

<template>
  <div>
    <!-- 组件模板 -->
    <el-button>按钮</el-button>
    <div bg-red-500 class="div-container">
      123123
      <div>444</div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
/* 组件样式 */
.div-container {
  width: 100px;
  height: 100px;
  & .div {
    width: 100px;
    height: 100px;
    background-color: red;
  }
}
</style>
