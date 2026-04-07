<template>
  <div class="success-container">
    <div class="content-wrapper">
      <!-- Success Header -->
      <div class="header-section">
        <div class="title-row">
          <div class="success-icon-wrapper">
            <SuccessCheckIcon class="success-icon" />
          </div>
          <h1 class="title">计算成功</h1>
        </div>
        <p class="subtitle">哈希值已计算完成</p>
      </div>

      <!-- Result Card -->
      <div class="result-card">
        <!-- 哈希算法 -->
        <div class="result-item">
          <div class="item-label">哈希算法</div>
          <div class="item-value">{{ algorithm }}</div>
        </div>

        <!-- 文件名称 -->
        <div class="result-item">
          <div class="item-label">文件名称</div>
          <div class="copy-row">
            <div class="copy-value truncate">{{ fileName }}</div>
            <button
              @click="handleCopy(fileName, 'fileName')"
              class="copy-btn"
              aria-label="复制文件名"
            >
              <CheckIcon v-if="copiedField === 'fileName'" class="check-icon" />
              <CopyIcon v-else class="copy-icon" />
            </button>
          </div>
        </div>

        <!-- 哈希值 -->
        <div class="result-item">
          <div class="item-label">哈希值</div>
          <div class="copy-row hash-row">
            <div class="copy-value hash-value">{{ hash }}</div>
            <button
              @click="handleCopy(hash, 'hash')"
              class="copy-btn"
              aria-label="复制哈希值"
            >
              <CheckIcon v-if="copiedField === 'hash'" class="check-icon" />
              <CopyIcon v-else class="copy-icon" />
            </button>
          </div>
        </div>

        <!-- 文件大小 -->
        <div class="result-item" v-if="fileSize">
          <div class="item-label">文件大小</div>
          <div class="static-row">
            <span class="static-value">{{ fileSize }}</span>
          </div>
        </div>

        <!-- 计算时间 -->
        <div class="result-item">
          <div class="item-label">计算时间</div>
          <div class="static-row">
            <span class="static-value">{{ calculationTime }}</span>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="button-group">
        <button
          @click="handleCopyAll"
          class="copy-all-btn"
        >
          <CheckIcon v-if="copiedField === 'all'" class="btn-icon" />
          <CopyIcon v-else class="btn-icon" />
          复制所有信息
        </button>
        <button
          @click="handleReturn"
          class="return-btn"
        >
          返回继续计算
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SuccessCheckIcon from './SuccessCheckIcon.vue';
import CheckIcon from './icons/CheckIcon.vue';
import CopyIcon from './icons/CopyIcon.vue';

const props = defineProps({
  algorithm: String,
  fileName: String,
  hash: String,
  fileSize: String,
  calculationTime: String
});

const emit = defineEmits(['return']);

const copiedField = ref(null);

const handleCopy = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedField.value = field;
    setTimeout(() => copiedField.value = null, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const handleCopyAll = async () => {
  const allText = `哈希算法: ${props.algorithm}\n文件名称: ${props.fileName}\n哈希值: ${props.hash}${props.fileSize ? `\n文件大小: ${props.fileSize}` : ''}\n计算时间: ${props.calculationTime}`;
  try {
    await navigator.clipboard.writeText(allText);
    copiedField.value = 'all';
    setTimeout(() => copiedField.value = null, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const handleReturn = () => {
  emit('return');
};
</script>

<style scoped>
.success-container {
  flex: 1;
  width: 100%;
  background: white;
  overflow-y: auto;
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
}

.content-wrapper {
  margin: 0 auto;
  width: 100%;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.success-icon-wrapper {
  width: 56px;
  height: 56px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  flex-shrink: 0;
}

.success-icon {
  width: 28px;
  height: 28px;
}

.title {
  font-size: 30px;
  font-weight: 500;
  color: #0a0a0a;
  line-height: 36px;
  margin: 0;
}

.subtitle {
  font-size: 16px;
  color: #4a5565;
  margin: 0;
}

.result-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 1;
  min-height: 0;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.item-label {
  font-size: 14px;
  color: #6a7282;
}

.item-value {
  font-size: 16px;
  color: #101828;
}

.copy-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  height: 58px;
  padding: 0 16px;
}

.hash-row {
  min-height: 54px;
  height: auto;
  padding: 12px 16px;
}

.copy-value {
  flex: 1;
  font-size: 16px;
  color: #101828;
  font-family: monospace;
  overflow: hidden;
}

.hash-value {
  font-size: 14px;
  word-break: break-all;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-btn {
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  flex-shrink: 0;
}

.copy-btn:hover {
  background: #e5e7eb;
}

.copy-icon {
  width: 16px;
  height: 16px;
  color: #6a7282;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: #16a34a;
}

.static-row {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  height: 50px;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.static-value {
  font-size: 16px;
  color: #101828;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.copy-all-btn {
  width: 100%;
  height: 50px;
  border-radius: 10px;
  border: 2px solid #155dfc;
  background: white;
  color: #155dfc;
  font-weight: 500;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-all-btn:hover {
  background: rgba(21, 93, 252, 0.05);
}

.return-btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  background: #155dfc;
  color: white;
  font-weight: 500;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.return-btn:hover {
  background: #0d4fd9;
}

.btn-icon {
  width: 20px;
  height: 20px;
}
</style>
