<template>
  <div class="dashboard">
    <el-card>
      <h1>欢迎使用管理系统</h1>
      <p>请选择左侧菜单进行操作</p>

      <div class="content">
        <el-col :span="16">
          <el-card>
            <div slot="header" class="clearfix">
              <span>联系信息</span>
            </div>
            <div class="text">
              <p>官网：https://www.neu.edu.cn/</p>
              <p>QQ群：群号xxxxxxxxxx</p>
              <p>微信号：YuanMengUnion</p>
              <p>邮箱：2113541850@qq.com</p>
            </div>
          </el-card>

          <el-card style="margin-top: 20px;">
            <div slot="header" class="clearfix">
              <span>技术选型</span>
            </div>
            <div class="tech-selection">
              <p><strong>后端技术：</strong>SpringBoot, Aliyun redis, Aliyun sms, MyBatis, Jackson</p>
              <p><strong>前端技术：</strong>CSS, SCSS, Vue, Element Plus, Axios</p>
            </div>
          </el-card>
        </el-col>

        <el-card style="margin-top: 20px;">
          <div slot="header" class="clearfix">
            <span>更新日志</span>
          </div>
          <div class="update-log">
            <el-timeline>
              <el-timeline-item
                v-for="(log, index) in updateLogs"
                :key="index"
                :timestamp="log.date"
              >
                {{ log.version }} - {{ log.description }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
const updateLogs = [
  { date: '2024-06-30', version: 'v3.8.8', description: '修复了若干Bug' },
  { date: '2023-12-08', version: 'v3.8.7', description: '增加了新功能' },
  { date: '2023-06-30', version: 'v3.8.6', description: '优化了性能' },
  { date: '2023-01-01', version: 'v3.8.5', description: '更新了UI' },
  { date: '2022-09-26', version: 'v3.8.4', description: '修复了若干Bug' },
  { date: '2022-06-27', version: 'v3.8.3', description: '增加了新功能' },
  { date: '2022-04-02', version: 'v3.8.2', description: '优化了性能' },
  { date: '2022-01-01', version: 'v3.8.1', description: '更新了UI' }
];
</script>

<style scoped>
.dashboard {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background-image: url('/db2.png'); /* 替换为你的背景图片路径 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.el-card {
  width: 100%;
  max-width: 1200px;
  margin: auto;
}
.content {
  margin-top: 20px;
}
.text {
  font-size: 14px;
}
.tech-selection {
  font-size: 14px;
}
.update-log {
  margin-top: 20px;
}
</style>
