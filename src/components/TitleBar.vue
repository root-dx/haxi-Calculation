<template>
  <div class="title-bar">
    <div class="title-bar-drag">
      <img src="/icon.png" alt="icon" class="title-icon" />
      <span class="title-text">哈希计算工具</span>
    </div>
    <div class="window-controls">
      <button class="window-btn minimize" @click="minimize" title="最小化">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <button class="window-btn maximize" @click="maximize" title="最大化/还原">
        <svg v-if="isMaximized" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="5" y="9" width="10" height="10" rx="1"></rect>
          <path d="M9 5h10v10"></path>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
        </svg>
      </button>
      <button class="window-btn close" @click="close" title="关闭">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isMaximized = ref(false);

onMounted(async () => {
  if (window.electronAPI?.isWindowMaximized) {
    isMaximized.value = await window.electronAPI.isWindowMaximized();
  }
});

const minimize = () => {
  window.electronAPI?.windowMinimize?.();
};

const maximize = async () => {
  if (window.electronAPI?.windowMaximize) {
    await window.electronAPI.windowMaximize();
    isMaximized.value = await window.electronAPI.isWindowMaximized();
  }
};

const close = () => {
  window.electronAPI?.windowClose?.();
};
</script>

<style scoped>
.title-bar {
  height: 40px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-app-region: drag;
  user-select: none;
}

.title-bar-drag {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  height: 100%;
  padding-left: 12px;
}

.title-icon {
  width: 20px;
  height: 20px;
}

.title-text {
  font-size: 13px;
  color: #101828;
  font-weight: 500;
}

.window-controls {
  display: flex;
  -webkit-app-region: no-drag;
  height: 100%;
}

.window-btn {
  width: 46px;
  height: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  padding: 0;
}

.window-btn svg {
  width: 14px;
  height: 14px;
  color: #364153;
}

.window-btn:hover {
  background: #f3f4f6;
}

.window-btn.close:hover {
  background: #ef4444;
}

.window-btn.close:hover svg {
  color: white;
}
</style>
