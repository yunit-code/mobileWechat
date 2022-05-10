<template>
  <component :is="`${componentName}`" :ref="`${componentName}`" />
</template>

<script>
export default {
  name: "Main",
  components: {},
  data() {
    return {
      componentName: "",
    };
  },
  props: {},
  created() { },
  mounted() {
    //这里需要把属性传递，并且把组件注册到核心框架提供的方法，然后这里接收固定的平台提供的几个方法，从而实现双向绑定刷新
    // alert(`${process.env.CodeVar}`)
    this.componentName = this.$root.componentName;
    console.log(this.componentName);
  },
};
</script>

<style lang="scss">
  .flex_between {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    align-items: center;
    -webkit-align-items: center;
  }

  .flex_end {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    align-items: center;
    -webkit-align-items: center;
  }

  .flex_start {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    align-items: center;
    -webkit-align-items: center;
  }

  .flex_end {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    align-items: center;
    -webkit-align-items: center;
  }

  .flex_center {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    align-items: center;
    -webkit-align-items: center;
  }

  .flex_between {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    align-items: center;
    -webkit-align-items: center;
  }

  .flex_around {
    display: flex;
    display: -webkit-flex;
    justify-content: space-around;
    -webkit-justify-content: space-around;
    align-items: center;
    -webkit-align-items: center;
  }

  .flex_column {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    -webkit-align-items: center;
  }

  .flex_column_between {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    -webkit-align-items: center;
  }

  .flex_column_center {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    -webkit-justify-content: center;
    align-items: center;
    -webkit-align-items: center;
  }

  .flex_baseline {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    align-items: flex-start;
    -webkit-align-items: flex-start;
  }
</style>
