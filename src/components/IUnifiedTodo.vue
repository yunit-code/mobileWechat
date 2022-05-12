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
   v-show="propData.defaultStatus!='hidden'"
   class="idm-unifie-todo-box">
    <div class="idm-unifie-todo-box-title d-flex align-c just-b">
      <div class="d-flex align-c">
        <span :style="titleFontStyleObj">{{propData.htmlTitle}}</span>
        <svg v-if="propData.titleIconClass && propData.titleIconClass.length" class="idm-unifie-todo-box-title-icon" aria-hidden="true" >
          <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
        </svg>
        <svg-icon v-else icon-class="threeLine" className="idm-unifie-todo-box-title-icon"></svg-icon>
      </div>
      <van-icon class="idm-unifie-todo-box-title-more" name="ellipsis" @click="handleClick('clickMoreFunction')" />
    </div>
    <div class="idm-unifie-todo-box-sub" v-for="(item, index) in list" :key="index" @click="handleClick('clickToDoItemFunction',item)">
      <div class="idm-unifie-todo-box-sub-title" :class="{'idm-unifie-todo-box-sub-no-read': true}">
        {{item.title}}
      </div>
      <div class="idm-unifie-todo-box-sub-intr">
        <div class="d-flex align-c"><svg-icon iconClass="duihao" class="idm-unifie-todo-box-sub-icon"></svg-icon> <span>{{item.status}}</span> </div>
        <div class="d-flex align-c">
          <svg-icon iconClass="person" class="idm-unifie-todo-box-sub-icon"></svg-icon> <span>{{item.from}}</span> </div>
        <div class="d-flex align-c"><svg-icon iconClass="time" class="idm-unifie-todo-box-sub-icon"></svg-icon> <span>{{item.createTime}}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import 'vant/lib/icon/style';
const list = [{
  status: '已读',
  from: '文档处',
  createTime: '2022-05-09 09:00',
  title: '标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，'
},{
  status: '已读',
  from: '文档处',
  createTime: '2022-05-09 09:00',
  title: '标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，'
},{
  status: '已读',
  from: '文档处',
  createTime: '2022-05-09 09:00',
  title: '标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，标题标题标题，这是标题，这是他标题，'
}]
export default {
  name: 'IUnifiedTodo',
  components: {
    [Icon.name]: Icon
  },
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{
        htmlTitle:"紧急代办",
        width: '100%',
        height: 'auto',
        borderRadius: '5px',
        titleFontStyle: {
          fontColors: {
            colors: {
              hex: '#333'
            }
          }
        },
        bgColor: '#fff',
        maxCount: '3', // 最多显示几条
      },
      list
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
    handleClickItem(itemObject){
      let that = this;
      if(this.moduleObject.env=="develop"){
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
      pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
      var customFunction = this.propData.customFunction;
      console.log(customFunction)
            customFunction &&
                customFunction.forEach((item) => {
                  console.log(window[item.name])
                window[item.name] &&
                    window[item.name].call(this, {
                    customParam: item.param,
                    _this: this,
                    urlData:urlObject,
                    pageId,
                    });
                });
    },
    handleClickMore() {

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
      let styleObjectTitleIcon = {}
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
            case "width":
            case "height":
              styleObject[key]=element;
              break;
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
            case "bgImgUrl":
              styleObject["background-image"]=`url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移
              
              break;
            case "positionY":
              //背景纵向偏移
              
              break;
            case "bgRepeat":
              //平铺模式
                styleObject["background-repeat"]=element;
              break;
            case "bgAttachment":
              //背景模式
                styleObject["background-attachment"]=element;
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
            case "titleIconFontColor":
                styleObjectTitleIcon["color"] = element.hex;
                break
            case "titleIconFontSize":
                styleObjectTitleIcon["font-size"] = element + "px";
                styleObjectTitleIcon["width"] = element + "px";
                break
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-title .idm-unifie-todo-box-title-icon", styleObjectTitleIcon);
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
      this.propData.interfaceUrl&&window.IDM.http.get(this.propData.interfaceUrl,params)
      .then((res) => {
        //res.data
        that.$set(that.propData,"list",that.getExpressData("resultData",that.propData.dataFiled,res.data));
        // that.propData.fontContent = ;
      })
      .catch(function (error) {
        that.$set(that.propData,"list",that.getExpressData("resultData",that.propData.dataFiled, list))
      });
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
    handleClick(type, item = {}){
      if(this.moduleObject.env=="develop"){
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
      pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
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

<style lang="scss">
.d-flex{
  display: flex;
}
.align-c{
  align-items: center;
}
.just-b{
  justify-content: space-between;
}
.idm-unifie-todo-box{
  background-color: #fff;
  overflow: hidden;
  &-title{
    font: inherit;
    font-weight: 600;
    &-icon{
      width: 18px;
      height: 18px;
      margin: 0 0 0 8px;
    }
    &-more{
      font-size: 23px;
    }
  }
  &-sub{
    border-bottom: .6px solid #eee;
    &-title{
      margin: 8px 0 0 0;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: -moz-box;
      -moz-line-clamp: 2;
      -moz-box-orient: vertical;
      overflow-wrap: break-word;
      word-break: break-all;
      white-space: normal;
      overflow: hidden;
      letter-spacing: 1px;
      font-size: 15px;
    }
    &-no-read{
      color: #000;
      font-weight: 500;
    }
    &-intr{
      padding: 8px 0;
      @extend .d-flex;
      @extend .align-c;
      @extend .just-b;
      color: #999;
      font-size: 15px;
    }
    &:last-child{
      border-bottom: 0
    }
    &-icon{
      font-size: 14px;
      max-height: 14px;
      width: 14px;
      fill: currentColor;
      vertical-align: -0.15em;
      outline: none;
    }
  }
}
</style>