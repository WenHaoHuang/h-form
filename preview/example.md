:::title
## Form 基于element-ui的表单组件

基于element-ui的表单组件

:::

### 简单使用

- 组件的简单使用场景

:::demo 通过 config 对组件进行配置

```html
<template>
  <h-form :options="options" />
</template>

<script>
  export default {
    data() {
      return {
        options: {
          name: {
            label: '名称',
            type: 'input'
          },
          name1: {
            label: '名称',
            type: 'input'
          }
        }
      };
    },
    methods: {}
  };
</script>
```

:::

:::api

### Options

| 名称 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ---------- | ------ | ------ | ---- |
| config | 说明 | object | - | - |
