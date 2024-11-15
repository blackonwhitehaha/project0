

<!--
<template>
  <Person/>
</template>
  
  <script  lang = "ts">
  import Person from './components/Person.vue'
  export default {
      components: {
          Person
      }
  }
</script>-->




<!--
  
  <template>
  <Sum/>
</template>

<script  lang = "ts">
  import Sum from './components/Sum.vue'
  export default {
      components: {
        Sum
      }
  }
</script>




<template>
  <div class="app">
    <h2 class="title">Vue路由测试</h2>
    <div class = "navigate">
      <a href="#/">首页</a>
      <a href="#/about">关于</a>
      <a href="#/contact">联系</a>      
    </div>
    <div class = "main-content">
      此处展示各种组件，具体看路径即可
    </div>
  </div>
</template>

<script lang ="ts" setup name="App">


</script>

<style>
/* App */
  .title {
    text-align: center;
    word-spacing: 5px;
    margin: 30px 0;
    height: 70px;
    line-height: 70px;
    background-image: linear-gradient(45deg, gray, white);
    border-radius: 10px;
    box-shadow: 0 0 2px;
    font-size: 30px;
  }
  .navigate {
    display: flex;
    justify-content: space-around;
    margin: 0 100px;
  }
  .navigate a {
    display: block;
    text-align: center;
    width: 90px;
    height: 40px;
    line-height: 40px;
    border-radius: 10px;
    background-color: gray;
    text-decoration: none;
    color: white;
    font-size: 18px;
    letter-spacing: 5px;
  }
  .navigate a.xiaozhupeiqi {
    background-color: #64967E;
    color: #ffc268;
    font-weight: 900;
    text-shadow: 0 0 1px black;
    font-family: 微软雅黑;
  }
  .main-content {
    margin: 0 auto;
    margin-top: 30px;
    border-radius: 10px;
    width: 90%;
    height: 400px;
    border: 1px solid;
  }
</style>

-->

<template>
  <router-view></router-view>
</template>

<script lang ="ts" setup name="app">
import router from './router';

</script>

<style>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.el-container {
  height: 100%;
  width: 100%;
}

.el-aside {
  background-color: #228B22;
  height: 100%;
}

.el-main {
  padding: 20px;
  overflow: auto; /* 仅在主内容区启用滚动 */
}

.el-header {
  background-color: #f5f5f5;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
</style>