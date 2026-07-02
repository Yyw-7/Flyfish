<template>
  <div class="notebook-paper-page" ref="paperRef">
    <div class="notebook-header">
      <h3 class="notebook-title">{{ title }}</h3>
    </div>

    <div class="notebook-form">
      <div v-for="field in fields" :key="field.name" class="form-group">
        <label class="form-label">
          {{ field.label }}
          <span v-if="field.required" style="color: #ef4444">*</span>
        </label>

        <!-- 文本输入 -->
        <input
          v-if="field.type === 'text'"
          :type="field.inputType || 'text'"
          class="form-input"
          :class="{ error: errors[field.name] && showErrors }"
          :placeholder="field.placeholder || ''"
          v-model="formData[field.name]"
          @keyup.enter="handleSubmit"
          @input="onFieldInput(field.name)"
        />

        <!-- 文本域 -->
        <textarea
          v-else-if="field.type === 'textarea'"
          class="form-input"
          :class="{ error: errors[field.name] && showErrors }"
          :placeholder="field.placeholder || ''"
          v-model="formData[field.name]"
          @input="onFieldInput(field.name)"
        ></textarea>

        <!-- 文件上传 -->
        <input
          v-else-if="field.type === 'file'"
          type="file"
          class="form-input"
          :class="{ error: errors[field.name] && showErrors }"
          @change="onFileChange($event, field.name)"
        />

        <!-- 错误信息 -->
        <span v-if="errors[field.name] && showErrors" class="form-error">
          {{ errors[field.name] }}
        </span>
      </div>
    </div>

    <div class="notebook-footer">
      <button class="btn-submit" @click="handleSubmit">
        {{ primaryText }}
      </button>
      <button
        v-if="showSecondary"
        class="btn-secondary"
        @click="handleSecondary"
      >
        {{ secondaryText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted, nextTick } from 'vue'

// ============ Props ============
const props = defineProps({
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
  title: { type: String, default: '📝 笔记' },
  primaryText: { type: String, default: '添加' },
  secondaryText: { type: String, default: '关闭' },
  showSecondary: { type: Boolean, default: false },
  secondaryAction: {
    type: String,
    default: 'close',
    validator: (v) => ['close', 'reset'].includes(v)
  }
})

// ============ Emits ============
const emit = defineEmits(['submit', 'reset', 'close'])

// ============ 表单数据 ============
const makeInitial = () => {
  const obj = {}
  props.fields.forEach((f) => {
    obj[f.name] = f.type === 'file' ? null : (f.default ?? '')
  })
  return obj
}

const formData = reactive(makeInitial())
const errors = ref({})
// 仅在点击“添加”后显示错误信息
const showErrors = ref(false)

// 字段验证规则
const validateField = (fieldName) => {
  const field = props.fields.find((f) => f.name === fieldName)
  if (!field) return true

  const value = formData[fieldName]
  const error = []

  // 必填验证
  if (field.required && (!value || value.trim() === '')) {
    error.push(`${field.label}不能为空`)
  }

  // 最小长度验证
  if (field.minLength && value && value.length < field.minLength) {
    error.push(`${field.label}至少 ${field.minLength} 个字符`)
  }

  // 最大长度验证
  if (field.maxLength && value && value.length > field.maxLength) {
    error.push(`${field.label}不能超过 ${field.maxLength} 个字符`)
  }

  // 自定义验证
  if (field.validate && typeof field.validate === 'function') {
    const result = field.validate(value)
    if (result !== true && typeof result === 'string') {
      error.push(result)
    }
  }

  errors.value[fieldName] = error.length ? error[0] : ''
  return errors.value[fieldName] === ''
}

// 验证所有字段
const validateAll = () => {
  let isValid = true
  props.fields.forEach((field) => {
    const result = validateField(field.name)
    if (!result) isValid = false
  })
  return isValid
}

// 监听 fields 变化重置表单
watch(
  () => props.fields,
  () => {
    const init = makeInitial()
    Object.keys(init).forEach((k) => (formData[k] = init[k]))
    errors.value = {}
  },
  { deep: true }
)

// ============ 方法 ============
const onFileChange = (e, name) => {
  const file = e.target.files && e.target.files[0]
  formData[name] = file || null
  if (file) {
    errors.value[name] = ''
  }
}

// 当用户输入时，如果错误提示已开启则重新校验该字段，校验通过则隐藏错误
const onFieldInput = (name) => {
  if (!showErrors.value) return
  validateField(name)
}

const clearForm = () => {
  const init = makeInitial()
  Object.keys(init).forEach((k) => (formData[k] = init[k]))
  errors.value = {}
  showErrors.value = false
}

const resetForm = () => {
  clearForm()
  emit('reset')
}

const handleSubmit = () => {
  // 仅在用户点击“添加”时显示错误提示
  showErrors.value = true

  //  验证
  if (!validateAll()) {
    // 滚动到第一个错误
    const firstError = document.querySelector('.form-input.error')
    if (firstError) {
      firstError.focus()
    }
    return
  }

  // 检查是否全部为空
  const isEmpty = Object.keys(formData).every(
    (k) => formData[k] === '' || formData[k] === null
  )
  if (isEmpty) {
    emit('submit', null)
    return
  }

  // 构建 payload
  const payload = {}
  Object.keys(formData).forEach((k) => (payload[k] = formData[k]))
  emit('submit', payload)
  clearForm()
}

const handleSecondary = () => {
  if (props.secondaryAction === 'reset') {
    resetForm()
  } else {
    emit('close')
  }
}

// ============ 暴露方法给父组件 ============
defineExpose({
  resetForm,
  validateAll,
  formData
})

// ============ 挂载后自动聚焦第一个输入 ============
onMounted(() => {
  nextTick(() => {
    const firstInput = document.querySelector('.form-input:not([type="file"])')
    if (firstInput) {
      firstInput.focus()
    }
  })
})
</script>

<style>
/* 引入笔记本样式，使表单内元素正确应用样式（放在子组件以生效） */
@import '@/components/NoteBook/styles.css';
</style>
