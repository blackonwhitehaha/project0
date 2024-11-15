<template>
  <el-form :model="localFormData" ref="formRef" label-width="120px">
    <el-form-item v-if="localFormData" label="会议名称" prop="meetingName">
      <el-input v-model="localFormData.meetingName" placeholder="请输入会议名称"></el-input>
    </el-form-item>

    <el-form-item v-if="localFormData" label="会议封面" prop="fileName">
      <el-upload
        action="http://localhost:8888/file/upload"
        list-type="picture-card"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="localFormData.coverFile"
        :limit="1"
        :on-exceed="handleExceed"
        :before-upload="beforeCoverUpload"
        :on-success="handleUploadSuccess"
      >
        <el-icon name="plus" />
      </el-upload>
      <br>
      <div slot="tip" class="el-upload__tip">(上传图片格式不超过5MB格式可为png/jpg/jpeg)</div>
    </el-form-item>

    <el-form-item v-if="localFormData" label="会议内容" prop="meetingContent">
      <MyEditor @change="updateMeetingContent" :html="localFormData.meetingContent" />
    </el-form-item>

    <el-form-item v-if="localFormData" label="创建人" prop="meetingCreater">
      <el-input v-model="localFormData.meetingCreater" placeholder="请输入创建人"></el-input>
    </el-form-item>

    <el-form-item v-if="localFormData" label="开始时间" prop="startTime">
      <el-date-picker v-model="localFormData.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
    </el-form-item>

    <el-form-item v-if="localFormData" label="结束时间" prop="endTime">
      <el-date-picker v-model="localFormData.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
    </el-form-item>

    <span style="margin-right: 800px;"></span><el-button v-if="localFormData" type="primary" @click="handleSubmit">提交</el-button>
    <el-button v-if="localFormData" @click="handleReset">重置</el-button>
    
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import MyEditor from '@/components/MyEditor.vue';

interface MeetingFormData {
  meetingID?: number;
  meetingName?: string;
  meetingCreater?: string;
  startTime?: string;
  meetingContent?: string;
  fileName?: string;
  coverFile?: any[];
  mettingCover?: string;
  endTime?: string;
  meetingState?:string;
}

const props = defineProps({
  formData: {
    type: Object as () => MeetingFormData | null,
    default: () => ({})
  }
});

const emit = defineEmits(['submit']);

const localFormData = ref<MeetingFormData | undefined>(props.formData ? { ...props.formData } : undefined);

watch(() => props.formData, (newVal) => {
  localFormData.value = newVal ? { ...newVal } : undefined;
});


const formRef = ref();

const handleUploadSuccess = (response: any, file: any) => {
  // response 是后端返回的响应数据
  console.log('Upload success:', response);

  // 假设后端返回的响应中包含了文件名 FileName
  const fileName = response.fileName;

  if (localFormData.value) {
    localFormData.value.mettingCover = fileName;
  }

  // 可以根据需要显示成功消息
  ElMessage.success('文件上传成功！');
};

const updateMeetingContent = (html: string) => {
  if (localFormData.value) {
    localFormData.value.meetingContent = html;
  }
};

const handlePreview = (file: any) => {
  console.log('preview', file);
};

const handleRemove = (file: any, fileList: any) => {
  console.log('remove', file, fileList);
};

const handleExceed = (files: any, fileList: any) => {
  ElMessage.warning(`最多只能上传一个文件`);
};

const beforeCoverUpload = (file: any) => {
  const isImage = file.type.startsWith('image/');
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isImage) {
    ElMessage.error('上传文件必须是图片!');
  }
  if (!isLt10M) {
    ElMessage.error('上传图片大小不能超过 10MB!');
  }
  return isImage && isLt10M;
};

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid && localFormData.value) {
      emit('submit', localFormData.value);
    } else {
      ElMessage.error('请完善表单信息');
      return false;
    }
  });
};

const handleReset = () => {
  formRef.value?.resetFields();
};

</script>

<style scoped>
/* 你可以在这里添加一些样式来美化你的表单 */
</style>
