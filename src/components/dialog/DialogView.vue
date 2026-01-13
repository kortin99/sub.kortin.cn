<template>
  <el-dialog
    v-model="$store.state.app.dialog.active"
    :title="$store.state.app.dialog.title"
    width="500"
    :before-close="handleClose"
  >
    <span>{{ $store.state.app.dialog.message }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="$store.state.app.dialog.active = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

// const dialogVisible = ref(false)
</script>

<style scoped>
/* 当前 div 样式加上 z-index: 999999 用于覆盖其他组件 */
.dialog-custom {
  z-index: 1150;
}
</style>
