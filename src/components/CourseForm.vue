<template>
  <el-form 
  :model="localFormData" 
  :rules="rules"
  ref="formDataRef" 
  label-width="120px">
    <el-form-item v-if="localFormData" label="课程名称" prop="courseName">
      <el-input v-model="localFormData.courseName" placeholder="请输入课程名称"></el-input>
    </el-form-item>

    <el-form-item v-if="localFormData" label="课程封面" prop="courseCover">
      <el-upload
        action="http://localhost:8888/file/upload"
        list-type="picture-card"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="localFormData.courseCover"
        :limit="1"
        :on-exceed="handleExceed"
        :before-upload="beforeCoverUpload"
      >
      
        <el-icon name="plus"/>
      </el-upload>
      <br>
      <div slot="tip" class="el-upload__tip">(上传图片格式不超过5MB格式可为png/jpg/jpeg)</div>
    </el-form-item>
    <el-form-item v-if="localFormData" label="课程简介"prop="courseInfo">
      <el-input v-model="localFormData.courseInfo" type="textarea" :rows="2" placeholder="请输入课程简介"></el-input>
    </el-form-item>
    <el-form-item v-if="localFormData" label="课程排序" prop="courseRank">
      <el-input v-model="localFormData.courseRank" placeholder="请输入课程排序"></el-input>
    </el-form-item>
    <el-form-item v-if="localFormData" label="课程视频" prop="courseVideo">
      <el-upload
        action="http://localhost:8888/file/upload"
        list-type="text"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="localFormData.courseVideo"
        :limit="1"
        :on-exceed="handleExceed"
        :before-upload="beforeVideoUpload"
      >
        <el-icon name="plus"/>
        <el-button type="primary">选择文件</el-button>
      </el-upload>
      <br>
      <div slot="tip" class="el-upload__tip">(上传图片格式不超过5MB格式可为doc/xls/txt/pdf/mp4)</div>
    </el-form-item>
    <el-form-item v-if="localFormData" label="课程作者" prop="author">
      <el-input v-model="localFormData.courseAuthor" placeholder="请输入课程作者"></el-input>
    </el-form-item>
   
   
    <span style="margin-right: 450px;"></span><el-button v-if="localFormData" type="primary" @click="handleFormSubmit">提交</el-button>
      <el-button v-if="localFormData" @click="handleReset">重置</el-button>
   
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch,onMounted } from 'vue';
import { ElMessage, ElUpload, ElButton, ElFormItem, ElInput, ElDatePicker, ElIcon ,type FormInstance} from 'element-plus';
import EWangEditor from 'wangeditor';
const formDataRef = ref<FormInstance | null>(null);
const emit = defineEmits(['submit']);
// const formData = ref({
//   name: '',
//   coverList: [],
//   description: '',
//   fileList: [],
//   order: '',
//   author: ''
// });
interface CourseFormData {
  courseID?: number;
  courseName?: string;
  courseInfo?: string;
  courseAuthor?: string;
  courseRank?: number;
  courseCover?: any[];
  courseVideo?: any[];
  fileName1?: string;
  fileName2?: string;
}
const props = defineProps({
  formData: {
    type: Object as () => CourseFormData | null,
    default: () => ({})
  }
});
const localFormData = ref<CourseFormData | undefined>(props.formData ? { ...props.formData } : undefined);

watch(() => props.formData, (newVal) => {
  localFormData.value = newVal ? { ...newVal ,courseCover :[],courseVideo :[]} : undefined;
});
const formRef = ref();

const rules = ref({
  courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  courseInfo: [{ required: true, message: '请输入课程简介', trigger: 'blur' }],
  courseRank: [{ required: true, message: '请输入课程排序', trigger: 'blur' }],
  courseAuthor: [{ required: true, message: '请输入课程作者', trigger: 'blur' }]
});


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
  const isLt10M = file.size / 1024 / 1024 < 5;
  if (!isImage) {
    ElMessage.error('上传文件必须是图片!');
  }
  if (!isLt10M) {
    ElMessage.error('上传图片大小不能超过 5MB!');
  }
  return isImage && isLt10M;
};

const beforeVideoUpload = (file: any) => {
  const isMp4 = file.type === 'video/mp4';
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isMp4) {
    ElMessage.error('上传文件必须是mp4格式!');
  }
  if (!isLt5M) {
    ElMessage.error('上传视频大小不能超过 5MB!');
  }

  return isMp4 && isLt5M;
};



const handleUploadSuccess = (response: any, file: any) => {
  // response 是后端返回的响应数据
  console.log('Upload success:', response);

  // 假设后端返回的响应中包含了文件名 FileName
  const fileName1 = response.fileName1;
  const fileName2 = response.fileName2;

  localFormData.value.courseCover = fileName1;
  localFormData.value.courseVideo = fileName2;
  // 可以根据需要显示成功消息
  ElMessage.success('文件上传成功！');
};

const handleFormSubmit = () => {
  if (formDataRef.value) {
    formDataRef.value.validate((valid) => {
      if (valid) {
        emit('submit', localFormData.value);
      } else {
        ElMessage.error('请完善表单信息');
      }
    });
  }
};
const handleReset = () => {
  formDataRef.value.resetFields();
};
</script>

<style scoped>
.style1{
    width : 400px;
  }
</style>