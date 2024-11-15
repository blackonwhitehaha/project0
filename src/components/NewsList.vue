<template>
  <div>
    <h1>
      新闻标题<span style="margin-right: 8px;"></span><el-input v-model="newsQuery.newsTitle" style="width: 140px; margin-right: 20px;" placeholder="请输入新闻标题" />
      <!-- 新闻图片路径<span style="margin-right: 8px;"></span><el-input v-model="newsQuery.newsPic" style="width: 180px; margin-right: 20px;" placeholder="请输入新闻图片路径" /> -->
      作者<span style="margin-right: 8px;"></span><el-input v-model="newsQuery.newsAuthor" style="width: 140px; margin-right: 20px;" placeholder="请输入作者" />
      新闻简介<span style="margin-right: 8px;"></span><el-input v-model="newsQuery.newsInfo" placeholder="请输入新闻简介" style="width: 180px; margin-right: 20px;"></el-input>
      <el-button type="primary" :icon="Search" @click="searchNewss">搜索</el-button>
      <el-button :icon="RefreshLeft" @click="resetSearch">重置</el-button>
    </h1>
    <el-button type="primary" :icon="CirclePlus" @click="changeNew" plain>新增</el-button>
    <el-button type="success" :icon="EditPen" @click="editSelectedNews" plain :disabled="!selectedNews">修改</el-button>
    <el-button type="danger" :icon="DeleteFilled" @click="deleteNewss" plain :disabled="selectedNewss.length === 0">删除</el-button>
    <el-button type="warning" :icon="Download" @click="exportNewss" plain :disabled="selectedNewss.length === 0">导出</el-button>
    <el-table :data="filteredNewss" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column width="100px" type="selection"></el-table-column>
      <el-table-column width="300px" prop="newsTitle" label="新闻标题"></el-table-column>
      <el-table-column width="200px" prop="newsAuthor" label="作者"></el-table-column>
      <el-table-column  prop="newsInfo" label="新闻简介"></el-table-column>
      <el-table-column width="200px" label="操作">
        <template #default="scope">
          <el-button size="small" type="primary" :icon="EditPen" @click="editNews(scope.row)" plain>修改</el-button>
          <el-button size="small" type="primary" :icon="DeleteFilled" @click="deleteNews(scope.row)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
    <el-pagination
      style="padding-right: 10px"
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 20, 30, 40]"
      :size="size"
      :disabled="disabled"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNewss"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
    <el-dialog v-model="dialogFormVisible" title="增加资讯" width="1000px">
      <NewsForm @submit="handleFormSubmit" />
    </el-dialog>

    <el-dialog v-model="editFormVisible" title="修改资讯" width="1000px">
      <NewsChange :formData="formData" @submit="handleEditFormSubmit" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import NewsForm from './NewsForm.vue';
import NewsChange from './NewsChange.vue';
import { DeleteFilled, Download, Search, CirclePlus, RefreshLeft, EditPen } from '@element-plus/icons-vue';
import { type News, type NewsQuery } from '@/types';
import type { ComponentSize } from 'element-plus';
import axios from 'axios';

const dialogFormVisible = ref(false);
const editFormVisible = ref(false);
const totalNewss = ref(0);
const currentPage4 = ref(1);
const pageSize4 = ref(10);
const size = ref<ComponentSize>('default');
const newss = ref<News[]>([]);
const disabled = ref(false);
const selectedNews = ref<News | null>(null);
const selectedNewss = ref<News[]>([]);
const formData = ref<News | null>(null);
const filteredNewss = ref<News[]>([]);
const newsQuery = ref<NewsQuery>({
  newsTitle: '',
  newsPic: '',
  newsAuthor: '',
  newsInfo: ''
});

const changeNew = () => {
  dialogFormVisible.value = true;
};

const editNews = (news: News) => {
  formData.value = { ...news };
  editFormVisible.value = true;
};

const editSelectedNews = () => {
  if (selectedNews.value) {
    formData.value = { ...selectedNews.value };
    editFormVisible.value = true;
  }
};

const handleSelectionChange = (selection: News[]) => {
  selectedNews.value = selection.length === 1 ? selection[0] : null;
  selectedNewss.value = selection;
};

const handleFormSubmit = (formData: any) => {
   dialogFormVisible.value = false;
  console.log('接收到的表单数据', formData);
  delete formData.picFile;
  axios.post('http://localhost:8888/news/addNews', formData)
    .then(response => {
      if (response.data.isOK) {
        ElMessage.success(response.data.msg);
        findAll();
      } else {
        ElMessage.success(response.data.msg);
      }
    })
    .catch(error => {
      ElMessage.error('系统错误，请稍后重试');
    });
};

