<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">添 加</el-button>
  </div>

  <!-- 展示的表格 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form label-width="120px">
      <el-form-item label="菜单标题">
        <el-input v-model="sysMenu.title"/>
      </el-form-item>
      <el-form-item label="路由名称">
        <el-input v-model="sysMenu.component"/>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="sysMenu.sortValue"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="sysMenu.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
  >
    <el-table-column prop="title" label="菜单标题"/>
    <el-table-column prop="component" label="路由名称"/>
    <el-table-column prop="sortValue" label="排序"/>
    <el-table-column prop="status" label="状态" #default="scope">
      {{ scope.row.status == 1 ? '正常' : '停用' }}
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"/>

    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button type="success" size="small" @click="addShow(scope.row)">
        添加下级节点
      </el-button>
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="remove(scope.row.id)">
        删除
      </el-button>
    </el-table-column>
  </el-table>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {
  deleteSysMenuById,
  findNodes,
  saveSysMenu,
  updateSysMenu,
} from '@/api/Sysmenu'
import {ElMessage, ElMessageBox} from "element-plus";
//---   ---删除
const remove = async id => {
  ElMessageBox.confirm('是否删除该菜单', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(async () => {
    const {code, message, data} = await deleteSysMenuById(id)
    if (code === 200) {
        ElMessage.success(message)
        fetch()
    } else {
      ElMessage.error(message)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  });
}
//--------修改
const editShow = (row) => {
  sysMenu.value = row
  dialogVisible.value = true
  dialogTitle.value = '修改菜单'
}
//----添加
const dialogVisible = ref(false)
const dialogTitle = ref('')
const addShow = (row) => {
  //----清空表单
  sysMenu.value = {
    sortValue: 1,
    status: 1
  }
  if (!row.id) {
    sysMenu.value.parentId = 0
    dialogVisible.value = true
    dialogTitle.value = '添加菜单'
  } else {
    sysMenu.value.parentId = row.id
    dialogVisible.value = true
    dialogTitle.value = '添加' + row.title + '下级菜单'
  }
}
const defaultForm = {
  id: '',
  parentId: 0,
  title: '',
  url: '',
  component: '',
  icon: '',
  sortValue: 1,
  status: 1,
}
const sysMenu = ref(defaultForm)
const saveOrUpdate = () => {
  if (!sysMenu.value.id) {
    //----添加
    addData()
  } else {
    //----修改
    editData()
  }
}
const editData = async () => {
  const {code, message, data} = await updateSysMenu(sysMenu.value)
  if (code === 200) {
    ElMessage.success(message)
    dialogVisible.value = false
    fetch()
  }
}
const addData = async () => {
  const {code, message, data} = await saveSysMenu(sysMenu.value)
  if (code === 200) {
    ElMessage.success(message)
    dialogVisible.value = false
    fetch()
  }
}
//----获取菜单列表
const list = ref([])
onMounted(() => {
  fetch()
})
const fetch = async () => {
  const {code, message, data} = await findNodes()
  if (code === 200) {
    list.value = data
  }
}
</script>
<style scoped>
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