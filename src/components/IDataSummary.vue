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
   >
    <!--
      组件内部容器
      增加class="drag_container" 必选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
    -->
    <div class="com-box">
      <div class="com-title" draggable="true">
      <span style="margin-right: 5px">{{propData.comTitle}}</span>
      <div class="idm_applicationcenter_title_left_icon">
          <svg v-if="propData.titleIconClass && propData.titleIconClass.length" class="idm_filed_svg_icon" aria-hidden="true" >
              <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
          </svg>
          <svg-icon v-else icon-class="application-icon" />
      </div>
      </div>
      <ul class="summary-box">
        <li v-for="(v,i) in propData.summaryConfigList && propData.summaryConfigList.slice(0, propData.maxNumber)" :key="i" class="summary-item"
        style="width: 50%">
          <div class="summary-bg" :style="{backgroundImage: v.bgUrl ? 'url('+IDM.url.getWebPath(v.bgUrl)+')' : 'linear-gradient(to right,#f4b0b0,#f4acac,#f18c8b)'}" v-proportion="0.5">
            <div style="marginBottom: 5px" class="summary-name">{{v.name}}</div>
            <div class="summary-num">{{v.sumNum}}</div>
          </div>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'IDataSummary',
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{
        comTitle: '数据汇总',
        maxNumber: 4,
        summaryConfigList:[
          {
            name: '省政府领导分工',
            sumNum: 10,
            bgUrl: '',
          },
          {
            name: 'test1',
            sumNum: 10,
            bgUrl: '',
          },
          {
            name: 'test2',
            sumNum: 10,
            bgUrl: '',
          },
          {
            name: 'test3',
            sumNum: 10,
            bgUrl: '',
          },
        ]
      }
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
  },
  mounted() {
    //赋值给window提供跨页面调用
    this.$nextTick(function(params) {
      this.moduleObject && this.moduleObject.packageid
        ? (window[this.moduleObject.packageid] = this)
        : null;
    });
  },
  destroyed() {},
  methods:{
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
      var styleObjectTitleIcon = {};
      var styleObjectSumTitle = {};
      var styleObjectNum = {};
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
      styleObject["font-size"] = '16px';
      styleObject["font-weight"]=800;
      styleObject["color"]='#333333';
      styleObjectSumTitle["font-size"] = '15px';
      styleObjectSumTitle["color"]='#ffffff';
      styleObjectNum["font-size"] = '15px';
      styleObjectNum["color"]='#ffffff';
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
            case "font":
              styleObject["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObject["color"]=element.fontColors.hex8;
              }
              styleObject["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObject["font-style"]=element.fontStyle;
              styleObject["font-size"]=element.fontSize+element.fontSizeUnit;
              styleObject["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObject["text-align"]=element.fontTextAlign;
              styleObject["text-decoration"]=element.fontDecoration;
              break;
            case "titleIconFontColor":
              styleObjectTitleIcon["color"] = element.hex;
              break
            case "titleIconFontSize":
              styleObjectTitleIcon["font-size"] = element + "px";
              styleObjectTitleIcon["width"] = element + "px";
              styleObjectTitleIcon["height"] = element + "px";
              break
            case "sumFont":
              styleObjectSumTitle["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObjectSumTitle["color"]=element.fontColors.hex8;
              }
              styleObjectSumTitle["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObjectSumTitle["font-style"]=element.fontStyle;
              styleObjectSumTitle["font-size"]=element.fontSize+element.fontSizeUnit;
              styleObjectSumTitle["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObjectSumTitle["text-align"]=element.fontTextAlign;
              styleObjectSumTitle["text-decoration"]=element.fontDecoration;
              break;
            case "numFont":
              styleObjectNum["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObjectNum["color"]=element.fontColors.hex8;
              }
              styleObjectNum["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObjectNum["font-style"]=element.fontStyle;
              styleObjectNum["font-size"]=element.fontSize+element.fontSizeUnit;
              styleObjectNum["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObjectNum["text-align"]=element.fontTextAlign;
              styleObjectNum["text-decoration"]=element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationcenter_title_left_icon .idm_filed_svg_icon", styleObjectTitleIcon);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .summary-name", styleObjectSumTitle);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .summary-num", styleObjectNum);
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
      // var params = that.commonParam();
      var params = {
        id: this.propData.selectApplication
      }
      this.propData.selectApplication&&this.propData.customInterfaceUrl&&window.IDM.http.get(this.propData.customInterfaceUrl, params)
      .then((res) => {
        //res.data
        that.$set(that.propData,"summaryConfigList",res.data);
      })
      // if(this.propData.customFunction&&this.propData.customFunction.length>0){
      //   let resValue = "";
      //   try {
      //     resValue = window[this.propData.customFunction[0].name]&&window[this.propData.customFunction[0].name].call(this,{...params,...this.propData.customFunction[0].param,moduleObject:this.moduleObject});
      //   } catch (error) {
      //   }
      //   that.propData.summaryConfigList = resValue;
      // }
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
      }else if(object.type&&object.type=="linkageHideModule"){
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
        this.$set(this.propData,"summaryConfigList",object.data);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  ul, li{
    padding:0;
    margin:0;
    list-style-type:none;
  }
  .com-box{
    .com-title{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .title-after{
        display: inline-block;
        width: 8px;
        height: 18px;
        background: #245399;
        border-radius: 10px 0 10px 0;
        margin-right: 2px;
        &:nth-child(2){
          opacity: 0.6;
        }
        &:nth-child(3){
          opacity: 0.2;
        }
      }
    }
  }
  .summary-box{
    display: flex;
    margin: 0 -5px;
    flex-wrap: wrap;
    .summary-item{
      padding: 0 5px;
      text-align: center;
      margin-bottom: 10px;
    }
    .summary-bg{
      border-radius: 6px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding-left: 5px;
    }
  }
</style>
