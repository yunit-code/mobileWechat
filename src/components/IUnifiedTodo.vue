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
   :title="propData.title"
   class="idm-unifie-todo-box in-box">
    <div class="idm-unifie-todo-box-title d-flex align-c just-b" v-if="propData.showTitle">
      <div class="d-flex align-c">
        <div v-if="propData.showIcon && propData.titleIconPosition == 'left'" class="idm-unifie-todo-box-left-icon">
          <svg v-if="propData.titleIconClass && propData.titleIconClass.length" class="idm-unifie-todo-box-title-icon" aria-hidden="true" >
            <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
          </svg>
          <svg-icon v-else icon-class="threeLine" className="idm-unifie-todo-box-title-icon"></svg-icon>
        </div>
        <span class="idm-unifie-todo-box-title-font">{{propData.title}}</span>
        <div v-if="propData.showIcon && propData.titleIconPosition == 'right'" class="idm-unifie-todo-box-right-icon">
          <svg v-if="propData.titleIconClass && propData.titleIconClass.length" class="idm-unifie-todo-box-title-icon" aria-hidden="true" >
            <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
          </svg>
          <svg-icon v-else icon-class="threeLine" className="idm-unifie-todo-box-title-icon"></svg-icon>
        </div>
      </div>
      <div v-if="propData.showMore" class="d-flex align-c"  @click="handleClickMore">
        <span v-if="propData.showTodoNumber">
          <span class="idm-unifie-todo-box-title-number">{{todoData[countKey] || 0}}</span>
          <van-icon name="arrow" />
        </span>
        <van-icon v-else  class="idm-unifie-todo-box-title-more" name="ellipsis" />
      </div>
    </div>
    <div v-if="!pageLoading" class="idm-unifie-todo-box-overflow">
      <div class="idm-unifie-todo-box-sub" v-for="(item, index) in todoData[listKey]" :key="index" @click="handleClickItem(item)">
        <div class="idm-unifie-todo-box-sub-title" :class="{'idm-unifie-todo-box-sub-no-read': true}">
          <div class="flex-1">
            <div class="idm-unifie-todo-box-sub-content" :class="getExpressData('data', propData.readExpression, item) ?'idm-unifie-todo-box-sub-hasRead' : ''">
              <span v-if="item.moduleName" class="ml-7">【{{item.moduleName}}】</span>{{IDM.express.replace('@['+propData.dataFiled+']', item, true)}}
            </div>
            <div class="idm-unifie-todo-box-sub-intr">
              <div class="d-flex align-c">
                <svg v-if="propData.readIcon && propData.readIcon.length > 0 && item.readStatus == '1'" class="idm-unifie-todo-box-sub-icon-has-read" aria-hidden="true" >
                  <use :xlink:href="`#${propData.readIcon[0]}`"></use>
                </svg>
                <svg v-if="propData.noReadIcon && propData.noReadIcon.length > 0 && item.readStatus != '1'" class="idm-unifie-todo-box-sub-icon-no-read" aria-hidden="true" >
                  <use :xlink:href="`#${propData.noReadIcon[0]}`"></use>
                </svg>
                <span :class="getExpressData('data', propData.readExpression, item) ?'idm-unifie-todo-box-sub-hasRead-font' : ''">{{item.readStatusText}}</span> 
              </div>
              <div class="d-flex align-c">
                <svg class="idm-unifie-todo-box-sub-icon" aria-hidden="true" :class="getExpressData('data', propData.readExpression, item) ?'idm-unifie-todo-box-sub-hasRead-font' : ''">
                  <use xlink:href="#idm-icon-ren"></use>
                </svg>
                <!-- <svg-icon iconClass="person" class="idm-unifie-todo-box-sub-icon" :class="getExpressData('data', propData.readExpression, item) ?'idm-unifie-todo-box-sub-hasRead-font' : ''"></svg-icon>  -->
                <span :class="getExpressData('data', propData.readExpression, item) ?'idm-unifie-todo-box-sub-hasRead-font' : ''">{{item.sendUserName}}</span> </div>
              <div class="d-flex align-c">
                <svg class="idm-unifie-todo-box-sub-icon" aria-hidden="true" :class="getExpressData('data', propData.readExpression, item) ?'idm-unifie-todo-box-sub-hasRead-font' : ''">
                  <use xlink:href="#idm-icon-shijian"></use>
                </svg>
                <!-- <svg-icon iconClass="time" class="idm-unifie-todo-box-sub-icon" :class="getExpressData('data', propData.readExpression, item) ?'idm-unifie-todo-box-sub-hasRead-font' : ''"></svg-icon> -->
                <span :class="getExpressData('data', propData.readExpression, item) ?'idm-unifie-todo-box-sub-hasRead-font' : ''">{{item.time}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isFirst && ( !todoData[listKey] || todoData[listKey].length === 0)" class="idm-unifie-todo-box-empty">
        <van-empty :description="propData.emptyText || '数据为空'" >
          <template  #image>
              <van-image width="60" height="60" :src="IDM.url.getModuleAssetsWebPath(require('../assets/empty-default.png'), moduleObject)" />
          </template>
        </van-empty>
      </div>
    </div>
    <van-loading v-if="pageLoading" type="circular" vertical>加载中...</van-loading>
    <div class="idm-unifie-todo-box-mask" v-if="moduleObject.env === 'develop' && ((propData.dataType === 'dataSource' && !propData.dataSource) || (propData.dataType === 'custom' && !propData.customGetTodoDataInterfaceUrl))">
      <span>！未绑定数据源</span>
    </div>
  </div>
</template>

<script>
import { Icon, Loading, Empty, Image as VanImage } from 'vant';
import { getDatasInterfaceUrl } from '@/api/config'
import { getAdaptiveSize } from '@/utils/adaptationScreen'
import 'vant/lib/icon/style';
import 'vant/lib/loading/style';
import 'vant/lib/empty/style';
import 'vant/lib/image/style';
const todoData = {
  value: [{
    jumpUrl: '',
    isHot: '-1',
    readStatus: '0',
    moduleName: '发文',
    readStatusText: '未读',
    sendUserName: '文档处',
    time: '2022-04-21 12:56',
    title: '关于扎实做好近期疫情防控有关工作的通知'
  },{
    jumpUrl: '',
    isHot: '-1',
    moduleName: '发文',
    readStatus: '1',
    readStatusText: '已读',
    sendUserName: '张三',
    time: '2022-04-21 09:23',
    title: '关于印发《山东省职业卫生技术服务机构乙级资质认可程序》的通知'
  },{
    jumpUrl: '',
    isHot: '-1',
    readStatus: '1',
    moduleName: '发文',
    readStatusText: '已读',
    sendUserName: '文档处',
    time: '2022-04-21 08:56',
    title: '关于印发数字山东2021行动方案的通知'
  }],
  count: 1,
  moreUrl: ''
}
export default {
  name: 'IUnifiedTodo',
  components: {
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    [Empty.name]: Empty,
    [VanImage.name]: VanImage
  },
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{
        title:"待办事项",
        width: '100%',
        height: 'auto',
        borderRadius: '5px',
        titleFontStyle: {
          fontColors: {
            colors: {
              hex: '#333'
            }
          },
          fontSize: 16,
          fontSizeUnit: "px",
          fontWeight: "600"
        },
        titleIconPosition: 'right',
        showIcon: true,
        showTitle: true,
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
      isFirst: true,
      pageWidth: null
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
    this.convertThemeListAttrToStyleObject()
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
          const url = IDM.url.getWebPath(item.jumpUrl)
          if(this.propData.jumpStyle && this.propData.jumpStyle === "_auto" ){
            if(wx &&  wx.invoke) {
              wx.invoke('openUrl', {
                  "type": 0, //0或不填表示使用内部浏览器新窗口打开，1表示用系统浏览器打开
                  "url": url, //url地址
              }, function(res){
                  if (res.err_msg != "openUrl:ok") {
                      //错误处理
                  }
              });
            }else{
              window.open(url, '_blank')
            }
          }else{
            window.open(url, this.propData.jumpStyle || '_blank')
          }
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
        url = IDM.url.getWebPath(url)
        if(this.propData.jumpStyle && this.propData.jumpStyle === "_auto" ){
          if(wx &&  wx.invoke) {
            wx.invoke('openUrl', {
                "type": 0, //0或不填表示使用内部浏览器新窗口打开，1表示用系统浏览器打开
                "url": url, //url地址
            }, function(res){
                if (res.err_msg != "openUrl:ok") {
                    //错误处理
                }
            });
          }else{
            window.open(url, '_blank')
          }
        }else{
          window.open(url, this.propData.jumpStyle || '_blank')
        }
      }
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject()
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
      let readIconObj = {}
      let noReadIconObj = {}
      let subBoxStyleObj = {}
      let subBoxReadObj = {}
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
            case "subWidth":
              subBoxStyleObj['width']=element;
              break;
            case "subHeight":
              subBoxStyleObj['height']=element;
              break;
            case "subBgColor":
              if(element&&element.hex8){
                subBoxStyleObj["background-color"]=element.hex8;
              }
              break;
            case "subBox":
              if(element.marginTopVal){
                subBoxStyleObj["margin-top"]=`${element.marginTopVal}`;
              }
              if(element.marginRightVal){
                subBoxStyleObj["margin-right"]=`${element.marginRightVal}`;
              }
              if(element.marginBottomVal){
                subBoxStyleObj["margin-bottom"]=`${element.marginBottomVal}`;
              }
              if(element.marginLeftVal){
                subBoxStyleObj["margin-left"]=`${element.marginLeftVal}`;
              }
              if(element.paddingTopVal){
                subBoxStyleObj["padding-top"]=`${element.paddingTopVal}`;
              }
              if(element.paddingRightVal){
                subBoxStyleObj["padding-right"]=`${element.paddingRightVal}`;
              }
              if(element.paddingBottomVal){
                subBoxStyleObj["padding-bottom"]=`${element.paddingBottomVal}`;
              }
              if(element.paddingLeftVal){
                subBoxStyleObj["padding-left"]=`${element.paddingLeftVal}`;
              }
              break;
            case "subBorder":
              if(element.border.top.width>0){
                subBoxStyleObj["border-top-width"]=element.border.top.width+element.border.top.widthUnit;
                subBoxStyleObj["border-top-style"]=element.border.top.style;
                if(element.border.top.colors.hex8){
                  subBoxStyleObj["border-top-color"]=element.border.top.colors.hex8;
                }
              }
              if(element.border.right.width>0){
                subBoxStyleObj["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                subBoxStyleObj["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  subBoxStyleObj["border-right-color"]=element.border.right.colors.hex8;
                }
              }
              if(element.border.bottom.width>0){
                subBoxStyleObj["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                subBoxStyleObj["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  subBoxStyleObj["border-bottom-color"]=element.border.bottom.colors.hex8;
                }
              }
              if(element.border.left.width>0){
                subBoxStyleObj["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                subBoxStyleObj["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  subBoxStyleObj["border-left-color"]=element.border.left.colors.hex8;
                }
              }
              subBoxStyleObj["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              subBoxStyleObj["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              subBoxStyleObj["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              subBoxStyleObj["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
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
                styleObjectTitleIcon["fill"] = element.hex8 + ' !important';
                break
            case "titleIconFontSize":
                styleObjectTitleIcon["font-size"] = getAdaptiveSize.call(this, element) + "px";
                styleObjectTitleIcon["width"] = getAdaptiveSize.call(this, element) + "px";
                styleObjectTitleIcon["height"] = getAdaptiveSize.call(this, element) + "px";
                break
            case 'titleFontStyle':
              titleFontStyleObj["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                  titleFontStyleObj["color"] = element.fontColors.hex8;
              }
              titleFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              titleFontStyleObj["font-style"] = element.fontStyle;
              titleFontStyleObj["font-size"] = getAdaptiveSize.call(this, element.fontSize) + element.fontSizeUnit;
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
              todoFontStyleObj["font-size"] = getAdaptiveSize.call(this, element.fontSize) + element.fontSizeUnit;
              todoFontStyleObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              todoFontStyleObj["text-align"] = element.fontTextAlign;
              todoFontStyleObj["text-decoration"] = element.fontDecoration;
              break
            case 'readFontStyle':
              readFontStyleObj["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                  readFontStyleObj["color"] = element.fontColors.hex8;
                  subBoxReadObj["color"] = element.fontColors.hex8;
                  subBoxReadObj["fill"] = element.fontColors.hex8;
              }
              readFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              subBoxReadObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              readFontStyleObj["font-style"] = element.fontStyle;
              readFontStyleObj["font-size"] = element.fontSize + element.fontSizeUnit;
              readFontStyleObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              readFontStyleObj["text-align"] = element.fontTextAlign;
              readFontStyleObj["text-decoration"] = element.fontDecoration;
              break
            case 'emptyBoxHeight':
              emptyBoxHeightObj['height'] = element.inputVal + element.selectVal
              break;
            case "readIconColor":
                readIconObj["fill"] = element.hex8;
                break
            case "readIconSize":
                readIconObj["font-size"] = getAdaptiveSize.call(this, element) + "px";
                readIconObj["width"] = getAdaptiveSize.call(this, element) + "px";
                readIconObj["height"] = getAdaptiveSize.call(this, element) + "px";
                break
            case "noReadIconColor":
                noReadIconObj["fill"] = element.hex8;
                break
            case "noReadIconSize":
                noReadIconObj["font-size"] = getAdaptiveSize.call(this, element) + "px";
                noReadIconObj["width"] = getAdaptiveSize.call(this, element) + "px";
                noReadIconObj["height"] = getAdaptiveSize.call(this, element) + "px";
                break
          }

        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
      if(this.propData.showTitle) {
        window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-overflow", subBoxStyleObj);
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-title-icon", styleObjectTitleIcon);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-title-font", titleFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-sub-content", todoFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-sub-hasRead", readFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-sub-hasRead-font", subBoxReadObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-empty", emptyBoxHeightObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-sub-icon-has-read", readIconObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-sub-icon-no-read", noReadIconObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-sub-intr", {'font-size': getAdaptiveSize.call(this, 14) + 'px'});
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-unifie-todo-box-sub-icon", {'width': getAdaptiveSize.call(this, 18) + 'px', 'height': getAdaptiveSize.call(this, 18) + 'px'});
      this.initData();
    },
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject() {
      var themeList = this.propData.themeList;
      if (!themeList) {
        return;
      }
      const themeNamePrefix =
        IDM.setting &&
        IDM.setting.applications &&
        IDM.setting.applications.themeNamePrefix
          ? IDM.setting.applications.themeNamePrefix
          : "idm-theme-";
      for (var i = 0; i < themeList.length; i++) {
        var item = themeList[i];
        //item.key：为主题样式的key
        //item.mainColor：主要颜色值
        //item.minorColor：次要颜色值
        // if(item.key!=IDM.theme.getCurrentThemeInfo()){
        //     //此处比对是不渲染输出不用的样式，如果页面会刷新就可以把此处放开
        //     continue;
        // }
        let iconColorObj = {
          fill: item.mainColor ? item.mainColor.hex8 : "",
        };
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .idm-unifie-todo-box-title-icon",
          iconColorObj
        );
      }
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
      this.convertThemeListAttrToStyleObject()
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
      let requestUrl = getDatasInterfaceUrl
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
      switch(messageObject.type) {
        case 'websocket':
          if(this.propData.messageRefreshKey && messageObject.message){
            const messageData = typeof messageObject.message === 'string' && JSON.parse(messageObject.message) || messageObject.message
            const arr = Array.isArray(this.propData.messageRefreshKey) ? this.propData.messageRefreshKey : [this.propData.messageRefreshKey]
            if(messageData.badgeType && arr.includes(messageData.badgeType)){
              this.initData()
            }
          }
          break;
        case 'linkageReload':
          this.initData()
          break;
        case 'pageResize':
          this.pageWidth = messageObject.message.width
          this.convertAttrToStyleObject()
          break;
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
  >>> .van-empty__image{
    width: 60px;
    height: 60px;
  }
}
</style>

<style lang="scss">

.idm-unifie-todo-box{
  background-color: #fff;
  overflow: hidden;
  position: relative;
  &-left-icon{
    display: flex;
    align-items: center;
    margin: 0 8px 0 0;
  }
  &-right-icon{
    display: flex;
    align-items: center;
    margin: 0 0 0 8px;
  }
  &-title{
    font: inherit;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-icon{
      width: 18px;
      height: 18px;
    }
    & &-more{
      font-size: 22px;
    }
    &-number{
      padding: 0 5px 0 0;
    }
    &-font {
      font-size: 16px;
      color: #333;
    }
  }
  &-overflow{
    overflow: hidden;
    overflow-y: auto;
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
      .ml-7{
        margin-left: -7px;
      }
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
      width: 18px;
      height: 18px;
      fill: currentColor;
      vertical-align: -0.15em;
      outline: none;
      margin: 0 3px 0 0;
    }
    &-icon-no-read{
      font-size: 14px;
      width: 14px;
      fill: #f10215;
      vertical-align: -0.15em;
      outline: none;
      margin: 0 3px 0 0;
    }
    &-icon-has-read{
      font-size: 14px;
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
  &-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: rgba(0,0,0,.3);
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      padding: 6px 20px;
      color: #e6a23c;
      background: #fdf6ec;
      border:1px solid #f5dab1;
      border-radius: 4px;
    }
  }
}
</style>