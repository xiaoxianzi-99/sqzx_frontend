<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="add">添 加</el-button>
  </div>
  <el-dialog v-model="dialogVisible" :title="title" width="30%">
    <el-form label-width="120px">
      <el-form-item label="品牌名称">
        <el-input v-model="brand.name"/>
      </el-form-item>
      <el-form-item label="品牌图标">
        <el-upload
            class="avatar-uploader"
            action="http://localhost:8501/admin/system/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headers"
        >
          <img v-if="brand.logo" :src="brand.logo" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="name" label="品牌名称"/>
    <el-table-column prop="logo" label="品牌图标" #default="scope">
      <img :src="scope.row.logo" width="50"/>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"/>
    <el-table-column label="操作" align="center" width="200" #default="scope">
      <el-button type="primary" size="small" @click="updata(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
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
</template>
<script setup>
import {onMounted, ref} from 'vue'
import {listByPage, removeById, saveBrand, updateBrand} from '@/api/brand'
import {useApp} from "@/pinia/modules/app";
import {ElMessage, ElMessageBox} from "element-plus";

const list = ref([])
const total = ref(0)
const brand = ref({})
const dialogVisible = ref(false)
const title = ref('')
//------删除
const deleteById= async (id) => {
  ElMessageBox.confirm('此操作将永久删除该品牌, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {code, message, data} = await removeById(id)
    if (code === 200) {
      ElMessage.success(message)
      await fetchData()
    } else {
      ElMessage.error(message)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
//------更新
const updata = (row) => {
  brand.value = row
  title.value = '修改品牌'
  dialogVisible.value = true
}
const add = () => {
  brand.value = {}
  title.value = '添加品牌'
  dialogVisible.value = true
}
const headers = {
  token: useApp().authorization.token
}
const handleAvatarSuccess = respose => {
  brand.value.logo = respose.data
}
const saveOrUpdate = async () => {
  if (brand.value.id) {
    //修改
    const {code, message, data} = await updateBrand(brand.value)
    if (code === 200) {
      dialogVisible.value = false
      ElMessage.success(message)
      await fetchData()
    } else {
      ElMessage.error(message)
    }
  } else {
    const {code, message, data} = await saveBrand(brand.value)
    if (code === 200) {
      dialogVisible.value = false
      ElMessage.success(message)
      await fetchData()
    } else {
      ElMessage.error(message)
    }
  }
}
//分页条数据模型
const pageParamsForm = {
  page: 1, // 页码
  limit: 10, // 每页记录数
}
//页面变化
const handleSizeChange = size => {
  pageParams.value.limit = size
  fetchData()
}
const handleCurrentChange = number => {
  pageParams.value.page = number
  fetchData()
}

const pageParams = ref(pageParamsForm)
onMounted(async () => {
  fetchData()
})
const fetchData = async () => {
  const {code, message, data} = await listByPage(pageParams.value.page, pageParams.value.limit)
  list.value = data.list
  total.value = data.total
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>