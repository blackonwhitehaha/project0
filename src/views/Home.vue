<template>
  <div id="app" class="common-layout">
    <el-container class="full-height">
      <el-aside :width="isCollapse ? '64px' : '200px'" class="aside-style" :style="{ backgroundColor: themeColor }">
        <div class="avatar-container">
          <el-avatar :src="userIcon" size="large" class="avatar" @click="showUserInfoDrawer" />
        </div>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @select="handleSelect"
          :background-color="themeColor"
          :text-color="fontColor"
          :active-text-color="activeFontColor"
          router
        >
          <el-menu-item index="Dashboard">
            <el-icon><location /></el-icon>
            <template #title>员盟会</template>
          </el-menu-item>
          <el-menu-item index="UserManagement">
            <el-icon><user /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-sub-menu index="comp-management" v-if="userInfoForm.userType === 'SuperAdmin'">
            <template #title>
              <el-icon><Shop /></el-icon>
              <span>租户管理</span>
            </template>
            <el-menu-item index="TenantManagement">
              <template #title>
                <el-icon><house /></el-icon>
                <span>企业管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="DepartmentManagement">
              <template #title>
                <el-icon><OfficeBuilding /></el-icon>
                <span>部门管理</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="DepartmentManagement" v-else>
            <el-icon><OfficeBuilding /></el-icon>
            <template #title>部门管理</template>
          </el-menu-item>
          <el-menu-item index="NewsManagement">
            <el-icon><Document /></el-icon>
            <template #title>资讯管理</template>
          </el-menu-item>
          <el-menu-item index="CourseManagement">
            <el-icon><Notebook /></el-icon>
            <template #title>课程管理</template>
          </el-menu-item>
          <el-menu-item index="MeetingManagement">
            <el-icon><Calendar /></el-icon>
            <template #title>
              <span>会议管理</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="content-container" :style="{ marginLeft: isCollapse ? '64px' : '200px' }">
        <el-header class="header-style" :style="{ backgroundColor: themeColor, color: fontColor }">
          <div class="header-content">
            <div></div> <!-- 占位元素 -->
            <div class="text-header">欢迎{{ userInfoForm.userName }}使用{{ headerTitle }}系统</div>
            <el-popover
              placement="bottom"
              width="200"
              v-model:visible="settingsVisible"
              trigger="manual"
            >
              <el-form class="settings-form">
                <el-form-item label="边框颜色">
                  <el-color-picker v-model="themeColor" show-alpha />
                </el-form-item>
                <el-form-item label="选中文字颜色">
                  <el-color-picker v-model="activeFontColor" show-alpha />
                </el-form-item>
              </el-form>
              <template #reference>
                <el-icon @click="toggleSettingsPopover"><Brush /></el-icon>
              </template>
            </el-popover>
          </div>
        </el-header>
        <el-main class="main-style">
          <div class="breadcrumb-container">
            <el-icon @click="toggleCollapse" class="collapse-icon" v-if="!isCollapse">
              <Fold />
            </el-icon>
            <el-icon @click="toggleCollapse" class="collapse-icon" v-else>
              <Expand />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                v-for="(item, index) in breadcrumbItems"
                :key="index"
                :to="item.path"
                :replace="index === breadcrumbItems.length - 1"
              >
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view></router-view>
        </el-main>
      </el-container>
      <el-drawer
        v-model="userInfoVisible"
        title="个人信息"
        direction="ltr"
        size="50%"
      >
        <el-form :model="userInfoForm" class="user-info-form">
          <el-form-item label="用户姓名" :label-width="formLabelWidth">
            <el-input v-model="userInfoForm.userName" autocomplete="off" disabled="true"/>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="userInfoForm.userMail" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号码" :label-width="formLabelWidth">
            <el-input v-model="userInfoForm.userPhoneNumber" autocomplete="off" />
          </el-form-item>
          <el-form-item label="用户昵称" :label-width="formLabelWidth">
              <el-input v-model="userInfoForm.userAccount" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" :label-width="formLabelWidth">
              <el-input v-model="userInfoForm.createTime" autocomplete="off" disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户类型" :label-width="formLabelWidth">
              <el-input v-model="userInfoForm.userType" autocomplete="off" disabled="true"></el-input>
          </el-form-item>
          <div class="user-info-form__footer">
            <el-button @click="userInfoVisible = false">取消</el-button>
            <el-button type="primary" @click="updateUserInfo">保存</el-button>
          </div>
        </el-form>
      </el-drawer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { Document, User, House, OfficeBuilding, Notebook, Calendar, Location, Shop, Fold, Expand, Brush } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const activeIndex = ref(route.name as string);

const headerTitle = ref('员盟会');

