<template>

  <el-container class="home-container">
    <el-header>
      <!-- 头部区域 -->
      <div>
        <img class="logo" src="../assets/圆白菜.png" alt="">
        <span>菜头网后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '64px':'200px'">
        <!-- 侧边栏折叠按钮 -->
        <div class="toggile-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true"
         :collapse="iscollapse" :collapse-transition="false" :router="true" :default-active="avtivePath">
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id"
            @click="saveNavState('/'+subItem.path+'')">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iscollapse: false,
      avtivePath: ''
    }
  },
  created() {
    this.getMenulest()
    this.avtivePath = window.sessionStorage.getItem('avtivePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单
    async getMenulest() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    // 菜单折叠按钮
    toggleCollapse() {
      this.iscollapse = !this.iscollapse
    },
    saveNavState(avtivePath) {
      window.sessionStorage.setItem('avtivePath', avtivePath)
      this.avtivePath = avtivePath
    }
  }
}
</script>

<style lang="less" scoped>
.logo {
  height: 60px;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin: left 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.toggile-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
