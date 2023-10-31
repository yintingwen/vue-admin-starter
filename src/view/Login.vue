<script setup>
import { Message } from '@arco-design/web-vue'
import axios from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null)
const disabled = ref(false)

const form = reactive({
  username: '',
  password: '',
})

async function handleSubmit() {
  const res = await formRef.value.validate()
  if (res) return

  disabled.value = true
  try {
    const token = await axios.post('/gft/login', form)
    localStorage.setItem('token', token)
    localStorage.setItem('username', form.username)
    Message.success('登录成功')
    router.replace('/table')
  } finally {
    disabled.value = false
  }
}
</script>

<template>
  <div class="login-view">
    <div class="form-container"></div>
    <a-form ref="formRef" :model="form" :style="{ width: '600px' }">
      <a-form-item
        field="username"
        label="账号"
        :rules="[{ required: true, message: '请输入账号' }]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model="form.username" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item
        field="password"
        label="密码"
        :rules="[{ required: true, message: '请输入密码' }]"
        :validate-trigger="['change', 'input']"
      >
        <a-input-password v-model="form.password" placeholder="请输入密码" :password="true"/>
      </a-form-item>
      <a-button @click="handleSubmit" :disabled="disabled">登录</a-button>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
.login-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .form-container {
    width: 600px;
  }
}
</style>