const userIcon = ref<string>('/demo_icon.png'); // 使用绝对路径
const userInfoVisible = ref(false);
const settingsVisible = ref(false);
const formLabelWidth = '80px';
const isCollapse = ref(false);

const userInfoForm = reactive({
  userName: '',
  userMail: '',
  userPhoneNumber: '',
  userAccount: '',
  createTime: '',
  userType: '',
});

const themeColor = ref<string>(localStorage.getItem('themeColor') || '#67C23A');
const fontColor = ref<string>(localStorage.getItem('fontColor') || '#ffffff');
const activeFontColor = ref<string>(localStorage.getItem('activeFontColor') || '#00FF7F');

const fetchUserInfo = async () => {
  try {
    const response = await axios.get('http://localhost:8888/user/getUserInfo');
    userInfoForm.userName = response.data.loginUser.userName;
    userInfoForm.userMail = response.data.loginUser.userMail;
    userInfoForm.userPhoneNumber = response.data.loginUser.userPhoneNumber;
    userInfoForm.userAccount = response.data.loginUser.userAccount;
    userInfoForm.createTime = response.data.loginUser.createTime;
    userInfoForm.userType = response.data.loginUser.userType;
    userIcon.value = response.data.loginUser.userIcon || '/demo_icon.png'; // 确保有默认值
  } catch (error) {
    ElMessage.error('获取用户信息失败');
  }
};

const showUserInfoDrawer = () => {
  console.log('头像被点击'); // 调试日志
  userInfoVisible.value = true;
};

const toggleSettingsPopover = () => {
  settingsVisible.value = !settingsVisible.value;
};

const updateThemeColor = (color: string) => {
  themeColor.value = color;
  localStorage.setItem('themeColor', color);
};

const updateActiveFontColor = (color: string) => {
  activeFontColor.value = color;
  localStorage.setItem('activeFontColor', color);
};

const updateUserInfo = async () => {
  try {
    await axios.post('http://localhost:8888/user/updateNormalUser', userInfoForm);
    ElMessage.success('用户信息更新成功');
    userInfoVisible.value = false;
  } catch (error) {
    ElMessage.error('用户信息更新失败');
  }
};

const breadcrumbItems = ref<{ path: string; name: string }[]>([]);

const updateBreadcrumbItems = () => {
  const matchedRoutes = route.matched;
  breadcrumbItems.value = matchedRoutes.map((matchedRoute) => ({
    path: matchedRoute.path,
    name: getTitle(matchedRoute.name as string)
  }));
};

watch(route, (newRoute) => {
  headerTitle.value = getTitle(newRoute.name as string);
  activeIndex.value = newRoute.name as string;
  updateBreadcrumbItems();
});

const getTitle = (name: string): string => {
  switch (name) {
    case 'UserManagement':
      return '用户管理';
    case 'TenantManagement':
      return '租户管理';
    case 'DepartmentManagement':
      return '部门管理';
    case 'NewsManagement':
      return '资讯管理';
    case 'CourseManagement':
      return '课程管理';
    case 'MeetingManagement':
      return '会议管理';
    default:
      return '员盟会';
  }
};

const handleSelect = (key: string) => {
  activeIndex.value = key;
  router.push({ name: key });
};

const luminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = (bigint & 255);
  return [r, g, b];
};

const updateFontColors = () => {
  const [r, g, b] = hexToRgb(themeColor.value);
  const lum = luminance(r, g, b);
  fontColor.value = lum > 0.5 ? '#000000' : '#ffffff';
};

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

watch(themeColor, updateFontColors);
watch(activeFontColor, (newColor) => {
  localStorage.setItem('activeFontColor', newColor);
});

onMounted(() => {
  fetchUserInfo();
  updateBreadcrumbItems();
  updateFontColors();
});
</script>

<style scoped>
.full-height {
  height: 100vh;
  width: 100vw;
}

.aside-style {
  padding-top: 20px;
  position: fixed;
  height: 100vh;
  overflow: hidden;
  transition: width 0.3s ease-in-out;
}

.avatar-container {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  margin-top: -19px;
  cursor: pointer;
}

.content-container {
  height: 100%;
  transition: margin-left 0.3s ease-in-out;
}

.header-style {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0 20px;
  line-height: 64px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.main-style {
  padding: 20px;
  height: calc(100vh - 64px);
  overflow-y: hidden;
}

.el-menu-vertical-demo {
  border: 0 !important;
  margin-top: -23px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.breadcrumb-container {
  display: flex;
  align-items: center;
}

.collapse-icon {
  cursor: pointer;
  margin-right: 10px;
}

.dialog-footer,
.user-info-form__footer {
  display: flex;
  justify-content: flex-end;
}

.color-picker-container {
  display: flex;
  align-items: center;
}

.text-header {
  font-size: 20px;
  font-weight: bold;
}

.settings-form {
  padding: 20px;
}

</style>
