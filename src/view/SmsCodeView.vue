<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

const pageInfo = reactive({
  pageNo: 1,
  pageSize: 50,
  total: 0,
})
const data = ref([])
const loading = ref(false)

async function getTableData(form) {
  loading.value = true
  try {
    const res = await axios.get('/gft/smsCode', {
      params: {
        ...form,
        ...pageInfo,
      },
    })
    data.value = res.records
    pageInfo.total = res.total
  } finally {
    loading.value = false
  }
}

async function onClickSearch() {
  pageInfo.pageNo = 1
  await getTableData()
}

function onPageChange(e) {
  pageInfo.pageNo = e
  getTableData()
}

function onPageSizeChange(e) {
  pageInfo.pageSize = e
  onClickSearch()
}

getTableData()
</script>

<template>
  <div class="table-view">
    <div class="form-container" style="padding-bottom: 20px;">
      <a-form auto-label-width :model="{}">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-button @click="onClickSearch" :style="{ marginRight: '10px' }" type="primary">刷新</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <a-table
        :loading="loading"
        row-key="id"
        :data="data"
        :stripe="true"
        :scrollbar="true"
        :scroll="{ y: '100%', minHeight: '100%' }"
        :bordered="{ cell: true }"
        :pagination="{
          current: pageInfo.pageNo,
          pageSize: pageInfo.pageSize,
          total: pageInfo.total,
          showPageSize: true,
          pageSizeOptions: [30, 50, 100, 200],
        }"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #columns>
          <a-table-column title="序号" :width="70">
            <template #cell="row">
              {{ (pageInfo.pageNo - 1) * pageInfo.pageSize + row.rowIndex + 1 }}
            </template>
          </a-table-column>
          <a-table-column title="用户名" dataIndex="userName">
            <template #cell="{ record }">
              <div v-if="record.codeType === 'BANK'">BANK:{{ record.phone }}</div>
              <div v-else>{{ record.userName }}</div>
            </template>
          </a-table-column>
          <a-table-column title="手机号" dataIndex="phone"></a-table-column>
          <a-table-column title="验证码" dataIndex="validateCode"></a-table-column>
          <a-table-column title="发送时间" dataIndex="sendTime">
            <template #cell="{ record }">
              {{ dayjs(record.sendTime).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
    <!-- = 1,'微信', '国控' -->
  </div>
</template>

<style lang="scss" scoped>
.table-view {
  height: 100%;
  display: flex;
  flex-direction: column;

  .form-container {
    padding: 20px 20px 0;
  }

  .table-container {
    flex: 1;
    overflow: hidden;
    padding: 0 20px 20px;
  }
}
</style>
