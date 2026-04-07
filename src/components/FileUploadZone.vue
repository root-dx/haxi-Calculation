<template>
  <div class="upload-wrapper">
    <div
      @click="handleClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
      class="upload-zone"
    >
      <input
        ref="fileInputRef"
        type="file"
        @change="handleInputChange"
        class="hidden-input"
      />
      <div class="upload-content">
        <CloudUploadIcon class="upload-icon" />
        <div class="upload-text">拖拽文件到此处或点击上传</div>
        <div class="upload-hint">单文件不超过2G</div>
      </div>
    </div>

    <!-- 已选文件显示 -->
    <div v-if="file" class="file-info">
      <div class="file-details">
        <div class="file-name">{{ file.name }}</div>
        <div class="file-size">{{ formatFileSize(file.size) }}</div>
      </div>
      <button
        @click="handleRemoveFile"
        class="remove-btn"
        aria-label="删除文件"
      >
        <XIcon class="remove-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CloudUploadIcon from './icons/CloudUploadIcon.vue';
import XIcon from './icons/XIcon.vue';
import { formatFileSize } from '../utils/formatFileSize.js';

const props = defineProps({
  file: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['file-select']);

const fileInputRef = ref(null);
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

const handleFileChange = (selectedFile) => {
  if (selectedFile) {
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert('文件大小不能超过2GB');
      return;
    }
    emit('file-select', selectedFile);
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const droppedFile = e.dataTransfer.files[0];
  if (droppedFile) {
    handleFileChange(droppedFile);
  }
};

const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const handleClick = () => {
  fileInputRef.value?.click();
};

const handleInputChange = (e) => {
  const selectedFile = e.target.files?.[0] || null;
  handleFileChange(selectedFile);
};

const handleRemoveFile = (e) => {
  e.stopPropagation();
  emit('file-select', null);
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};
</script>

<style scoped>
.upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-zone {
  border: 2px dashed #d1d5dc;
  border-radius: 10px;
  background: #f9fafb;
  height: 216px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  cursor: pointer;
  transition: border-color 0.2s;
  flex-shrink: 0;
}

.upload-zone:hover {
  border-color: rgba(209, 213, 220, 0.8);
}

.hidden-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #6a7282;
}

.upload-text {
  font-size: 16px;
  color: #364153;
}

.upload-hint {
  font-size: 14px;
  color: #6a7282;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
  padding: 8px 13px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  flex-shrink: 0;
  gap: 8px;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  color: #364153;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 12px;
  color: #6a7282;
  margin-top: 2px;
}

.remove-btn {
  padding: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #f3f4f6;
}

.remove-icon {
  width: 16px;
  height: 16px;
  color: #6a7282;
}
</style>
