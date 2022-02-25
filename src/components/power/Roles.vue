<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加角色按钮 -->
          <el-button type="primary" @click="addjs=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row  :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id" >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)"> {{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row vcenter :class="[i2!==0?'bdtop':'','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id" >
                  <el-col :span="6">
                  <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)"> {{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template v-slot="scope" >
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="query(scope.row.id)">编辑</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesById(scope.row.id)">删除</el-button>
         <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户模块的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addjs" width="60%" @close="addDialogClosed1">
      <!-- 表单 -->
      <el-form :model="addForm1" :rules="addFormRules" ref="addFormRef1" label-width="70px"  >
        <!-- 用户名 -->
        <el-form-item label="角色名称" prop="roleName" label-width="80px">
          <el-input v-model="addForm1.roleName" class="input1"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
          <el-input v-model="addForm1.roleDesc" class="input1"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addjs = false">取 消</el-button>
        <el-button type="primary" @click="addUser1">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息的对话框 -->
    <el-dialog title="修改信息" :visible.sync="aditjs" width="50%" @close="editClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef1" label-width="70px">
        <el-form-item label="id">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="email">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="mobile">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="aditjs = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
    <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" @close="setRightDialogClosed" ref="treeRef"></el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addForm1: {
        roleName: '',
        roleDesc: ''
      },
      // 控制添加用户对话框的显示与隐藏
      addjs: false,
      // 编辑用户信息的对话框的显示与隐藏
      aditjs: false,
      // 分配权限的对话框的显示与隐藏
      setRightDialogVisible: false,
      // 添加用户的表单验证规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入添加角色的名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 0,
            max: 15,
            message: '长度在 0 到 15 个字符',
            trigger: 'blur'
          }
        ]

      },
      // 编辑用户的表单验证规则
      editFormRules: {
        roleName: [
          { required: true, message: '请输入添加角色的名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 0,
            max: 15,
            message: '长度在 0 到 15 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 查询到的用户信息
      editForm: {},
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的id
      defKeys: [],
      roleId: ''

    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 监听修改用户表单的关闭事件
    editClosed() {
      this.$refs.editFormRef1.resetFields()
    },
    // 监听添加用户表单的关闭事件
    addDialogClosed1() {
      // 当触发了关闭事件，把表单内容清空
      this.$refs.addFormRef1.resetFields()
    },
    // 调用接口添加用户
    addUser1() {
      this.$refs.addFormRef1.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm1)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addjs = false
        this.getRolesList()
      })
    },
    // 查看用户信息
    async query(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查看用户信息失败')
      }
      this.editForm = res.data
      this.aditjs = true
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef1.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        this.aditjs = false
        this.getRolesList()
        this.$message.success('修改用户信息成功')
      })
    },
    async removeRolesById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res1 } = await this.$http.delete('roles/' + id)
      if (res1.meta.status !== 200) {
        return this.$message.error('删除用户信息失败')
      }
      this.getRolesList()
      this.$message.success('删除用户信息成功')
    },
    // 根据id删除对应权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res1 } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res1.meta.status !== 200) {
        return this.$message.error('删除该权限失败')
      }
      role.children = res1.data
      this.$message.success('删除该权限成功')
    },
    // 分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      // 获取到的数据保存到data中的rightslist
      this.rightslist = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式获取三级权限的id，并提交给data
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }

  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
 border-top: 1px solid #eee;
}
.bdbottom{
 border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
