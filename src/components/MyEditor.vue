<template>
    <div style="border: 1px solid #ccc">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"/>
  
      <Editor style="height: 150px; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
              @onCreated="handleCreated" @onChange="updateHtml"/>
    </div>
  </template>
  <script>
  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  
  import {onBeforeUnmount, ref, shallowRef, onMounted, watch} from 'vue'
  import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
  
  export default {
    components: {Editor, Toolbar},
    props: ['html'],
    setup(props, {emit}) {
      // 编辑器实例，必须用 shallowRef
      const editorRef = shallowRef()
  
      // 内容 HTML
      const valueHtml = ref(props.html)
      watch(props, (newValue, oldValue) => {
        valueHtml.value = newValue.html
      })
  
      const updateHtml = (val) => {
        emit('change', valueHtml.value)
      }
      const toolbarConfig = {
        toolbarKeys: [
          'bold', // 加粗
          'italic', // 斜体
          'through', // 删除线
          'underline', // 下划线
          'bulletedList', // 无序列表
          'numberedList', // 有序列表
          'color', // 文字颜色
          'insertLink', // 插入链接
          'fontSize', // 字体大小
          'lineHeight', // 行高
          'uploadImage', // 上传图片
          'delIndent', // 缩进
          'indent', // 增进
          'deleteImage',//删除图片
          'divider', // 分割线
          'insertImage', // 网络图片
          'insertTable', // 插入表格
          'justifyCenter', // 居中对齐
          'justifyJustify', // 两端对齐
          'justifyLeft', // 左对齐
          'justifyRight', // 右对齐
          'undo', // 撤销
          'redo', // 重做
          'clearStyle', // 清除格式
          'fullScreen' // 全屏
  
        ],
        excludeKeys: [
          'bgColor', // 背景色
          'blockquote', // 引用
          'codeBlock', // 代码段
          'emotion', // 表情
          'fontFamily', // 字体
          'headerSelect' // 标题
        ]
      }
      const editorConfig = {
        placeholder: '请输入内容...',
      }
  
      // 组件销毁时，也及时销毁编辑器
      onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
      })
  
      const handleCreated = (editor) => {
        editorRef.value = editor // 记录 editor 实例，重要！
      }
  
      return {
        editorRef,
        valueHtml,
        mode: 'default',
        toolbarConfig,
        editorConfig,
        handleCreated, updateHtml
      }
    }
  }
  </script>  