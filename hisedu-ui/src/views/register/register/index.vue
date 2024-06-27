<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="病历号" prop="caseNumber">
        <el-input
          v-model="queryParams.caseNumber"
          placeholder="请输入病历号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="queryParams.gender" placeholder="请选择性别" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号" prop="cardNumber">
        <el-input
          v-model="queryParams.cardNumber"
          placeholder="请输入身份证号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="挂号科室" prop="deptmentId">
        <el-select @change="getDoctorList()" v-model="form.deptmentId" placeholder="请选择科室">
          <el-option
            v-for="item in keshiList"
            :key="item.id"
            :label="item.ksname"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="挂号医生" prop="employeeId">
        <el-select v-model="queryParams.employeeId" placeholder="请选择医生">
          <el-option
            v-for="item in doctorList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="挂号级别" prop="registLevel">
        <el-select v-model="queryParams.registLevel" placeholder="请选择挂号级别" clearable size="small">
          <el-option
            v-for="dict in dict.type.regist_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算类别" prop="settleCategory">
        <el-select v-model="queryParams.settleCategory" placeholder="请选择结算类别" clearable size="small">
          <el-option
            v-for="dict in dict.type.settle_category"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收费方式" prop="registMethod">
        <el-select v-model="queryParams.registMethod" placeholder="请选择收费方式" clearable size="small">
          <el-option
            v-for="dict in dict.type.pay_way"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="看诊状态" prop="visitState">
        <el-select v-model="queryParams.visitState" placeholder="请选择看诊状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.kz_status"
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
          v-hasPermi="['register:register:add']"
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
          v-hasPermi="['register:register:edit']"
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
          v-hasPermi="['register:register:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="registerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="病历号" align="center" prop="caseNumber" />
      <el-table-column label="姓名" align="center" prop="realName" />
      <el-table-column label="性别" align="center" prop="gender">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.gender"/>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center" prop="cardNumber" />
      <el-table-column label="出生日期" align="center" prop="birthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="年龄类型" align="center" prop="ageType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.age_type" :value="scope.row.ageType"/>
        </template>
      </el-table-column>
      <el-table-column label="家庭住址" align="center" prop="homeAddress" />
      <el-table-column label="挂号金额" align="center" prop="registMoney" />
      <el-table-column label="挂号日期" align="center" prop="visitDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.visitDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="午别" align="center" prop="noon">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wu_bie" :value="scope.row.noon"/>
        </template>
      </el-table-column>
      <el-table-column label="科室名称" align="center" prop="deptmentName" />
      <el-table-column label="医生姓名" align="center" prop="employeeName" />
      <el-table-column label="挂号级别" align="center" prop="registLevel">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.regist_level" :value="scope.row.registLevel"/>
        </template>
      </el-table-column>
      <el-table-column label="结算类别" align="center" prop="settleCategory">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.settle_category" :value="scope.row.settleCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="病历本要否" align="center" prop="isBook">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.blb_yby" :value="scope.row.isBook"/>
        </template>
      </el-table-column>
      <el-table-column label="收费方式" align="center" prop="registMethod">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pay_way" :value="scope.row.registMethod"/>
        </template>
      </el-table-column>
      <el-table-column label="看诊状态" align="center" prop="visitState">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.kz_status" :value="scope.row.visitState"/>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['register:register:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['register:register:remove']"
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

    <!-- 添加或修改挂号管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="病历号" prop="caseNumber">
          <el-input v-model="form.caseNumber" placeholder="请输入病历号" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="cardNumber">
          <el-input v-model="form.cardNumber" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker clearable size="small"
            v-model="form.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="年龄类型" prop="ageType">
          <el-select v-model="form.ageType" placeholder="请选择年龄类型">
            <el-option
              v-for="dict in dict.type.age_type"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="家庭住址" prop="homeAddress">
          <el-input v-model="form.homeAddress" placeholder="请输入家庭住址" />
        </el-form-item>
        <el-form-item label="挂号金额" prop="registMoney">
          <el-input v-model="form.registMoney" placeholder="请输入挂号金额" />
        </el-form-item>
        <el-form-item label="挂号日期" prop="visitDate">
          <el-date-picker clearable size="small"
            v-model="form.visitDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择挂号日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="午别" prop="noon">
          <el-select v-model="form.noon" placeholder="请选择午别">
            <el-option
              v-for="dict in dict.type.wu_bie"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="挂号科室" prop="deptmentId">
          <el-select @change="getDoctorList()" v-model="form.deptmentId" placeholder="请选择科室">
            <el-option
              v-for="item in keshiList"
              :key="item.id"
              :label="item.ksname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="挂号医生" prop="employeeId">
          <el-select v-model="form.employeeId" placeholder="请选择科室">
            <el-option
              v-for="item in doctorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="挂号级别" prop="registLevel">
          <el-select v-model="form.registLevel" placeholder="请选择挂号级别">
            <el-option
              v-for="dict in dict.type.regist_level"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算类别" prop="settleCategory">
          <el-select v-model="form.settleCategory" placeholder="请选择结算类别">
            <el-option
              v-for="dict in dict.type.settle_category"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="病历本要否" prop="isBook">
          <el-select v-model="form.isBook" placeholder="请选择病历本要否">
            <el-option
              v-for="dict in dict.type.blb_yby"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收费方式" prop="registMethod">
          <el-select v-model="form.registMethod" placeholder="请选择收费方式">
            <el-option
              v-for="dict in dict.type.pay_way"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
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
import { listRegister, getRegister, delRegister, addRegister, updateRegister } from "@/api/register/register";
import { getKeshiList } from "@/api/keshi/keshi";
import { getDoctorList } from "@/api/doctor/doctor";
export default {
  name: "Register",
  dicts: ['sys_user_sex', 'age_type', 'wu_bie', 'regist_level', 'settle_category', 'blb_yby', 'pay_way', 'kz_status'],
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
      // 挂号管理表格数据
      registerList: [],

      keshiList: [],

      doctorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        caseNumber: null,
        realName: null,
        gender: null,
        cardNumber: null,
        birthday: null,
        age: null,
        ageType: null,
        homeAddress: null,
        registMoney: null,
        visitDate: null,
        noon: null,
        deptmentId: null,
        employeeId: null,
        registLevel: null,
        settleCategory: null,
        isBook: null,
        registMethod: null,
        visitState: null,
        deptmentName: null,
        employeeName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        caseNumber: [
          { required: true, message: "病历号不能为空", trigger: "blur" }
        ],
        realName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        gender: [
          { required: true, message: "性别不能为空", trigger: "blur" }
        ],
        cardNumber: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        age: [
          { required: true, message: "年龄不能为空", trigger: "blur" }
        ],
        registMoney: [
          { required: true, message: "挂号金额不能为空", trigger: "blur" }
        ],
        visitDate: [
          { required: true, message: "挂号日期不能为空", trigger: "blur" }
        ],
        noon: [
          { required: true, message: "午别不能为空", trigger: "change" }
        ],
        // deptmentId: [
        //   { required: true, message: "挂号科室不能为空", trigger: "blur" }
        // ],
        // employeeId: [
        //   { required: true, message: "挂号医生不能为空", trigger: "blur" }
        // ],
        registLevel: [
          { required: true, message: "挂号级别不能为空", trigger: "change" }
        ],
        settleCategory: [
          { required: true, message: "结算类别不能为空", trigger: "change" }
        ],
        isBook: [
          { required: true, message: "病历本要否不能为空", trigger: "change" }
        ],
        registMethod: [
          { required: true, message: "收费方式不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    //获取可用科室
    getKeshiList({}).then(response => {
      console.log(response)
      this.keshiList = response;
    });
  },
  methods: {
    /** 查询挂号管理列表 */
    getList() {
      this.loading = true;
      // this.queryParams.settleCategoryId = this.form.settleCategoryId
      listRegister(this.queryParams).then(response => {
        this.registerList = response.rows;
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
        caseNumber: null,
        realName: null,
        gender: "0",
        cardNumber: null,
        birthday: null,
        age: null,
        ageType: null,
        homeAddress: null,
        registMoney: null,
        visitDate: null,
        noon: null,
        deptmentId: null,
        employeeId: null,
        registLevel: null,
        settleCategory: null,
        isBook: null,
        registMethod: null,
        visitState: "0",
        deptmentName: null,
        employeeName: null
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
      this.title = "添加挂号管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRegister(id).then(response => {
        console.log(response.data)
        this.form = response.data;
        this.open = true;
        this.title = "修改挂号管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRegister(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRegister(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除挂号管理编号为"' + ids + '"的数据项？').then(function() {
        return delRegister(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 获取医生列表 */
    getDoctorList() {
      this.deptmentId = this.queryParams.deptmentId;
      getDoctorList(this.form.deptmentId).then(response => {
        this.doctorList = response.data;
      });
    }
  }
};
</script>
