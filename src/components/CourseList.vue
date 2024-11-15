<template>
    <div>
      <h1>
        课程名称<span style="margin-right: 8px;"></span><el-input v-model="courseQuery.name" style="width: 140px ;margin-right: 20px;" placeholder="请输入课程名称" />
        课程排序<span style="margin-right: 8px;"></span><el-input v-model="courseQuery.order"  placeholder="请输入课程排序" style="width: 180px;margin-right: 20px;"></el-input>
      <el-button type="primary" :icon="Search" @click="searchCourses">搜索</el-button>
      <el-button :icon="RefreshLeft" @click="resetSearch">重置</el-button>
    </h1>
    <el-button type="primary" :icon="CirclePlus" @click="showCreateCourseForm" plain>新增</el-button>
        <el-button type="success" :icon="EditPen" @click="editSelectedCourse" plain :disabled="!selectedCourse">修改</el-button>
        <el-button type="danger" :icon="DeleteFilled" @click="deleteCourses" plain>删除</el-button>

        <el-button type="warning" :icon="Download" @click="exportCourses" plain :disabled="selectedCourses.length === 0">导出</el-button>
      <el-table :data="filteredCourses" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column width="100px" type="selection" ></el-table-column>
        <el-table-column width="100px" prop="courseID" label="主键ID"></el-table-column>
        <el-table-column width="200px" prop="courseName" label="课程名称"></el-table-column>
        <el-table-column width="300px" prop="courseInfo" label="课程简介"></el-table-column>
        <el-table-column width="200px" prop="courseAuthor" label="作者">
          
        </el-table-column>
        <el-table-column prop="courseRank" label="排序"></el-table-column>
        <el-table-column width="200px" label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" :icon="EditPen" @click="editCourse(scope.row)" plain>修改</el-button>
            <el-button size="small" type="primary" :icon="DeleteFilled" @click="deleteCourse(scope.row)" plain>删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="增加课程" width="650px">
        <CourseForm @submit="handleFormSubmit"/>
      </el-dialog>

      <el-dialog v-model="dialogVisible2" title="修改课程" width="650px">
        <CourseChange :formData="formData" @submit="handleEditFormSubmit" />
      </el-dialog>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref ,computed} from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { DeleteFilled, Download, Search, CirclePlus, RefreshLeft, EditPen, Upload, DArrowRight } from '@element-plus/icons-vue'
  import { type Course, type CourseQuery } from '@/types';
  import CourseForm from '@/components/CourseForm.vue';
  import CourseChange from '@/components/CourseChange.vue';
  import axios from 'axios';
  import { onMounted } from 'vue';
  const courses = ref<Course[]>([]);
  const dialogVisible = ref(false);
  const dialogVisible2 = ref(false);
  const formData = ref<Course | null>(null);
    const selectedCourse = ref<Course | null>(null);
      const selectedCourses = ref<Course[]>([]);
        const filteredCourses = ref<Course[]>([]);
  const showCreateCourseForm = () => {
    dialogVisible.value = true;
  };
  const handleSelectionChange = (selection: Course[]) => {
  selectedCourse.value = selection.length === 1 ? selection[0] : null;
  selectedCourses.value = selection;
};
  const handleFormSubmit = (formData:any) => {
    dialogVisible.value = false;
  console.log('接收到的表单数据', formData);
  delete formData.courseCover;
  delete formData.courseVideo;
  axios.post('http://localhost:8888/course/addCourse', formData)
    .then(response => {
      if (response.data.isOK) {
        ElMessage.success(response.data.msg); // 显示后端返回的成功信息
        // 在提交成功后，重新获取所有课程数据，刷新页面
        findAll();
      } else {
        ElMessage.error(response.data.msg); // 显示后端返回的失败信息
      }
    })
    .catch(error => {
      ElMessage.error('系统错误，请稍后重试'); // 捕获并显示网络请求错误
    });
};
const findAll = () => {
  axios.get('http://localhost:8888/course/allList')
    .then(response => {
      if (true) {
        courses.value = response.data.courses;
        filteredCourses.value = courses.value;
        console.log(courses.value);
      } else {
        ElMessage.error('获取课程数据失败');
      }
    })
    .catch(error => {
      console.error('系统错误，请稍后重试', error);
      ElMessage.error('系统错误，请稍后重试');
    });
};

onMounted(() => {
  findAll();
});

