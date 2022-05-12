<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div idm-ctrl="idm_module"
   :id="moduleObject.id" 
   :idm-ctrl-id="moduleObject.id" 
   :title="propData.htmlTitle" 
   v-show="propData.defaultStatus!='hidden'">
    <template v-if="propData.compStyle !== 'styleFour'">
      <div class="box-title d-flex align-c just-b">
        <div class="d-flex align-c">
          <img src="../assets/red-three.png" class="box-title-icon" alt="">
          <span :style="titleFontStyleObj">{{propData.htmlTitle}}</span>
        </div>
        <div class="box-title-right" @click="handleClick('clickMoreFunction')">
          更多 <van-icon name="arrow" />
        </div>
      </div>
    </template>
    <div class="box" :style="{width: propData.width, height: propData.height}">
      <div v-if="propData.compStyle === 'styleFour'" class="box-top d-flex just-b align-c">
        <div class="box-top-left flex-1" :style="titleFontStyleObj">
          <span v-for="(item, index) in propData.messageTitleList" :key="index" :class="{active: defaultIndex === index}" @click="handleTitleClick(item,index)">{{item.messageSortTitle}}</span>
        </div>
        <van-icon class="box-top-more" name="ellipsis" @click="handleClick('clickMoreFunction')" />
      </div>
      <div v-else class="box-top2 d-flex just-b align-c">
        <div class="box-top2-left d-flex flex-1">
          <div v-for="(item, index) in propData.messageTitleList" :key="index" :class="{active: defaultIndex === index}" @click="handleTitleClick(item,index)">{{item.messageSortTitle}}</div>
        </div>
      </div>
      <ul class="box-list" v-if="propData.compStyle === 'styleFour' || propData.compStyle === 'styleOne'">
        <li class="d-flex align-c" v-for="(item, index) in messageList" :key="index" @click="handleClick('clickMoreFunction', item)">
          <!-- <span class="box-list-style-square" v-if="propData.compStyle === 'styleFour'"></span>
          <span class="box-list-style-square1" v-else></span> -->
          <svg-icon iconClass="square" class="box-list-style-square"></svg-icon>
          <span class="box-list-content">{{item.content}}</span>
          <span class="box-list-time" v-if="propData.compStyle !== 'styleOne'">{{item.createTime}}</span>
          </li>
      </ul>
      <ul class="box-list2" v-if="propData.compStyle === 'styleTwo' || propData.compStyle === 'styleThree'">
        <li class="d-flex" v-for="(item, index) in messageList" :key="index" @click="handleClick('clickMoreFunction', item)">
          <img src="../assets/red-three.png" :class="propData.compStyle === 'styleTwo' ? 'box-list2-left-img' : 'box-list2-left-img2'" alt="">
          <div style="overflow:hidden">
            <div class="box-list2-title" :class="propData.compStyle === 'styleTwo' ? 'box-list2-title' : 'box-list2-title2'">
              {{item.content}}
            </div>
            <div class="box-list2-title-bottom">
              {{item.createTime}}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
