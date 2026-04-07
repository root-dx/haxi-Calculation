<template>
  <div class="selector-wrapper">
    <div class="select-box" @click="toggleOpen">
      <span class="select-value">{{ selectedLabel }}</span>
      <ChevronDownIcon class="chevron-icon" :class="{ 'open': isOpen }" />
    </div>
    
    <div v-if="isOpen" class="dropdown">
      <div
        v-for="algo in algorithms"
        :key="algo.value"
        @click="selectAlgorithm(algo.value)"
        class="dropdown-item"
        :class="{ 'selected': value === algo.value }"
      >
        {{ algo.label }}
      </div>
    </div>

    <div class="algorithm-info">
      <div
        v-for="algo in algorithms"
        :key="algo.value"
        class="info-item"
      >
        <span class="info-label">· {{ algo.label }}:</span>
        <span class="info-desc">{{ algo.description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ChevronDownIcon from './icons/ChevronDownIcon.vue';

const props = defineProps({
  value: {
    type: String,
    default: 'SHA-256'
  }
});

const emit = defineEmits(['change']);

const algorithms = [
  {
    value: 'SHA-256',
    label: 'SHA-256',
    description: '国际通用标准，适用于大多数业务场景，跨端业务首选。',
  },
  {
    value: 'SM3',
    label: 'SM3',
    description: '国家商用密码标准，适用于信创及有国密合规要求的场景。',
  },
];

const isOpen = ref(false);

const selectedLabel = computed(() => {
  const algo = algorithms.find(a => a.value === props.value);
  return algo?.label || 'SHA-256';
});

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};

const selectAlgorithm = (value) => {
  emit('change', value);
  isOpen.value = false;
};

// 点击外部关闭下拉框
const handleClickOutside = (e) => {
  if (!e.target.closest('.selector-wrapper')) {
    isOpen.value = false;
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside);
}
</script>

<style scoped>
.selector-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  position: relative;
}

.select-box {
  width: 100%;
  height: 36px;
  background: #f9fafb;
  border: 1px solid #d1d5dc;
  border-radius: 8px;
  padding: 0 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.select-value {
  font-size: 14px;
  color: #101828;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  color: #6a7282;
  transition: transform 0.2s;
}

.chevron-icon.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dropdown-item {
  padding: 10px 13px;
  font-size: 14px;
  color: #101828;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f9fafb;
}

.dropdown-item.selected {
  background: #eff6ff;
  color: #155dfc;
}

.algorithm-info {
  background: #f9fafb;
  padding: 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  font-size: 14px;
  color: #364153;
  line-height: 20px;
}

.info-label {
  font-weight: 500;
}

.info-desc {
  margin-left: 4px;
}
</style>
