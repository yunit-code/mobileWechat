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
   class="idm-unifie-todo-box in-box">
    <div class="idm-unifie-todo-box-title d-flex align-c just-b">
      <div class="d-flex align-c">
        <span class="idm-unifie-todo-box-title-font">{{propData.htmlTitle}}</span>
        <svg v-if="propData.titleIconClass && propData.titleIconClass.length" class="idm-unifie-todo-box-title-icon" aria-hidden="true" >
          <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
        </svg>
        <svg-icon v-else icon-class="threeLine" className="idm-unifie-todo-box-title-icon"></svg-icon>
      </div>
      <div v-if="propData.showMore" class="d-flex align-c"  @click="handleClickMore">
        <span v-if="todoData[countKey] && propData.showTodoNumber">
          <span class="idm-unifie-todo-box-title-number">{{todoData.count}}</span>
          <van-icon name="arrow" />
        </span>
        <van-icon v-else  class="idm-unifie-todo-box-title-more" name="ellipsis" />
      </div>
    </div>
    <template v-if="!pageLoading">
      <div class="idm-unifie-todo-box-sub" v-for="(item, index) in todoData[listKey]" :key="index" @click="handleClickItem(item)">
        <div class="idm-unifie-todo-box-sub-title" :class="{'idm-unifie-todo-box-sub-no-read': true}">
          <!-- <div class="idm-unifie-todo-box-sub-title-icon" v-if="item.isHot != '-1'">
            <svg-icon icon-class="fire" ></svg-icon>
          </div> -->
          <div class="flex-1">
            <div class="idm-unifie-todo-box-sub-content" :class="getExpressData('data', propData.readExpression, item) ?'idm-unifie-todo-box-sub-hasRead' : ''">
              {{IDM.express.replace('@['+propData.dataFiled+']', item, true)}}
            </div>
            <div class="idm-unifie-todo-box-sub-intr">
              <div class="d-flex align-c">
                <svg v-if="item.readStatus == '1'" class="idm-unifie-todo-box-sub-icon" aria-hidden="true" >
                  <use xlink:href="#idm-icon-xuanze"></use>
                </svg>
                <svg v-if="propData.noReadIcon && propData.noReadIcon.length && item.readStatus != '1'" class="idm-unifie-todo-box-sub-icon" aria-hidden="true" >
                  <use :xlink:href="`#${propData.noReadIcon[0]}`"></use>
                </svg>
                <svg-icon iconClass="weidu" v-if="!propData.noReadIcon && item.readStatus != '1'" class="idm-unifie-todo-box-sub-icon"></svg-icon>
                <span>{{item.readStatusText}}</span> </div>
              <div class="d-flex align-c">
                <svg-icon iconClass="person" class="idm-unifie-todo-box-sub-icon"></svg-icon> 
                <span>{{item.sendUserName}}</span> </div>
              <div class="d-flex align-c">
                <svg-icon iconClass="time" class="idm-unifie-todo-box-sub-icon"></svg-icon>
                <span>{{item.time}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-if="pageLoading">
      <van-loading type="circular" vertical>加载中...</van-loading>
    </div>
    <div v-if="!isFirst && ( !todoData[listKey] || todoData[listKey].length === 0)" class="idm-unifie-todo-box-empty">
      <van-empty :description="propData.emptyText || '数据为空'" :image-size="60"/>
    </div>
  </div>
</template>

<script>
import { Icon, Loading, Empty } from 'vant';
import 'vant/lib/icon/style';
import 'vant/lib/loading/style';
import 'vant/lib/empty/style';
const todoData = {
  value: [{
    jumpUrl: '',
    isHot: '-1',
    readStatus: '0',
    readStatusText: '未读',
    sendUserName: '文档处',
    time: '2022-04-21 12:56',
    title: '[发文] 关于扎实做好近期疫情防控有关工作的通知'
  },{
    jumpUrl: '',
    isHot: '-1',
    readStatus: '1',
    readStatusText: '已读',
    sendUserName: '李干杰',
    time: '2022-04-21 09:23',
    title: '[发文] 关于印发《山东省职业卫生技术服务机构乙级资质认可程序》的通知'
  },{
    jumpUrl: '',
    isHot: '-1',
    readStatus: '1',
    readStatusText: '已读',
    sendUserName: '文档处',
    time: '2022-04-21 08:56',
    title: '[发文] 关于印发数字山东2021行动方案的通知'
  }],
  count: 2,
  moreUrl: ''
}
export default {
  name: 'IUnifiedTodo',
  components: {
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    [Empty.name]: Empty,
  },
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{
        htmlTitle:"紧急待办",
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
        showMore: true,
        showTodoNumber: false,
        dataFiled: 'title',
        bgColor: '#fff',
        maxCount: '3', // 最多显示几条
      },
      todoData: {value: []},
      countKey: 'count',
      listKey: 'value',
      pageLoading: false,
      isFirst: true
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
  },
  methods:{
    /**
     * 点击单个事件
     * @param {单个待办} item 
     */
    handleClickItem(item){
      if(this.moduleObject.env=="develop"){
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
      pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
      var clickToDoItemFunction = this.propData.clickToDoItemFunction;
      if (clickToDoItemFunction) {
        clickToDoItemFunction.forEach((item) => {
        console.log(window[item.name])
        window[item.name] &&
            window[item.name].call(this, {
            customParam: item.param,
            _this: this,
            urlData:urlObject,
            pageId,
            });
        });
      }else{
        if(item.jumpUrl) {
          window.open(IDM.url.getWebPath(item.jumpUrl), this.propData.jumpStyle || '_self')
        }
      }
    },
    /**
     * 点击更多事件
     */
    handleClickMore() {
      if(this.moduleObject.env === 'develop') {
        return
      }
      //默认接口地址
      let url = this.todoData.moreUrl
      if(this.propData.moreListLink) {
        url = this.propData.moreListLink
      }
      if(url){
        window.open(IDM.url.getWebPath(url), this.propData.jumpStyle || '_self')
      }
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
      let titleFontStyleObj = {}
      let todoFontStyleObj = {}
      let readFontStyleObj = {}
      let emptyBoxHeightObj = {}
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
                styleObjectTitleIcon["fill"] = element.hex;
                break
            case "titleIconFontSize":
                styleObjectTitleIcon["font-size"] = element + "px";
                styleObjectTitleIcon["width"] = element + "px";
                styleObjectTitleIcon["height"] = element + "px";
                break
            case 'titleFontStyle':
              titleFontStyleObj["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                  titleFontStyleObj["color"] = element.fontColors.hex8;
              }
              titleFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              titleFontStyleObj["font-style"] = element.fontStyle;
              titleFontStyleObj["font-size"] = element.fontSize + element.fontSizeUnit;
              titleFontStyleObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              titleFontStyleObj["text-align"] = element.fontTextAlign;
              titleFontStyleObj["text-decoration"] = element.fontDecoration;
              break
            case 'todoFontStyle':
              todoFontStyleObj["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                  todoFontStyleObj["color"] = element.fontColors.hex8;
              }
              todoFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              todoFontStyleObj["font-style"] = element.fontStyle;
              todoFontStyleObj["font-size"] = element.fontSize + element.fontSizeUnit;
              todoFontStyleObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              todoFontStyleObj["text-align"] = element.fontTextAlign;
              todoFontStyleObj["text-decoration"] = element.fontDecoration;
              break
            case 'readFontStyle':
              readFontStyleObj["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                  readFontStyleObj["color"] = element.fontColors.hex8;
              }
              readFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              readFontStyleObj["font-style"] = element.fontStyle;
              readFontStyleObj["font-size"] = element.fontSize + element.fontSizeUnit;
              readFontStyleObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              readFontStyleObj["text-align"] = element.fontTextAlign;
              readFontStyleObj["text-decoration"] = element.fontDecoration;
              break
            case 'emptyBoxHeight':
              emptyBoxHeightObj['height'] = element.inputVal + element.selectVal
          }

        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-title-icon", styleObjectTitleIcon);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-title-font", titleFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-sub-content", todoFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-sub-hasRead", readFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-empty", emptyBoxHeightObj);
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
      if(this.moduleObject.env === 'develop') {
        this.todoData = _.cloneDeep(todoData)
        return
      }
      this.pageLoading = true
      let requestUrl = this.propData.customInterfaceUrl
      if(this.propData.dataType === 'custom'){
        requestUrl =  this.propData.customGetTodoDataInterfaceUrl
        this.countKey = 'total'
        this.listKey = 'list'
      }
      
      requestUrl &&
      window.IDM.http
        .post(requestUrl, {
          id: this.propData.dataSource && this.propData.dataSource.value,
          start: 0,
          type: 'todo',
          limit: this.propData.limit
        },{headers: {"Content-Type": "application/json;charset=UTF-8"}})
        .then((res) => {
          if(res.status == 200 && res.data.code == 200){
            this.todoData = res.data.data
          }else {
            IDM.message.error(res.data.message)
          }
        })
        .catch((error) => {})
        .finally(()=>{
          this.isFirst = false
          this.pageLoading = false
        })
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
     * 组件通信：接收消息的方法
     * @param {
     *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
     *  message:{发送的时候传输的消息对象数据}
     *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
     *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
     * } object 
     */
    receiveBroadcastMessage(messageObject){
      // 配置了刷新KEY，消息类型是websocket，收到的消息对象有message并不为空
      if(this.propData.messageRefreshKey && messageObject.type === 'websocket' && messageObject.message){
        const messageData = typeof messageObject.message === 'string' && JSON.parse(messageObject.message) || messageObject.message
        const arr = this.propData.messageRefreshKey.split(',')
        if(messageData.badgeType && arr.includes(messageData.badgeType)){
          this.initData()
        }
      }
      console.log("组件收到消息",messageObject)
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
        this.$set(this.propData,"todoData",this.getExpressData(this.propData.dataName,this.propData.dataFiled,object.data));
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
.just-c{
  justify-content: center;
}
.flex-1{
  flex: 1;
}
.in-box {
  >>> .van-empty{
    padding: 0;
  }
}
</style>

<style lang="scss">

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
    & &-more{
      font-size: 22px;
    }
    &-number{
      padding: 0 5px 0 0;
    }
  }
  &-sub{
    border-bottom: .6px solid #eee;
    &-title{
      display: flex;
      margin: 8px 0 0 0;
      &-icon{
        font-size: 15px;
        margin: 0 6px 0 0;
      }
    }
    &-content{
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
    &-hasRead{
      color: #999;
    }
    &-intr{
      padding: 8px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      margin: 0 3px 0 0;
    }
    &-empty{
      overflow: hidden;
      height: 90px;
    }
  }
}
</style>