//titleInterfaceUrl, listInterfaceUrl
import { Icon } from 'vant';
import 'vant/lib/icon/style';
export default {
  name: 'IMessageList',
  components: {
    [Icon.name]: Icon
  },
  data(){
    return {
      moduleObject:{},
      defaultIndex: 0,
      propData:this.$root.propData.compositeAttr||{
        htmlTitle:"信息列表",
        width: '100%',
        height: 'auto',
        bgColor: {hex8: ''},
        titleFontStyle: {
          fontColors: {
            colors: {
              hex: '#333'
            }
          }
        },
        compStyle: 'styleFour',
        maxGroupCount: 3,
        maxContentCount: 3,
        messageTitleList: [{
          messageSortTitle: '标题'
        }]
      },
      messageList: [{
        content: '这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，',
        createTime: '2022-05-09'
      },
      {
        content: '这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，',
        createTime: '2022-05-09'
      },
      {
        content: '这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，这是一条消息，',
        createTime: '2022-05-09'
      }]
    }
  },
  computed: {
    titleFontStyleObj(){
      return {
        ...this.propData.titleFontStyle,
        color: this.propData.titleFontStyle.fontColors.hex,
        fontSize: this.propData.titleFontStyle.fontSize + this.propData.titleFontStyle.fontSizeUnit
      }
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    // console.log(this.moduleObject)
    this.convertAttrToStyleObject();
  },
  mounted() {
    //赋值给window提供跨页面调用
    this.$nextTick(function(params) {
      //单独组件不能使用这种方式
      // window[this.moduleObject.packageid] = this;
    });
  },
  destroyed() {},
  methods:{
    // 顶部tabs点击
    handleTitleClick(item, index) {
      console.log(index)
      this.defaultIndex = index
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.convertAttrToStyleObject();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(){
      var styleObject = {};
      if(this.propData.bgSize&&this.propData.bgSize=="custom"){
        styleObject["background-size"]=(this.propData.bgSizeWidth?this.propData.bgSizeWidth.inputVal+this.propData.bgSizeWidth.selectVal:"auto")+" "+(this.propData.bgSizeHeight?this.propData.bgSizeHeight.inputVal+this.propData.bgSizeHeight.selectVal:"auto")
      }else if(this.propData.bgSize){
        styleObject["background-size"]=this.propData.bgSize;
      }
      if(this.propData.positionX&&this.propData.positionX.inputVal){
        styleObject["background-position-x"]=this.propData.positionX.inputVal+this.propData.positionX.selectVal;
      }
      if(this.propData.positionY&&this.propData.positionY.inputVal){
        styleObject["background-position-y"]=this.propData.positionY.inputVal+this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if(!element&&element!==false&&element!=0){
            continue;
          }
          switch (key) {
            case "bgColor":
              if(element&&element.hex8){
                styleObject["background-color"]=element.hex8;
              }
              break;
            case "box":
              if(element.marginTopVal){
                styleObject["margin-top"]=`${element.marginTopVal}`;
              }
              if(element.marginRightVal){
                styleObject["margin-right"]=`${element.marginRightVal}`;
              }
              if(element.marginBottomVal){
                styleObject["margin-bottom"]=`${element.marginBottomVal}`;
              }
              if(element.marginLeftVal){
                styleObject["margin-left"]=`${element.marginLeftVal}`;
              }
              if(element.paddingTopVal){
                styleObject["padding-top"]=`${element.paddingTopVal}`;
              }
              if(element.paddingRightVal){
                styleObject["padding-right"]=`${element.paddingRightVal}`;
              }
              if(element.paddingBottomVal){
                styleObject["padding-bottom"]=`${element.paddingBottomVal}`;
              }
              if(element.paddingLeftVal){
                styleObject["padding-left"]=`${element.paddingLeftVal}`;
              }
              break;
            case "border":
              if(element.border.top.width>0){
                styleObject["border-top-width"]=element.border.top.width+element.border.top.widthUnit;
                styleObject["border-top-style"]=element.border.top.style;
                if(element.border.top.colors.hex8){
                  styleObject["border-top-color"]=element.border.top.colors.hex8;
                }
              }
              if(element.border.right.width>0){
                styleObject["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                styleObject["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  styleObject["border-right-color"]=element.border.right.colors.hex8;
                }
              }
              if(element.border.bottom.width>0){
                styleObject["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                styleObject["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  styleObject["border-bottom-color"]=element.border.bottom.colors.hex8;
                }
              }
              if(element.border.left.width>0){
                styleObject["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                styleObject["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  styleObject["border-left-color"]=element.border.left.colors.hex8;
                }
              }
              
              styleObject["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
      this.initData();
    },
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam(){
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : "",
        urlData: JSON.stringify(urlObject),
      };
      return params;
    },
    /**
     * 重新加载
     */
    reload(){
      //请求数据源
      this.initData();
    },
    /**
     * 加载动态数据
     */
    initData(){
      let that = this;
      //所有地址的url参数转换
      var params = that.commonParam();
      switch (this.propData.dataSourceType) {
        case "customInterface":
          this.propData.customInterfaceUrl&&window.IDM.http.get(this.propData.customInterfaceUrl,params)
          .then((res) => {
            //res.data
            that.$set(that.propData,"list",that.getExpressData("resultData",that.propData.dataFiled,res.data));
            // that.propData.fontContent = ;
          })
          .catch(function (error) {
            
          });
          break;
        case "pageCommonInterface":
          //使用通用接口直接跳过，在setContextValue执行
          break;
        case "customFunction":
          if(this.propData.customFunction&&this.propData.customFunction.length>0){
            var resValue = "";
            try {
              resValue = window[this.propData.customFunction[0].name]&&window[this.propData.customFunction[0].name].call(this,{...params,...this.propData.customFunction[0].param,moduleObject:this.moduleObject});
            } catch (error) {}
            that.propData.list = resValue;
          }
          break;
      }
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName,dataFiled,resultData){
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if(dataFiled){
        var filedExp = dataFiled;
        filedExp =
          dataName +
          (filedExp.startsWiths("[") ? "" : ".") +
          filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
      }
      //对结果进行再次函数自定义
      if(this.propData.customFunction&&this.propData.customFunction.length>0){
        var params = this.commonParam();
        var resValue = "";
        try {
          resValue = window[this.propData.customFunction[0].name]&&window[this.propData.customFunction[0].name].call(this,{
            ...params,
            ...this.propData.customFunction[0].param,
            moduleObject:this.moduleObject,
            expressData:_defaultVal,interfaceData:resultData
          });
        } catch (error) {
        }
        _defaultVal = resValue;
      }
      
      return _defaultVal;
    },
    /**
     * 文本点击事件
     */
    handleClick(type, item = {}){
      if(this.moduleObject.env=="develop"){
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
      pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
      //自定义函数
      /**
       * [
       * {name:"",param:{}}
       * ]
       */
      var clickFunction = this.propData[type];
      clickFunction&&clickFunction.forEach(item=>{
        window[item.name]&&window[item.name].call(this,{
          urlData:urlObject,
          pageId,
          customParam:item.param,
          _this:this
        });
      })
    },
    showThisModuleHandle(){
      this.propData.defaultStatus = "default";
    },
    hideThisModuleHandle(){
      this.propData.defaultStatus = "hidden";
    },
    /**
     * 组件通信：接收消息的方法
     * @param {
     *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
     *  message:{发送的时候传输的消息对象数据}
     *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
     *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
     * } object 
     */
    receiveBroadcastMessage(object){
      console.log("组件收到消息",object)
      if(object.type&&object.type=="linkageShowModule"){
        this.showThisModuleHandle();
      }else if(object.type&&object.type=="linkageHideModule"){
        this.hideThisModuleHandle();
      }
    },
    /**
     * 组件通信：发送消息的方法
     * @param {
     *  type:"自己定义的，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）",
     *  message:{实际的消息对象},
     *  rangeModule:"为空发送给全部，根据配置的属性中设定的值（值的内容是组件的packageid数组），不取子表的，比如直接 this.$root.propData.compositeAttr["attrKey"]（注意attrKey是属性中定义的bindKey）,这里的格式为：['1','2']"",
     *  className:"指定的组件类型，比如只给待办组件发送，然后再去过滤上面的值"
     *  globalSend:如果为true则全站发送消息，注意全站rangeModule是无效的，只有className才有效，默认为false
     * } object 
     */
    sendBroadcastMessage(object){
        window.IDM.broadcast&&window.IDM.broadcast.send(object);
    },
    /**
     * 交互功能：设置组件的上下文内容值
     * @param {
     *  type:"定义的类型，已知类型：pageCommonInterface（页面统一接口返回值）、"
     *  key:"数据key标识，页面每个接口设置的数据集名称，方便识别获取自己需要的数据"
     *  data:"数据集，内容为：字符串 or 数组 or 对象"
     * }
     */
    setContextValue(object) {
      console.log("统一接口设置的值", object);
      if (object.type != "pageCommonInterface") {
        return;
      }
      //这里使用的是子表，所以要循环匹配所有子表的属性然后再去设置修改默认值
      if (object.key == this.propData.dataName) {
        // this.propData.fontContent = this.getExpressData(this.propData.dataName,this.propData.dataFiled,object.data);
        this.$set(this.propData,"list",this.getExpressData(this.propData.dataName,this.propData.dataFiled,object.data));
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.d-flex{
  display: flex;
}
.align-c{
  align-items: center;
}
.just-b{
  justify-content: space-between;
}
.flex-1{
  flex: 1;
}
.box{
  background-color: #fff;
  overflow: hidden;
  &-title{
    padding: 0 0 10px 0;
    font: inherit;
     &-icon{
      width: 18px;
      height: 18px;
      margin: 0 7px 0 0;
    }
    &-right{
      font-weight: 400;
      color: #aaa;
      font-size: 16px;
    }
  }
  &-top{
    font: inherit;
    margin: 0 0 10px 0;
    &-left{
      overflow: hidden;
      >span{
        border-right: 1px solid #ccc;
        padding: 0 15px;
        &:first-child{
          padding: 0 15px 0 0;
        }
        &:last-child{
          padding: 0 0 0 15px;
          border: 0;
        }
      }
      .active{
        color: #000;
        font-weight: 500;
      }
    }
    &-more{
      font-size: 23px;
    }
  }
  &-top2{
    margin: 0 0 10px 0;
    font-size: 15px;
    &-left{
      overflow: hidden;
      >div{
        background-color: #eee;
        border-radius: 20px;
        overflow: hidden;
        margin: 0 4px;
        color: #000;
        padding: 2px 15px;
        &:last-child{
          
        }
      }
      .active{
        background-color: #fff;
        color: rgb(61, 140, 243);
        font-weight: 500;
      }
    }
    &-more{
      font-size: 23px;
    }
  }
  &-list{
    padding: 0;
    list-style: none;
    > li{
      font-size: 16px;
      margin: 0 0 8px 0;
      &:last-child{
        margin:  0;
      }
    }
    &-style-square{
      color: #000;
      font-size: 10px;
      margin: 0 5px 0 0;
    }
    &-content{
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
    }
    &-time{
      white-space: nowrap;
      color: #ccc;
      font-size: 16px;
      margin: 0 0 0 10px;
    }
  }
  &-list2{
    padding: 0;
    list-style: none;
    > li{
      
      width: 100%;
      margin: 0 0 10px 0;
      &:last-child{
        margin:  0;
      }
    }
    &-left-img{
      width: 80px;
      height: 70px;
      margin:0 10px 0 0;
    }
    &-left-img2{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin:0 10px 0 0;
    }
    &-title{
      width: 100%;
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
      font-size: 15px;
      font-weight: 600;
    }
    &-title2{
      width: 100%;
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:1;
      font-size: 15px;
      font-weight: 600;
    }
    &-title-bottom{
      margin: 10px 0 0 0;
      color: #ccc;
      font-size: 14px;
    }
    &-title-bottom2{
      margin: 10px 0 0 0;
      color: #ccc;
      font-size: 3.7vw;
    }
  }
}
</style>