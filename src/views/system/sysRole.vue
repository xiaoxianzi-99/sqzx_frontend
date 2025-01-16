<template>
  <div id="serch-div">
    <!-- 搜索表单 -->
    <el-form label-width="70px" size="small">
      <el-form-item label="角色名称">
        <el-input
            style="width: 100%"
            placeholder="角色名称"
            v-model="queryDto.roleName"
        ></el-input>
      </el-form-item>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="searchSysRole">
          搜索
        </el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </el-row>
    </el-form>

    <!-- 添加按钮 -->
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <!-- 添加表单 -->
    <el-dialog v-model="dialogVisible" title="添加或修改角色" width="30%">
      <el-form label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName"/>
        </el-form-item>
        <el-form-item label="角色Code">
          <el-input v-model="sysRole.roleCode"/>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="sysRole.description"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table :data="list" style="width: 100%">
      <el-table-column prop="roleName" label="角色名称"/>
      <el-table-column prop="roleCode" label="角色code"/>
      <el-table-column prop="createTime" label="创建时间"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          修改
        </el-button>
        <el-button type="danger" size="small" @click="deleteSysRole(scope.row.id)">
          删除
        </el-button>
        <el-button type="warning" size="small" @click="showAssignMenu(scope.row)">
          分配菜单
        </el-button>
      </el-table-column>
    </el-table>
    <!-- 分配菜单的对话框
// tree组件添加ref属性，后期方便进行tree组件对象的获取
-->
    <el-dialog v-model="dialogMenuVisible" title="分配菜单" width="40%">
      <el-form label-width="80px">
        <el-tree
            :data="sysMenuTreeList"
            ref="tree"
            show-checkbox
            default-expand-all
            :check-on-click-node="true"
            node-key="id"
            :props="defaultProps"
        />
        <el-form-item>
          <el-button type="primary" @click="commit">提交</el-button>
          <el-button @click="dialogMenuVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--分页条-->
    <el-pagination
        v-model:current-page="pageParem.page"
        v-model:page-size="pageParem.limit"
        :page-sizes="[5, 10, 20, 40]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizenChange"
    />
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue';
import {getSysRoleListByPage, SaveSysRole, deleteSysRoleById, findSysRoleMenuByRoleId, doAssign} from "@/api/sysRole";
import {ElMessage, ElMessageBox} from "element-plus";
//------------提交修改的菜单分配
const roleId = ref()
const commit = async () => {
  //获取选中的节点
  const chechedNodes = tree.value.getCheckedNodes()
  const chechedNodeIds = chechedNodes.map(item => {
    return {
      menuId: item.id,
      isHalf: 0,
    }
  })
  //获取选中的半节点
  const halfCheckedNodes = tree.value.getHalfCheckedNodes()
  const halfCheckedNodeIds = halfCheckedNodes.map(item => {
    return {
      menuId: item.id,
      isHalf: 1,
    }
  })
  const allNodes = [...chechedNodeIds, ...halfCheckedNodeIds]
  let queryDto = {
    roleId: roleId.value,
    menuIdList: allNodes
  }
  const {code, message, data} = await doAssign(queryDto)
  if (code === 200) {
    ElMessage.success("分配成功")
    dialogMenuVisible.value = false
  } else {
    ElMessage.error(message)
  }
}
const sysMenuTreeList = ref([])
const dialogMenuVisible = ref(false)
const defaultProps = ref({
  children: 'children',
  label: 'title'
})
const tree = ref()
//定义菜单树
const showAssignMenu = async (row) => {
  dialogMenuVisible.value = true
  roleId.value = row.id
  const {code, message, data} = await findSysRoleMenuByRoleId(row.id)
  if (code === 200) {
    sysMenuTreeList.value = data.menuList
  }
  tree.value.setCheckedKeys(data.menuIdList)
}
//删除角色
const deleteSysRole = async (id) => {
  ElMessageBox.confirm(
      `是否删除该角色?`,
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(async () => {
    const {code, message, data} = await deleteSysRoleById(id)
    if (code === 200) {
      ElMessage({
        message: message,
        type: 'success',
      })
      fetchData()
    }

  }).catch(() => {
    ElMessage({
      message: '取消删除',
      type: 'info',
    })
  })
}
//角色修改
const editShow = async (row) => {
  sysRole.value = row
  dialogVisible.value = true
}

//定义角色数据模型
const defaltForm = {
  id: '',
  roleName: '',
  roleCode: '',
  description: '',
}
const sysRole = ref(defaltForm)
const submit = async () => {

  //判断数据模型中是否存在id，存在修改，不存在新增
  if (sysRole.value.id) {
    //修改
    const {code, message, data} = await SaveSysRole(sysRole.value)
    //判断
    if (code === 200) {
      //提示成功
      ElMessage({
        message: message,
        type: 'success',
      })
      //隐藏
      dialogVisible.value = false
      //刷新页面
      fetchData()
    } else {
      ElMessage({
        message: message,
        type: 'error',
      })
    }
  } else {
    const {code, message, data} = await SaveSysRole(sysRole.value)
    //判断
    if (code === 200) {
      //提示成功
      // ElMessage.success('角色添加成功')
      ElMessage({
        message: message,
        type: 'success',
      })
      //隐藏
      dialogVisible.value = false
      //刷新页面
      fetchData()
    } else {
      ElMessage({
        message: message,
        type: 'error',
      })
    }
  }


}
// 控制对话是否展示的变量
const dialogVisible = ref(false)

//进入添加
const addShow = () => {
  dialogVisible.value = true
}
//定义当前页改变事件方法
const handleCurrentChange = () => {
  fetchData()
}
//定义分页条数改变事件方法
const handleSizenChange = () => {
  fetchData()
}
//重置
const resetData = () => {
  queryDto.value.roleName = "";
  fetchData()
}

//抽取查询分页列表方法
const fetchData = async () => {
  //获取列表数据
  const {code, message, data} = await getSysRoleListByPage(pageParem.value.page, pageParem.value.limit, queryDto.value)
  //判断
  if (code === 200) {
    total.value = data.total
    list.value = data.list
  }
}

//定义搜索事件
const searchSysRole = async () => {
  fetchData()
}
//定义条件模型
const queryDto = ref({
  roleName: '',
})
//封装分页数据
const defaultPageForm = {
  page: 1,
  limit: 10,
}
//设置为响应式数据
const pageParem = ref(defaultPageForm)
//定义页面挂载后发起的请求
onMounted(async () => {
  fetchData()
})
// 分页条总记录数
let total = ref(0)

// 定义表格数据模型
let list = ref([])
</script>

<style scoped lang="scss">
#serch-div {
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
