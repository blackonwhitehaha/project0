<template>
  <BaseForm
    title="加入员盟会，共同努力终圆梦！"
    :form="registerForm"
    :rules="rules"
    buttonText="注册"
    apiEndpoint="http://localhost:8888/start/register"
    onSuccessRoute="/login"
    @updateCaptcha="updateCaptcha"
  >
    <el-form-item label="企业名称" prop="companyName">
      <el-input v-model="registerForm.companyName"></el-input>
    </el-form-item>
    <el-form-item label="管理员名称" prop="adminName">
      <el-input v-model="registerForm.adminName"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="contact">
      <el-input v-model="registerForm.contact"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="registerForm.password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input type="password" v-model="registerForm.confirmPassword"></el-input>
    </el-form-item>
    <el-form-item label="公司Icon" prop="icon">
      <el-upload
        class="upload-demo"
        action="http://localhost:8888/file/upload"
        list-type="picture-card"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-upload="beforeIconUpload"
        :on-exceed="handleExceed"
        :on-success="handleUploadSuccess"
        :data="{ compId: 'yourCompanyId' }"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="验证码" prop="captcha">
      <el-row>
        <el-col :span="14">
          <el-input v-model="registerForm.captcha" placeholder="请输入验证码"></el-input>
        </el-col>
        <el-col :span="10" class="captcha-col">
          <el-button style="margin-left: 20px;" @click="sendSmsCode" :disabled="countdown > 0">{{ countdown > 0 ? `${countdown} 秒后重新获取` : '获取验证码' }}</el-button>
        </el-col>
      </el-row>
    </el-form-item>

    <!-- 图片预览对话框 -->
    <el-dialog :visible.sync="previewVisible" width="30%">
      <img width="100%" :src="previewImage" alt="Preview Image" />
    </el-dialog>
  </BaseForm>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import BaseForm from './BaseForm.vue';

interface RegisterForm {
  companyName: string;
  contact: string;
  password: string;
  confirmPassword: string;
  icon: string;
  captcha: string;
  adminName: string;
}

const registerForm = reactive<RegisterForm>({
  companyName: '',
  contact: '',
  password: '',
  confirmPassword: '',
  icon: '',
  captcha: '',
  adminName: ''
});

const previewVisible = ref(false);
const previewImage = ref('');

const handlePreview = (file: any) => {
  previewImage.value = file.url;
  previewVisible.value = true;
};

const handleRemove = (file: any, fileList: any) => {
  console.log('remove', file, fileList);
};

const handleExceed = (files: any, fileList: any) => {
  ElMessage.warning(`最多只能上传一个文件`);
};

const handleUploadSuccess = (response: any, file: any) => {
  // response 是后端返回的响应数据
  console.log('Upload success:', response);

  // 假设后端返回的响应中包含了文件名 FileName
  const fileName = response.fileName;

  registerForm.icon = fileName;

  // 可以根据需要显示成功消息
  ElMessage.success('文件上传成功！');
};

const rules = reactive({
  companyName: [{ required: true, message: '企业名称不能为空', trigger: 'change' }],
  adminName: [{ required: true, message: '管理员名称不能为空', trigger: 'change' }],
  contact: [{ required: true, message: '联系方式不能为空', trigger: 'change' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'change' }],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'change' },
    { validator: (rule: any, value: string, callback: any) => {
      if (value !== registerForm.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    }, trigger: 'change' }
  ],
  captcha: [{ required: true, message: '验证码不能为空', trigger: 'change' }]
});

const countdown = ref(0);
let interval: number | undefined;

const sendSmsCode = async () => {
  if (countdown.value > 0) return;
  try {
    const response = await axios.post('http://localhost:8888/start/sendSms', { phone: registerForm.contact });
    if (response.data.isOK) {
      ElMessage.success('验证码发送成功');
      startCountdown();
    } else {
      ElMessage.error('验证码发送失败');
    }
  } catch (error) {
    ElMessage.error('验证码发送失败');
  }
};

const startCountdown = () => {
  countdown.value = 60;
  interval = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

const beforeIconUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt10M = file.size / 1024 / 1024 < 10;

  if (!isJPG && !isPNG) {
    ElMessage.error('上传图片只能是 JEPG 或 PNG 格式!');
    return false;
  }
  if (!isLt10M) {
    ElMessage.error('上传图片大小不能超过 10MB!');
    return false;
  }
  return true;
};

const updateCaptcha = () => {
  // Implement your logic to update captcha here
};
</script>

<style scoped>
.captcha-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