const handleEditFormSubmit = (formData: any) => {
  editFormVisible.value = false;
  console.log('接收到的表单数据', formData);
  delete formData.picFile;
  axios.post('http://localhost:8888/news/updateNews', formData)
    .then(response => {
      if (response.data.isOK) {
        ElMessage.success('修改成功');
        findAll();
      } else {
        ElMessage.error('修改失败');
      }
    })
    .catch(error => {
      ElMessage.error('系统错误，请稍后重试');
    });
};

const findAll = () => {
  axios.get('http://localhost:8888/news/allList')
    .then(response => {
      newss.value = response.data.newss;
      totalNewss.value = newss.value.length;
      getPaginatedNewss();
    })
    .catch(error => {
      ElMessage.error('系统错误，请稍后重试');
    });
};

const handleSizeChange = (val: number) => {
  pageSize4.value = val;
  handleCurrentChange(currentPage4.value);
};

const handleCurrentChange = (val: number) => {
  currentPage4.value = val;
  getPaginatedNewss();
};

const searchNewss = () => {
  const filtered = newss.value.filter(news => {
    const newsTitleMatch = newsQuery.value.newsTitle ? news.newsTitle.includes(newsQuery.value.newsTitle) : true;
   
    const newsAuthorMatch = newsQuery.value.newsAuthor ? news.newsAuthor.includes(newsQuery.value.newsAuthor) : true;
    const newsInfoMatch = newsQuery.value.newsInfo ? news.newsInfo.includes(newsQuery.value.newsInfo) : true;
   
    return newsTitleMatch && newsAuthorMatch && newsInfoMatch;
  });
  totalNewss.value = filtered.length;
  filteredNewss.value = filtered.slice(0, pageSize4.value);
};

const resetSearch = () => {
  newsQuery.value = {
    newsTitle: '',
    newsAuthor: '',
    newsInfo: '',
    newsPic: ''
  };
  searchNewss();
};

const deleteNewss = () => {
  if (selectedNewss.value.length === 0) {
    ElMessage.warning('请先选择会议');
    return;
  }
  ElMessageBox.confirm('是否删除选中的会议？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = selectedNewss.value.map(news => news.newsID);
    axios.post('http://localhost:8888/news/delNews', { ids })
      .then(response => {
        if (response.data.isOK) {
          newss.value = newss.value.filter(news => !ids.includes(news.newsID));
          selectedNewss.value = [];
          ElMessage.success('选中的会议删除成功');
          findAll();
        } else {
          ElMessage.error('删除失败');
        }
      })
      .catch(error => {
        ElMessage.error('系统错误，请稍后重试');
      });
  }).catch(() => {
    ElMessage.info('取消删除');
  });
};

const deleteNews = (news: News) => {
  ElMessageBox.confirm('是否删除该会议？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.post('http://localhost:8888/news/delNews', { ids: [news.newsID] })
      .then(response => {
        if (response.data.isOK) {
          newss.value = newss.value.filter(m => m.newsID !== news.newsID);
          ElMessage.success('会议删除成功');
        } else {
          ElMessage.error('删除失败');
        }
      })
      .catch(error => {
        ElMessage.error('系统错误，请稍后重试');
      });
  }).catch(() => {
    ElMessage.info('取消删除');
  });
};
const getPaginatedNewss = () => {
  const start = (currentPage4.value - 1) * pageSize4.value;
  const end = start + pageSize4.value;
  filteredNewss.value = newss.value.slice(start, end);
};
const exportNewss = async () => {
  if (selectedNewss.value.length === 0) {
    ElMessage.warning('请先选择用户');
    return;
  }

  const dataStr = JSON.stringify(selectedNewss.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'selected-newss.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  try {
    const response = await axios.post('http://localhost:8888/file/exportNews', dataStr, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // if (response.data.isOK) {
      ElMessage.success('数据成功发送到后端');
      console.log(response.data.fileName);
      downloadAndDeleteFile(response.data.fileName);
    // } else {
    //   ElMessage.error('发送数据到后端大失败');
    // }
  } catch (error) {
    ElMessage.error('发送数据到后端失败');
  }
};
const downloadAndDeleteFile = async (filename: string) => {
  
  const json = { fileName: filename };
  console.log(json);
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
onMounted(() => {
  findAll();
});
</script>

<style scoped>
.el-input,
.el-date-picker,
.el-select,
.el-button {
  margin: 10px 0;
}
.demo-pagination-block {
  margin-top: 10px;
  margin-left: 0%;
}
</style>