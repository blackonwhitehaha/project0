<template>
  <BaseForm
    title="重置密码"
    :form="resetForm"
    :rules="rules"
    buttonText="重置密码"
    apiEndpoint="http://localhost:8888/start/resetPassword"
    onSuccessRoute="/login"
    @updateCaptcha="refreshCaptcha"
  >
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="resetForm.phone"></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="smsCode">
      <el-row>
        <el-col :span="14">
          <el-input v-model="resetForm.smsCode" placeholder="请输入短信验证码"></el-input>
        </el-col>
        <el-col :span="10">
          <el-button @click="sendSmsCode" :disabled="isSending.value" class="sms-code-button">
            {{ isSending.value ? `${countdown.value}s 后重发` : '获取验证码' }}
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input type="password" v-model="resetForm.newPassword"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input type="password" v-model="resetForm.confirmPassword"></el-input>
    </el-form-item>
  </BaseForm>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import BaseForm from './BaseForm.vue';

interface ResetForm {
  phone: string;
  smsCode: string;
  newPassword: string;
  confirmPassword: string;
}

const resetForm = reactive<ResetForm>({
  phone: '',
  smsCode: '',
  newPassword: '',
  confirmPassword: ''
});

const rules = reactive({
  phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
  smsCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
  newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { validator: (rule: any, value: string, callback: any) => {
      if (value !== resetForm.newPassword) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ]
});

const isSending = ref<boolean>(false);
const countdown = ref<number>(60);
let timer: number | null = null;

const sendSmsCode = async () => {
  if (!resetForm.phone) {
    ElMessage.error('请输入手机号');
    return;
  }

  isSending.value = true;
  try {
    const response = await axios.post('http://localhost:8888/start/sendSms', { phone: resetForm.phone });
    if (response.data.isOK) {
      ElMessage.success('验证码发送成功');
      startCountdown();
    } else {
      ElMessage.error('验证码发送失败');
      isSending.value = false;
    }
  } catch (error) {
    ElMessage.error('验证码发送失败');
    isSending.value = false;
  }
};

const startCountdown = () => {
  countdown.value = 60;
  timer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
      isSending.value = false;
    }
  }, 1000);
};

const refreshCaptcha = () => {
  // 添加刷新验证码的逻辑
};
</script>

<style scoped>
.sms-code-button {
  margin-left: 10px;
}
</style>
