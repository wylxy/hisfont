<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="jcname">
        <el-input
          v-model="queryParams.jcname"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.data_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jianchaxiang:jianchaxiang:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['jianchaxiang:jianchaxiang:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['jianchaxiang:jianchaxiang:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jianchaxiangList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="项目名称" align="center" prop="jcname" />
      <el-table-column label="检查价格" align="center" prop="price" />
      <el-table-column label="排序" align="center" prop="orders" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==2"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateStatus(scope.row)"
            v-hasPermi="['keshi:keshi:edit']"
          >启用</el-button>
          <el-button v-if="scope.row.status==1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateStatus(scope.row)"
            v-hasPermi="['keshi:keshi:edit']"
          >不可用</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jianchaxiang:jianchaxiang:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jianchaxiang:jianchaxiang:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改检查项目管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="jcname">
          <el-input v-model="form.jcname" placeholder="请输入检查项名称" />
        </el-form-item>
        <el-form-item label="检查价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入检查价格" />
        </el-form-item>
        <el-form-item label="排序" prop="orders">
          <el-input v-model="form.orders" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="项目介绍">
          <editor v-model="form.jianjie" :min-height="192"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listJianchaxiang, getJianchaxiang, delJianchaxiang, addJianchaxiang, updateJianchaxiang,updateStatus } from "@/api/jianchaxiang/jianchaxiang";

export default {
  name: "Jianchaxiang",
  dicts: ['data_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 检查项目管理表格数据
      jianchaxiangList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jcname: null,
        price: null,
        orders: null,
        jianjie: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jcname: [
          { required: true, message: "检查项名称不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "检查价格不能为空", trigger: "blur" }
        ],
        orders: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        jianjie: [
          { required: true, message: "介绍不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询检查项目管理列表 */
    getList() {
      this.loading = true;
      listJianchaxiang(this.queryParams).then(response => {
        this.jianchaxiangList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        jcname: null,
        price: null,
        orders: null,
        jianjie: null,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加检查项目管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getJianchaxiang(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改检查项目管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateJianchaxiang(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addJianchaxiang(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除检查项目管理编号为"' + ids + '"的数据项？').then(function() {
        return delJianchaxiang(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 修改状态 */
    updateStatus(row) {
      const id = row.id;
      const status = row.status;
      if(status==1){
          this.$modal.confirm('是否将科室设置为不可用？').then(function() {
            return updateStatus(id,2);
          }).then(() => {
            this.getList();
            this.$modal.msgSuccess("设置成功");
          }).catch(() => {});
      }else{
          this.$modal.confirm('是否将科室设置为可用？').then(function() {
            return updateStatus(id,1);
          }).then(() => {
            this.getList();
            this.$modal.msgSuccess("设置成功");
          }).catch(() => {});
      }

    }
  }
};
</script>
