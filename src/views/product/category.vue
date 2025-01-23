<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="exportCategoryData">导出</el-button>
    <el-button type="primary" size="small" @click="importCategoryData">导入</el-button>
  </div>
  <el-dialog v-model="dialogImportVisible" title="导入" width="30%">
    <el-form label-width="120px">
      <el-form-item label="分类文件">
        <el-upload
            class="upload-demo"
            action="http://localhost:8501/admin/product/category/importData"
            :on-success="onUploadSuccess"
            :headers="headers"
        >
          <el-button type="primary">上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!---懒加载的树形表格-->
  <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="fetchData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column prop="name" label="分类名称"/>
    <el-table-column prop="imageUrl" label="图标" #default="scope">
      <img :src="scope.row.imageUrl" width="50"/>
    </el-table-column>
    <el-table-column prop="orderNum" label="排序"/>
    <el-table-column prop="status" label="状态" #default="scope">
      {{ scope.row.status == 1 ? '正常' : '停用' }}
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"/>
  </el-table>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {exportData, findCategoryByParentId} from "@/api/category";
import {useApp} from "@/pinia/modules/app";
import {ElMessage} from "element-plus";

const onUploadSuccess = async response => {
  if(response.code == 200){
    dialogImportVisible.value = false
    ElMessage.success(response.message)
    const {code, message, data} = await findCategoryByParentId(0)
    list.value = data
  }else{
    ElMessage.error(response.message)
  }
}
const headers = {
  token: useApp().authorization.token
}
const dialogImportVisible = ref(false)
const importCategoryData = () => {
  dialogImportVisible.value = true
}
const exportCategoryData = () => {
  exportData().then((res) => {
    const blob = new Blob([res])
    // 创建一个a标签
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = '分类数据.xlsx'
    link.click()
  })
}
onMounted(async () => {
  //查询一级分类
  const {code, message, data} = await
      findCategoryByParentId(0)
  list.value = data
})
const list = ref([])
const fetchData = async (row, treeNode, resolve) => {
  const {code, message, data} = await findCategoryByParentId(row.id)
  resolve(data)

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

.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>