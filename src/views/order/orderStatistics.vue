<template>
  <div class="search-div">
    <el-form label-width="90px" size="small">
      <el-row>
        <el-col :span="22">
          <el-form-item label="订单日期">
            <el-date-picker
                v-model="createTimes"
                type="daterange"
                range-separator="To"
                start-placeholder="开始日期"
                end-placeholder="截止日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="fetchData()">
            搜索
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div ref="orderTotalAmountDiv" style="width: 100%; height: 100%;"></div>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import * as echarts from 'echarts';
import {getOrderStatisticsData} from "@/api/orderStatistics";         // 导入Echart库中所有的图形报表组件

// 定义chart数据模型，用来选中div组件
const orderTotalAmountDiv = ref()

const createTimes = ref([])
const quryDto = ref({
  createTimeBegin: '',
  createTimeEnd: '',
})
const fetchData = async () => {
  if(createTimes.value.length === 2){
    quryDto.value.createTimeBegin = createTimes.value[0]
    quryDto.value.createTimeEnd = createTimes.value[1]
  }
  const {code,message,data} =await getOrderStatisticsData(quryDto.value)
  if(code === 200){
    const dateList = data.dateList
    const amountList = data.amountList
    setChartOption(dateList, amountList)
  }
}
onMounted(async () => {
  fetchData()
})
const setChartOption =(dateList, amountList)=>{
  // 基于准备好的dom，初始化echarts实例
  var orderTotalAmountChart = echarts.init(orderTotalAmountDiv.value);

  // 绘制图表
  orderTotalAmountChart.setOption({
    title: {
      text: '订单数据统计'
    },
    tooltip: {},
    xAxis: {
      data: dateList,
    },
    yAxis: {},
    series: [
      {
        name: '订单总金额（万元）',
        type: 'bar',
        data: amountList,
      }
    ]
  });
}
</script>

<style scoped lang="scss">
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>