const exportCourses = async () => {
  if (selectedCourses.value.length === 0) {
    ElMessage.warning('请先选择会议');
    return;
  }

  const dataStr = JSON.stringify(selectedCourses.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'selected-courses.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // 发送数据到后端接口
  try {
    const response = await axios.post('http://localhost:8888/file/exportCourses', dataStr, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.data.isOK) {
      ElMessage.success('数据成功发送到后端');
      downloadAndDeleteFile(response.data.fileName);
    } else { 
      ElMessage.error('发送数据到后端大失败');
    }
  } catch (error) {
    console.error('Error sending data to backend:', error);
    ElMessage.error('发送数据到后端失败');
  }
};

const downloadAndDeleteFile = async (filename: string) => {
  const json = { fileName: filename };

  try {
    const response = await axios.post('http://localhost:8888/file/download', json, {
      responseType: 'blob' // 指定响应类型为 blob
    });

    if (response.status === 200) {
      // 创建一个新的 Blob 对象来保存文件
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      ElMessage.success('文件下载成功');

      console.log(json)
      // 调用删除文件接口
      try {
        const deleteResponse = await axios.post('http://localhost:8888/file/delFile', json  , {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (deleteResponse.data.isOK) {
          ElMessage.success('文件删除成功');
        } else {
          ElMessage.error('文件删除失败: ' + deleteResponse.data.msg);
        }
      } catch (deleteError) {
        console.error('删除文件时系统错误，请稍后重试', deleteError);
        ElMessage.error('删除文件时系统错误，请稍后重试');
      }
    } else {
      ElMessage.error('获取文件数据失败');
    }
  } catch (error) {
    console.error('系统错误，请稍后重试', error);
    ElMessage.error('系统错误，请稍后重试');
  }
};
const handleEditFormSubmit = (formData: any) => {
  dialogVisible2.value = false;
  console.log('接收到的表单数据', formData);
  delete formData.courseCover;
  delete formData.courseVideo;
  axios.post('http://localhost:8888/course/updateCourse', formData)
    .then(response => {
      if (response.data.isOK) {
        ElMessage.success(response.data.msg); // 显示后端返回的成功信息
        // 在提交成功后，重新获取所有课程数据，刷新页面
        findAll();
      } else {
        ElMessage.error(response.data.msg); // 显示后端返回的失败信息
      }
    })
    .catch(error => {
      ElMessage.error('系统错误，请稍后重试'); // 捕获并显示网络请求错误
    });
}

const deleteCourses = async () => {
  if (selectedCourses.value.length === 0) {
    ElMessage.warning('请先选择课程');
    return;
  }
  ElMessageBox.confirm('是否删除选中的课程？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = selectedCourses.value.map(course => course.courseID);
    axios.post('http://localhost:8888/course/delCourse', { ids })
      .then(response => {
        if (response.data.isOK) {
          courses.value = courses.value.filter(course => !ids.includes(course.courseID));
          selectedCourses.value = [];
          ElMessage.success('选中的课程删除成功');
          findAll();
        } else {
          console.error('删除失败', response);
          ElMessage.error('删除失败');
        }
      })
      .catch(error => {
        console.error('系统错误，请稍后重试', error);
        ElMessage.error('系统错误，请稍后重试');
      });
  }).catch(() => {
    ElMessage.info('取消删除');
  });
};
const deleteCourse = (course: Course) => {
  ElMessageBox.confirm('是否删除该课程？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.post('http://localhost:8888/course/delCourse', { ids: [course.courseID] })
      .then(response => {
        if (response.data.isOK) {
          courses.value = courses.value.filter(c => c.courseID !== course.courseID);
          ElMessage.success('课程删除成功');
          findAll();
        } else {
          console.error('删除失败', response);
          ElMessage.error('删除失败');
        }
      })
      .catch(error => {
        console.error('系统错误，请稍后重试', error);
        ElMessage.error('系统错误，请稍后重试');
      });
  }).catch(() => {
    ElMessage.info('取消删除');
  });
};
  const submitForm = async () =>{
    dialogVisible.value = false;
    try {
      const response = await axios.post('http://localhost:8888/course/findAll', "你想提交的内容"); 
      if(response.data.isOk){
        ElMessage.success(response.data.msg);
      }else{        
        ElMessage.error(response.data.msg);
      }
    } catch (error) {
      ElMessage.error('系统错误，请稍后再试');
    }
  }
  const courseQuery = ref<CourseQuery>({
    name: '',
    order: null
  });
  
  
  const searchCourses = computed(() => {
  // 使用 computed 计算属性处理搜索逻辑
   filteredCourses.value = courses.value.filter((course) => {
    const nameMatch = courseQuery.value.name ? course.courseName.includes(courseQuery.value.name) : true;
    const orderMatch = !courseQuery.value.order || course.courseRank === courseQuery.value.order;
    
    return nameMatch && orderMatch;
  });
  
});
 
const editSelectedCourse = () => {
  if (selectedCourse.value) {
    formData.value = { ...selectedCourse.value };
    dialogVisible2.value = true;
  }
};
const editCourse = (course: Course) => {
  formData.value = { ...course };
  dialogVisible2.value = true;
};

 
const resetSearch = () => {
  courseQuery.value.name = '';
  courseQuery.value.order = null;
  searchCourses();
};
const uploadCourses = () => {
  // 模拟导入操作
  console.log('搜索课程:', courseQuery.value);
};
  </script>
  
  <style scoped>
  .el-input,
  .el-date-picker,
  .el-select,
  .el-button {
    margin: 10px 0;
  }
  </style>
  