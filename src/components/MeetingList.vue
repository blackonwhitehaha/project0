<template>
  <div>
    <h1>
      会议名称<span style="margin-right: 8px;"></span>
      <el-input v-model="meetingQuery.meetingName" style="width: 140px; margin-right: 200px;" placeholder="请输入会议名称" />
      创建人<span style="margin-right: 8px;"></span>
      <el-input v-model="meetingQuery.meetingCreater" style="width: 140px; margin-right: 20px;" placeholder="请输入创建人" />
      开始时间<span style="margin-right: 8px;"></span>
      <el-date-picker v-model="meetingQuery.startTime" type="date" placeholder="请选择开始时间" style="width: 180px; margin-right: 20px;"></el-date-picker>
      <el-button type="primary" :icon="Search" @click="searchMeetings">搜索</el-button>
      <el-button :icon="RefreshLeft" @click="resetSearch">重置</el-button>
    </h1>
    <el-button type="primary" :icon="CirclePlus" @click="dialogFormVisible= true" plain>新增</el-button>
    <el-button type="success" :icon="EditPen" @click="editSelectedMeeting" plain :disabled="!selectedMeeting">修改</el-button>
    <el-button type="danger" :icon="DeleteFilled" @click="deleteMeetings" plain :disabled="selectedMeetings.length === 0">删除</el-button>
    <el-button type="warning" :icon="Download" @click="exportMeetings" plain :disabled="selectedMeetings.length === 0">导出</el-button>
    <el-table :data="filteredMeetings" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column width="50px" type="selection"></el-table-column>
      <el-table-column width="140px" prop="meetingName" label="会议名称"></el-table-column>
      <el-table-column width="100px" prop="meetingCreater" label="创建人"></el-table-column>
      <el-table-column width="100px" prop="meetingState" label="会议状态">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.meetingState)" effect="light" size="medium">
            {{ row.meetingState }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="meetingContent" label="会议内容"></el-table-column>
      <el-table-column width="200px" prop="startTime" label="开始时间"></el-table-column>
      <el-table-column width="200px" label="操作">
        <template #default="scope">
          <el-button size="small" type="primary" :icon="EditPen" @click="editMeeting(scope.row)" plain>修改</el-button>
          <el-button size="small" type="primary" :icon="DeleteFilled" @click="deleteMeeting(scope.row)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" title="增加会议" width="1000px">
      <MeetingForm @submit="handleFormSubmit" />
    </el-dialog>

    <el-dialog v-model="editFormVisible" title="修改会议" width="1000px">
      <MeetingChange :formData="formData" @submit="handleEditFormSubmit" />
    </el-dialog>

    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[1, 2, 3, 10]"
        :size="size"
        :disabled="disabled"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalMeetings"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { DeleteFilled, Download, Search, CirclePlus, RefreshLeft, EditPen } from '@element-plus/icons-vue';
import { type Meeting, type MeetingQuery } from '@/types';
import MeetingForm from './MeetingForm.vue';
import MeetingChange from './MeetingChange.vue';
import axios from 'axios';
import type { ComponentSize } from 'element-plus'

const meetingQuery = ref<MeetingQuery>({
  meetingName: '',
  meetingCreater: '',
  startTime: '',
});

const getStatusTagType = (meetingState: string): string => {
  switch (meetingState) {
    case '进行中':
      return 'primary';
    case '已完成':
      return 'success';
    case '未开始':
      return 'warning'; // Example: Use 'warning' for '未开始'
    default:
      return 'default'; // Handle any other status
  }
};

const meetings = ref<Meeting[]>([]);
const filteredMeetings = ref<Meeting[]>([]);
const dialogFormVisible = ref(false);
const editFormVisible = ref(false);
const formData = ref<Meeting | null>(null);
const selectedMeeting = ref<Meeting | null>(null);
const selectedMeetings = ref<Meeting[]>([]);
const currentPage4 = ref(1);
const pageSize4 = ref(2);
const totalMeetings = ref(0);
const size = ref<ComponentSize>('default');
const disabled = ref(false);

const handleSizeChange = (val: number) => {
  pageSize4.value = val;
  handleCurrentChange(currentPage4.value);
};

const handleCurrentChange = (val: number) => {
  currentPage4.value = val;
  getPaginatedMeetings();
};

const getPaginatedMeetings = () => {
  const start = (currentPage4.value - 1) * pageSize4.value;
  const end = start + pageSize4.value;
  filteredMeetings.value = meetings.value.slice(start, end);
};

const handleFormSubmit = (formData: any) => {
  dialogFormVisible.value = false;
  console.log('接收到的表单数据', formData);
  delete formData.coverFile;
  formData.meetingState = '未开始';
  axios.post('http://localhost:8888/meeting/addMeeting', formData)
    .then(response => {
      if (response.data.isOK) {
        ElMessage.success(response.data.msg); // 显示后端返回的成功信息
        findAll();
      } else {
        ElMessage.error(response.data.msg); // 显示后端返回的失败信息
      }
    })
    .catch(error => {
      ElMessage.error('系统错误，请稍后重试'); // 捕获并显示网络请求错误
    });
};

const handleEditFormSubmit = (formData: any) => {
  editFormVisible.value = false;
  console.log('接收到的表单数据', formData);
  delete formData.coverFile;
  axios.post('http://localhost:8888/meeting/updateMeeting', formData)
    .then(response => {
      if (response.data.isOK) {
        console.log('修改成功', response);
        ElMessage.success('修改成功');
        findAll();
      } else {
        console.error('修改失败', response);
        ElMessage.error('修改失败');
      }
    })
    .catch(error => {
      console.error('系统错误，请稍后重试', error);
      ElMessage.error('系统错误，请稍后重试');
    });
};

const searchMeetings = () => {
  const filtered = meetings.value.filter(meeting => {
    const nameMatch = meetingQuery.value.meetingName ? meeting.meetingName.includes(meetingQuery.value.meetingName) : true;
    const organizerMatch = meetingQuery.value.meetingCreater ? meeting.meetingCreater.includes(meetingQuery.value.meetingCreater) : true;
    const startTimeMatch = meetingQuery.value.startTime ?
      new Date(meeting.startTime).toISOString().slice(0, 7) === new Date(meetingQuery.value.startTime).toISOString().slice(0, 7) : true;
    return nameMatch && organizerMatch && startTimeMatch;
  });
  totalMeetings.value = filtered.length;
  filteredMeetings.value = filtered.slice(0, pageSize4.value);
};

const resetSearch = () => {
  meetingQuery.value.meetingName = '';
  meetingQuery.value.meetingCreater = '';
  meetingQuery.value.startTime = null;
  searchMeetings();
};

const findAll = () => {
  axios.get('http://localhost:8888/meeting/allList')
    .then(response => {
      if (true) {
        meetings.value = response.data.meetings;
        totalMeetings.value = meetings.value.length;
        getPaginatedMeetings();
      } else {
        ElMessage.error('获取用户数据失败');
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

const exportMeetings = async () => {
  if (selectedMeetings.value.length === 0) {
    ElMessage.warning('请先选择会议');
    return;
  }

  const dataStr = JSON.stringify(selectedMeetings.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  document.body.appendChild(link);
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // 发送数据到后端接口
  try {
    const response = await axios.post('http://localhost:8888/file/exportMeetings', dataStr, {
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




const deleteMeetings = () => {
  if (selectedMeetings.value.length === 0) {
    ElMessage.warning('请先选择会议');
    return;
  }
  ElMessageBox.confirm('是否删除选中的会议？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = selectedMeetings.value.map(meeting => meeting.meetingID);
    axios.post('http://localhost:8888/meeting/delMeeting', { ids })
      .then(response => {
        if (response.data.isOK) {
          meetings.value = meetings.value.filter(meeting => !ids.includes(meeting.meetingID));
          selectedMeetings.value = [];
          ElMessage.success('选中的会议删除成功');
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

const deleteMeeting = (meeting: Meeting) => {
  ElMessageBox.confirm('是否删除该会议？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.post('http://localhost:8888/meeting/delMeeting', { ids: [meeting.meetingID] })
      .then(response => {
        if (response.data.isOK) {
          meetings.value = meetings.value.filter(m => m.meetingID !== meeting.meetingID);
          ElMessage.success('会议删除成功');
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

const editMeeting = (meeting: Meeting) => {
  formData.value = { ...meeting };
  editFormVisible.value = true;
};

const editSelectedMeeting = () => {
  if (selectedMeeting.value) {
    formData.value = { ...selectedMeeting.value };
    editFormVisible.value = true;
  }
};

const handleSelectionChange = (selection: Meeting[]) => {
  selectedMeeting.value = selection.length === 1 ? selection[0] : null;
  selectedMeetings.value = selection;
};
</script>

<style scoped>
.el-input, .el-date-picker, .el-button {
  margin: 10px 0;
}
.demo-pagination-block {
  margin-top: 10px;
  margin-left: 60%;
}
</style>
