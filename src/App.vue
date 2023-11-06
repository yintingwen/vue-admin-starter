<script setup>
import axios from 'axios'

getUrl()

async function getUrl() {
  const res = await axios.get('/user/generateUrlLink')
  location.href = res
}
</script>

<template>
  <view class="page"> 小程序跳转中... </view>
</template>

<style scoped>
.page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
