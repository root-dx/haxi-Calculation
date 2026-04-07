<template>
  <div class="app-wrapper">
    <TitleBar />
    
    <div class="page-container">
      <!-- 成功页面 -->
      <SuccessPage
        v-if="showSuccess && hash && file"
        :algorithm="algorithm"
        :fileName="file.name"
        :hash="hash"
        :fileSize="formatFileSize(file.size)"
        :calculationTime="calculationTime"
        @return="handleReturn"
      />
      
      <!-- 主页面 -->
      <div
        v-else
        class="main-container"
      >
        <div class="content-wrapper">
          <!-- Header -->
          <div class="header-section">
            <div class="title-row">
              <SecurityShieldIcon :size="40" />
              <h1 class="title">哈希计算工具</h1>
            </div>
            <p class="subtitle">工具仅在本地执行哈希运算，不传输、不存储任何原始数据。</p>
          </div>

          <!-- File Upload Section -->
          <div class="section">
            <h2 class="section-title">选择文件</h2>
            <FileUploadZone :file="file" @file-select="setFile" />
          </div>

          <!-- Algorithm Selection -->
          <div class="section">
            <h2 class="section-title">选择加密算法</h2>
            <AlgorithmSelector
              :value="algorithm"
              @change="setAlgorithm"
            />
          </div>

          <!-- Calculate Button -->
          <button
            @click="handleCalculate"
            :disabled="!file || isCalculating"
            class="calculate-btn"
            :class="{ 'disabled': !file || isCalculating }"
          >
            {{ isCalculating ? '计算中...' : '开始计算' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import TitleBar from './components/TitleBar.vue';
import SecurityShieldIcon from './components/SecurityShieldIcon.vue';
import FileUploadZone from './components/FileUploadZone.vue';
import AlgorithmSelector from './components/AlgorithmSelector.vue';
import SuccessPage from './components/SuccessPage.vue';
import { calculateHash } from './utils/hashUtils.js';
import { formatFileSize } from './utils/formatFileSize.js';

const file = ref(null);
const algorithm = ref('SHA-256');
const hash = ref('');
const isCalculating = ref(false);
const showSuccess = ref(false);
const calculationTime = ref('');

// 监听成功页面状态，调整窗口大小
watch(showSuccess, async (newValue) => {
  if (window.electronAPI?.setWindowMode) {
    try {
      await window.electronAPI.setWindowMode(newValue ? 'success' : 'default');
    } catch (error) {
      console.error('更新窗口模式失败:', error);
    }
  }
});

const setFile = (selectedFile) => {
  file.value = selectedFile;
};

const setAlgorithm = (value) => {
  algorithm.value = value;
};

const handleCalculate = async () => {
  if (!file.value) {
    alert('请先选择文件');
    return;
  }

  isCalculating.value = true;
  hash.value = '';

  try {
    const result = await calculateHash(file.value, algorithm.value);
    
    // 记录结束时间并格式化
    const endTime = new Date();
    const formattedTime = `${endTime.getFullYear()}-${String(endTime.getMonth() + 1).padStart(2, '0')}-${String(endTime.getDate()).padStart(2, '0')} ${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}:${String(endTime.getSeconds()).padStart(2, '0')}`;
    
    hash.value = result;
    calculationTime.value = formattedTime;
    showSuccess.value = true;
  } catch (error) {
    console.error('计算哈希失败:', error);
    alert('计算失败，请重试');
  } finally {
    isCalculating.value = false;
  }
};

const handleReturn = () => {
  showSuccess.value = false;
  hash.value = '';
  file.value = null;
  calculationTime.value = '';
};
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-container {
  flex: 1;
  width: 100%;
  background: white;
  overflow-y: auto;
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
}

.content-wrapper {
  margin: 0 auto;
  width: 100%;
  max-width: 672px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title {
  font-size: 30px;
  font-weight: 500;
  color: #101828;
  line-height: 36px;
  margin: 0;
}

.subtitle {
  text-align: center;
  font-size: 16px;
  color: #4a5565;
  margin: 0;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: #101828;
  margin: 0;
}

.calculate-btn {
  width: 100%;
  height: 60px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 18px;
  color: white;
  background: #155dfc;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.calculate-btn:hover:not(.disabled) {
  background: #0d4fd9;
}

.calculate-btn.disabled {
  background: #d1d5dc;
  cursor: not-allowed;
}
</style>
