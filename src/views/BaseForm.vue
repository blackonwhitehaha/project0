<template>
  <div class="form-container">
    <div class="form-box">
      <div class="form-title">{{ title }}</div>
      <el-form :model="form" :rules="rules" ref="formRef" @submit.native.prevent="onSubmit" label-width="100px" class="demo-ruleForm">
        <slot></slot>
        <el-form-item class="full-width">
          <el-button type="primary" @click="onSubmit" class="login-button full-width">{{ buttonText }}</el-button>
        </el-form-item>
      </el-form>
      <div class="form-links">
        <slot name="links"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface BaseFormProps {
  title: string;
  form: any;
  rules?: any;
  buttonText: string;
  apiEndpoint: string;
  onSuccessRoute: string;
}

const props = defineProps<BaseFormProps>();
const emit = defineEmits(['updateCaptcha']);
const router = useRouter();
const formRef = ref(null);

const onSubmit = async () => {
  if (formRef.value) {
    formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        try {
          const response = await axios.post(props.apiEndpoint, props.form);
          if (response.data.isOK) {
            ElMessage.success(response.data.message);
            emit('updateCaptcha');
            router.push(props.onSuccessRoute);
          } else {
            ElMessage.error(response.data.msg);
            emit('updateCaptcha');
          }
        } catch (error) {
          ElMessage.error('系统错误，请稍后再试');
          emit('updateCaptcha');
        }
      } else {
        ElMessage.error('表单验证失败，请检查输入');
      }
    });
  }
};
</script>

<style scoped>
.form-container {
  background: url('/background.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.form-box {
  width: 400px;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.form-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  font-family: 'Arial', sans-serif;
}

.demo-ruleForm {
  width: 100%;
}

.login-button {
  width: 100%;
}

.form-links {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
