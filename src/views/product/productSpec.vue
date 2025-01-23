<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">添 加</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="specName" label="规格名称"/>
    <el-table-column label="规格值" #default="scope">
      <div
          v-for="(item1, index1) in scope.row.specValue"
          :key="index1"
          style="padding: 5px; margin: 0;width: 100%;"
      >
        {{ item1.key }}：
        <span
            v-for="(item2, index2) in item1.valueList"
            :key="index2"
            class="div-atrr"
        >
            {{ item2 }}
            </span>
      </div>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"/>
    <el-table-column label="操作" align="center" width="200" #default="scope">
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="remove(scope.row.id)">
        删除
      </el-button>
    </el-table-column>
  </el-table>

  <el-pagination
      v-model:current-page="pageParams.page"
      v-model:page-size="pageParams.limit"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />
  <el-dialog v-model="dialogVisible" title="添加或修改" width="40%">
    <el-form label-width="120px">
      <el-form-item label="规格名称">
        <el-input v-model="productSpec.specName"/>
      </el-form-item>
      <el-form-item>
        <el-button size="default" type="success" @click="addSpec">
          添加新规格
        </el-button>
      </el-form-item>
      <el-form-item label="" v-for="(item , index) in productSpec.specValue" :key="index">
        <el-row>
          <el-col :span="10">
            <el-input
                v-model="item.key"
                placeholder="规格"
                style="width: 90%;"
            />
          </el-col>
          <el-col :span="10">
            <el-input
                v-model="item.valueList"
                placeholder="规格值(如:白色,红色)"
                style="width: 90%;"
            />
          </el-col>
          <el-col :span="4">
            <el-button size="default" type="danger" @click="delSpec(index)">删除</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item align="right">
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {deleteProductSpec, listProductSpec, saveProductSpec, updateProductSpec} from "@/api/productSpec";
import {ElMessage, ElMessageBox} from "element-plus";

const remove = async (id) => {
  ElMessageBox.confirm('是否删除该规格', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {code, message, data} = await deleteProductSpec(id)
    if (code === 200) {
      fetchData()
      ElMessage.success(message)
    } else {
      ElMessage.error(message)
    }
  }).catch(
      () => {
        ElMessage.info('已取消删除')
      }
  )
}
const saveOrUpdate = async () => {
  if (productSpec.value.id) {
    updateData()
  } else {
    addData()
  }
}
const addData = async () => {
  //克隆
  const productSpecClone = JSON.parse(JSON.stringify(productSpec.value)) //深拷贝
  productSpecClone.specValue.forEach(item => {
    item.valueList = item.valueList.split(',')
  })
  //转换成字符串
  productSpecClone.specValue = JSON.stringify(productSpecClone.specValue)
  const {code, message, data} = await saveProductSpec(productSpecClone)
  if (code === 200) {
    fetchData()
    dialogVisible.value = false
    ElMessage.success(message)
  } else {
    ElMessage.error(message)
  }
}
const updateData = async () => {
  //克隆
  const productSpecClone = JSON.parse(JSON.stringify(productSpec.value)) //深拷贝
  productSpecClone.specValue.forEach(item => {
    if (typeof item.valueList === 'string') {   // 针对规格数据修改完毕以后数据类型有可能会变成string，针对string类型的数据将其转换成数组
      item.valueList = item.valueList.split(",")
    }
  })
  //转换成字符串
  productSpecClone.specValue = JSON.stringify(productSpecClone.specValue)
  const {code, message, data} = await updateProductSpec(productSpecClone)
  if (code === 200) {
    fetchData()
    dialogVisible.value = false
    ElMessage.success(message)
  } else {
    ElMessage.error(message)
  }
}
const addShow = () => {
  dialogVisible.value = true
  productSpec.value = defaultFromParams
}
const editShow = (row) => {
  dialogVisible.value = true
  productSpec.value = row
}
const addSpec = () => {
  productSpec.value.specValue.push({})
}
const delSpec = (index) => {
  productSpec.value.specValue.splice(index, 1)
}
const dialogVisible = ref(false)
const defaultFromParams = {
  id: '',
  specName: '',
  specValue: [{
    key: '',
    valueList: [],
  }],
}
const productSpec = ref(defaultFromParams)
//------------------分页------------------
const defaultPageParams = {
  page: 1,
  limit: 10,
}
const total = ref(0)
const pageParams = ref(defaultPageParams)
const list = ref([])
onMounted(async () => {
  fetchData()
})
const fetchData = async () => {
  const {code, message, data} = await listProductSpec(pageParams.value.page, pageParams.value.limit)
  if (code === 200) {
    data.list.forEach(item => {
      item.specValue = JSON.parse(item.specValue)
    })
    list.value = data.list
    total.value = data.total
  }
}
// eslint-disable-next-line no-unused-vars
const handleSizeChange = () => {
  fetchData()
}
const handleCurrentChange = () => {
  fetchData()
}
</script>

<style scoped lang="scss">
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.div-atrr {
  padding: 5px 10px;
  margin: 0 10px;
  background-color: powderblue;
  border-radius: 10px;
}

</style>