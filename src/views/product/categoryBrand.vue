<template>
  <div class="search-div">
    <el-form label-width="70px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="品牌">
            <el-select
                class="m-2"
                placeholder="选择品牌"
                size="small"
                style="width: 100%"
                v-model="queryData.brandId"
            >
              <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类">
            <el-cascader
                :props="categoryProps"
                style="width: 100%"
                v-model="categoryIdList"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="searchCategoryByQuery">
          搜索
        </el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-row>
    </el-form>
  </div>

  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">添 加</el-button>
  </div>

  <el-dialog v-model="dialogVisible" title="添加或修改" width="30%">
    <el-form label-width="120px">
      <el-form-item label="品牌">
        <el-select
            class="m-2"
            placeholder="选择品牌"
            size="small"
            v-model="categoryBrand.brandId"
        >
          <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-cascader
            :props="categoryProps"
            v-model="categoryBrand.categoryId"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="categoryName" label="分类"/>
    <el-table-column prop="brandName" label="品牌"/>
    <el-table-column prop="logo" label="品牌图标" #default="scope">
      <img :src="scope.row.logo" width="50"/>
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
      v-model:page-size="pageParams.pageSize"
      v-model:page-current="pageParams.page"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizenChange"
  />
</template>

<script setup>
import {onMounted, ref} from "vue";
import {findCategoryByParentId} from "@/api/category";
import {findAllBrands} from "@/api/brand";
import {deleteCategoryBrand, listCategoryBrand, saveCategoryBrand, updateCategoryBrand} from "@/api/categoryBrand";
import {ElMessage, ElMessageBox} from "element-plus";
import {deleteSysUserById} from "@/api/sysUser";
//-------删除---------
const remove = async (id) => {
  ElMessageBox.confirm(`是否删除此记录?`, 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(async () => {
    const {code, message, data} = await deleteCategoryBrand(id)
    if (code === 200) {
      ElMessage.success(message)
      fetchData()
    } else {
      ElMessage.error(message)
    }
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}
//-------修改---------
const editShow = (row) => {
  categoryBrand.value = row
  dialogVisible.value = true
}
const updateData = async () => {
  if (categoryBrand.value.categoryId.length !== 3) {
    ElMessage.error('请选择分类')
    return
  }
  categoryBrand.value.categoryId = categoryBrand.value.categoryId[2]
  const {code, message, data} = await updateCategoryBrand(categoryBrand.value)
  if (code === 200) {
    ElMessage.success(message)
    dialogVisible.value = false
    fetchData()
  } else {
    ElMessage.error(message)
  }
}
//------添加---
const dialogVisible = ref(false)
const defaultFormParam = {
  id: '',
  brandId: '',
  categoryId: '',
}
const categoryBrand = ref(defaultFormParam)
const addShow = () => {
  categoryBrand.value = {}
  dialogVisible.value = true
}
const saveOrUpdate = async () => {
  if (categoryBrand.value.id) {
    //更新
    updateData()
  } else {
    //添加
    saveData()
  }
}
const saveData = async () => {
  if (categoryBrand.value.categoryId.length !== 3) {
    ElMessage.error('请选择分类')
    return
  }
  if (!categoryBrand.value.brandId) {
    ElMessage.error('请选择品牌')
    return
  }
  categoryBrand.value.categoryId = categoryBrand.value.categoryId[2]
  const {code, message} = await saveCategoryBrand(categoryBrand.value)
  if (code === 200) {
    ElMessage.success(message)
    dialogVisible.value = false
    fetchData()
  } else {
    ElMessage.error(message)
  }
}
//----------------
const searchCategoryByQuery = () => {
  fetchData()
}
const defaultPageForm = {page: 1, pageSize: 10}
const pageParams = ref(defaultPageForm)
const queryData = ref({
  brandId: '',
  categoryId: ''
})
const categoryIdList = ref([])
const fetchData = async () => {
  if (categoryIdList.value.length == 3) {
    queryData.value.categoryId = categoryIdList.value[2]
  } else if (categoryIdList.value.length == 2) {
    queryData.value.categoryId = categoryIdList.value[1]
  } else if (categoryIdList.value.length == 1) {
    queryData.value.categoryId = categoryIdList.value[0]
  } else {
    queryData.value.categoryId = ''
  }
  const {
    code,
    message,
    data
  } = await listCategoryBrand(pageParams.value.page, pageParams.value.pageSize, queryData.value)
  if (code === 200) {
    list.value = data.list
    total.value = data.total
  }
}

onMounted(async () => {
  const {data} = await findAllBrands()
  brandList.value = data
  fetchData()
})
const reset = () => {
  queryData.value = {
    brandId: '',
    categoryId: ''
  }
  categoryIdList.value = []
  fetchData()
}
//定义当前页改变事件方法
const handleCurrentChange = () => {
  fetchData()
}
//定义分页条数改变事件方法
const handleSizenChange = () => {
  fetchData()
}
const brandList = ref([])
const list = ref([])
const total = ref(0)
const props = {
  lazy: true,
  value: 'id',
  label: 'name',
  leaf: 'leaf',
  async lazyLoad(node, resolve) {   // 加载数据的方法
    if (typeof node.value == 'undefined') node.value = 0
    const {data} = await findCategoryByParentId(node.value)  // 调用接口获取数据
    //判断是否哦有下一级的标识
    data.forEach(item => {
      // 如果没有子节点，就是叶子节点
      item.leaf = !item.hasChildren
    })
    resolve(data)  // 返回数据
  }
};
const categoryProps = ref(props)
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