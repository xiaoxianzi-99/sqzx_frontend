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