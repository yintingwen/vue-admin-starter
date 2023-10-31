<script setup>
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import qs from 'qs'
// '审核状态 ，1已提交审核中，2初审通过，3审核通过(待出卡)  4审核失败 5已出卡 6发卡失败'
const applyStatus = ['审核中', '初审通过', '待出卡', '审核失败', '已出卡', '发卡失败']
// '车牌颜色（0蓝色，1黄色，2黑色，3白色，4绿色，5黄绿，6蓝白）',
const carPlateColor = ['蓝色', '黄色', '黑色', '白色', '绿色', '黄绿', '蓝白']
const depIdList = [
  { id: '1692420885909921793', name: '车润通自营' },
  { id: '1692420910656315393', name: '车润通代理' },
]
const currentUserName = localStorage.getItem('username')

const pageInfo = reactive({
  pageNo: 1,
  pageSize: 50,
  total: 0,
})
const data = ref([])
const loading = ref(false)

const searchForm = reactive({
  username: '',
  phone: '',
  vehiclePlate: '',
  siteUser: '',
  status: '',
  siteId: undefined,
  startTime: undefined,
  endTime: undefined
})
const searchFormCache = reactive({ ...searchForm })
const exportHref = computed(
  () =>
    import.meta.env.VITE_HTTP_URL +
    '/gft/download?' +
    qs.stringify({
      ...searchForm,
      account: currentUserName,
    })
)

async function getTableData(form) {
  loading.value = true
  try {
    const res = await axios.get('/gft/search', {
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
  Object.assign(searchForm, searchFormCache)
  pageInfo.pageNo = 1
  await getTableData(searchForm)
}

function onTimeChange(e) {
  searchFormCache.startTime = e
    ? dayjs(e[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    : undefined
  searchFormCache.endTime = e ? dayjs(e[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
}

function onPageChange(e) {
  pageInfo.pageNo = e
  getTableData(searchForm)
}

function onPageSizeChange(e) {
  pageInfo.pageSize = e
  onClickSearch()
}

getTableData(searchForm)
</script>

<template>
  <div class="table-view">
    <div class="form-container">
      <a-form auto-label-width :model="{}">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="用户名称">
              <a-input placeholder="请输入用户名称" v-model="searchFormCache.username"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="手机号码">
              <a-input placeholder="请输入手机号码" v-model="searchFormCache.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="车牌号码">
              <a-input
                placeholder="请输入车牌号码"
                v-model="searchFormCache.vehiclePlate"
                :allow-clear="true"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="归属人">
              <a-input
                placeholder="请输入归属人"
                v-model="searchFormCache.siteUser"
                :allow-clear="true"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6" v-if="currentUserName === 'admin'">
            <a-form-item label="归属部门">
              <a-select
                v-model="searchFormCache.siteId"
                placeholder="请选择归属部门"
                :allow-clear="true"
              >
                <a-option v-for="item in depIdList" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="审核状态">
              <a-select
                v-model="searchFormCache.status"
                placeholder="请选择审核状态"
                :allow-clear="true"
              >
                <a-option v-for="(item, index) in applyStatus" :key="item.id" :value="index + 1">{{
                  item
                }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="时间范围">
              <a-range-picker value-format="timestamp" @change="onTimeChange" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-button @click="onClickSearch" :style="{ marginRight: '10px' }" type="primary"
              >查询</a-button
            >
            <a-button :href="exportHref" :download="true" type="primary">导出</a-button>
            <view :style="{ marginLeft: '10px', color: 'red' }">总计{{ pageInfo.total }}条</view>
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
          <a-table-column title="预约流水号" dataIndex="serialNo"></a-table-column>
          <a-table-column title="用户名称" dataIndex="userName"></a-table-column>
          <a-table-column title="手机号码" dataIndex="phone"></a-table-column>
          <a-table-column title="用户类型">
            <template #cell="{ record }">
              {{ record['user_type'] === 4 ? '企业用户' : '个人用户' }}
            </template>
          </a-table-column>
          <a-table-column title="车牌号码" dataIndex="vehiclePlate"></a-table-column>
          <a-table-column title="车牌颜色" :width="100">
            <template #cell="{ record }">
              {{ carPlateColor[record['vehiclePlateColor']] }}
            </template>
          </a-table-column>
          <a-table-column title="归属人" dataIndex="siteUser"></a-table-column>
          <a-table-column title="审核状态" :width="100">
            <template #cell="{ record }">
              {{ applyStatus[record['status'] - 1] }}
            </template>
          </a-table-column>
          <a-table-column title="申请时间" dataIndex="b">
            <template #cell="{ record }">
              {{ record.createTime }}
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
