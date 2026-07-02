<template>
  <div class="notebook-root">
    <!-- Modal 模式 -->
    <div
      v-if="mode === 'modal' && visible"
      class="modal-backdrop"
      @click.self="handleClose"
    >
      <div class="notebook-modal" :style="notebookStyle">
        <!-- 线圈装饰 -->
        <div class="notebook-binder-rings">
          <div v-for="n in coils" :key="n" class="coil-wrapper">
            <div class="notebook-paper-hole"></div>
            <div class="notebook-metal-coil"></div>
          </div>
        </div>

        <!-- 表单内容 -->
        <NotebookForm
          ref="formRef"
          :fields="fields"
          :title="title"
          :primary-text="primaryText"
          :secondary-text="secondaryText"
          :show-secondary="showSecondary"
          :secondary-action="secondaryAction"
          @submit="handleSubmit"
          @reset="handleReset"
          @close="handleClose"
        />
      </div>
    </div>

    <!-- Inline 模式 -->
    <div
      v-if="mode === 'inline'"
      class="notebook-modal inline"
      :style="notebookStyle"
    >
      <!-- 线圈装饰 -->
      <div class="notebook-binder-rings">
        <div v-for="n in coils" :key="n" class="coil-wrapper">
          <div class="notebook-paper-hole"></div>
          <div class="notebook-metal-coil"></div>
        </div>
      </div>

      <!-- 表单内容 -->
      <NotebookForm
        ref="formRef"
        :fields="fields"
        :title="title"
        :primary-text="primaryText"
        :secondary-text="secondaryText"
        :show-secondary="showSecondary"
        :secondary-action="secondaryAction"
        @submit="handleSubmit"
        @reset="handleReset"
        @close="handleClose"
      />
    </div>
  </div>
</template>

<script setup>
import {
  //   reactive,
  //   watch,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue'
import NotebookForm from './NotebookForm.vue'
// 样式在外部导入，或者直接写在 scoped 中

// ============ Props ============
const props = defineProps({
  // 显示控制
  visible: { type: Boolean, default: false },
  mode: {
    type: String,
    default: 'modal',
    validator: (v) => ['modal', 'inline'].includes(v)
  },

  // 内容配置
  title: { type: String, default: '📝 笔记' },
  fields: {
    type: Array,
    default: () => [
      {
        name: 'text',
        label: '内容',
        type: 'text',
        placeholder: '',
        required: false
      }
    ]
  },

  // 按钮配置
  primaryText: { type: String, default: '添加' },
  secondaryText: { type: String, default: '关闭' },
  showSecondary: { type: Boolean, default: false },
  secondaryAction: {
    type: String,
    default: 'close',
    validator: (v) => ['close', 'reset'].includes(v)
  },

  // 尺寸配置
  width: { type: String, default: '100%' },
  height: { type: String, default: '' },

  // 线圈配置
  holeSpacing: { type: Number, default: 28 },
  minCoils: { type: Number, default: 4 },
  maxCoils: { type: Number, default: 14 }
})

// ============ Emits ============
const emit = defineEmits(['update:visible', 'submit', 'reset', 'close'])

// ============ Refs ============
const formRef = ref(null)

// ============ 尺寸控制 ============
const notebookStyle = computed(() => ({
  width: props.width,
  height: props.height || undefined
}))

// no drag-resize behavior; size controlled by props

// ============ 线圈计算 ============
const coils = ref(props.minCoils)
// const paperRef = ref(null)

const calculateCoils = () => {
  const el = document.querySelector('.notebook-paper-page')
  if (!el) return props.minCoils
  const height = el.getBoundingClientRect().height
  const count = Math.floor(height / props.holeSpacing)
  return Math.max(props.minCoils, Math.min(props.maxCoils, count))
}

const updateCoils = () => {
  coils.value = calculateCoils()
}

// ============ 生命周期 ============
onMounted(() => {
  nextTick(() => {
    updateCoils()
  })
  window.addEventListener('resize', updateCoils)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCoils)
})

// ============ 方法 ============
const handleSubmit = (payload) => {
  emit('submit', payload)
  if (props.mode === 'modal') {
    emit('update:visible', false)
  }
}

const handleReset = () => {
  emit('reset')
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

// ============ 暴露方法 ============
defineExpose({
  resetForm: () => formRef.value?.resetForm(),
  validateAll: () => formRef.value?.validateAll(),
  formData: () => formRef.value?.formData
})
</script>

<style scoped>
/* index.vue 不再直接引入样式，以避免 scoped 限制对子组件样式的影响 */
</style>
