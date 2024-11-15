<template>
  <BaseForm
    title="欢迎使用员盟会会议系统"
    :form="loginForm"
    buttonText="登录"
    apiEndpoint="http://localhost:8888/start/login"
    onSuccessRoute="/home"
    @updateCaptcha="refreshCaptcha"
  >
    <el-form-item label="登录类型" class="full-width">
      <el-radio-group v-model="loginType" @change="onLoginTypeChange" class="full-width">
        <el-radio :label="1">企业租户</el-radio>
        <el-radio :label="2">超级管理员</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="loginType === 1 ? '企业名称' : '用户名'" class="full-width">
      <el-select
        v-if="loginType === 1"
        v-model="loginForm.username"
        filterable
        placeholder="选择或输入企业名称"
        :remote="true"
        :remote-method="fetchEnterprises"
        :loading="loading"
        class="full-width"
      >
        <el-option
          v-for="enterprise in filteredEnterprises"
          :key="enterprise"
          :label="enterprise"
          :value="enterprise"
        >
          <span>{{ enterprise }}</span>
        </el-option>
        <template v-if="!loading && filteredEnterprises.length === 0">
          <el-option disabled value="">
            <span>未找到匹配的企业名称</span>
          </el-option>
        </template>
      </el-select>
      <el-input v-else v-model="loginForm.username" placeholder="请输入用户名" class="full-width"></el-input>
    </el-form-item>
    <el-form-item label="密码" class="full-width">
      <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" class="full-width"></el-input>
    </el-form-item>
    <el-form-item label="验证码" class="captcha-item">
      <el-input v-model="loginForm.captcha" placeholder="请输入验证码" class="captcha-input"></el-input>
      <img :src="captchaSrc" @click="refreshCaptcha" class="captcha-image" />
    </el-form-item>
    <el-form-item class="full-width captcha-remember-wrapper">
      <div class="left">
        <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
      </div>
      <div class="right">
        <p class="captcha-refresh-text">看不清？点击图片刷新</p>
      </div>
    </el-form-item>
    <template #links>
      <div v-if="loginType === 1" class="register-link">
        没有账号？<router-link class="register-link-text" to="/register">点击此处注册</router-link>
      </div>
      <div class="forgot-password-link">
        忘记密码？<router-link class="forgot-password-link-text" to="/reset">点击此处重置</router-link>
      </div>
    </template>
  </BaseForm>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { type LoginForm } from '@/types';
import BaseForm from './BaseForm.vue';

const loginForm = ref<LoginForm>({
  username: '',
  password: '',
  captcha: ''
});

const loginType = ref<number>(1);
const rememberMe = ref<boolean>(false);
const enterprises = ref<string[]>([]);
const loading = ref<boolean>(false);
const query = ref<string>('');
const captchaSrc = ref<string>('');

// 加载记住的用户名和密码
onMounted(() => {
  const savedUsername = localStorage.getItem('savedUsername');
  const savedPassword = localStorage.getItem('savedPassword');
  const savedRememberMe = localStorage.getItem('savedRememberMe');

  if (savedUsername) {
    loginForm.value.username = savedUsername;
  }
  if (savedPassword) {
    loginForm.value.password = savedPassword;
  }
  if (savedRememberMe) {
    rememberMe.value = savedRememberMe === 'true';
  }

  axios.defaults.withCredentials = true; // 确保发送会话 Cookie
  refreshCaptcha(); // 初始化时加载验证码
});

const filteredEnterprises = computed(() => {
  if (query.value === '') {
    return enterprises.value;
  } else {
    return enterprises.value.filter(enterprise =>
      enterprise.includes(query.value)
    );
  }
});

const onLoginTypeChange = () => {
  loginForm.value.username = '';
  query.value = '';
};

const fetchEnterprises = async (input: string) => {
  query.value = input;
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:8888/start/allCompanyName'); 
    if (response.data.isOK && Array.isArray(response.data.companyNames)) {
      enterprises.value = response.data.companyNames;
    } else {
      enterprises.value = [];
      ElMessage.error('获取企业名称失败');
    }
  } catch (error) {
    enterprises.value = [];
    ElMessage.error('获取企业名称失败');
  } finally {
    loading.value = false;
  }
};

const refreshCaptcha = () => {
  captchaSrc.value = `http://localhost:8888/start/captcha?d=${new Date().getTime()}`;
};
</script>

<style scoped>
.captcha-item {
  display: flex;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  margin-left: 10px;
  cursor: pointer;
  height: 30px;
  width: 100px;
}

.captcha-refresh-button {
  margin-left: 10px;
}

.captcha-remember-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  margin-top: -20px;
  margin-bottom: -20px;
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  justify-content: flex-end;
  flex: 1;
}

.register-link {
  text-align: left;
}

.forgot-password-link {
  text-align: right;
}

.register-link-text,
.forgot-password-link-text {
  text-decoration: underline;
  color: red;
}

.captcha-refresh-text {
  margin-top: -25px;
  padding: 0px;
  font-size: 10px;
  color: grey;
  cursor: pointer;
}
</style>
