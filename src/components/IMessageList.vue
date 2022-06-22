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
   class="idm-message-list-parent-box in-box"
   >
    <template v-if="propData.compStyle !== 'styleFour'">
      <div class="idm-message-list-box-title d-flex align-c just-b">
        <div class="d-flex align-c">
          <div class="idm-message-list-box-title-left-icon" v-if="propData.showIcon && propData.titleIconPosition == 'left'">
            <svg v-if="propData.titleIconClass && propData.titleIconClass.length" class="idm-message-list-box-title-icon" aria-hidden="true" >
              <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
            </svg>
            <svg-icon v-else icon-class="threeLine" className="idm-message-list-box-title-icon"></svg-icon>
          </div>
          <span class="idm-message-list-box-title-font">{{propData.title}}</span>
          <div class="idm-message-list-box-title-right-icon" v-if="propData.showIcon && propData.titleIconPosition == 'right'">
            <svg v-if="propData.titleIconClass && propData.titleIconClass.length" class="idm-message-list-box-title-icon" aria-hidden="true" >
              <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
            </svg>
            <svg-icon v-else icon-class="threeLine" className="idm-message-list-box-title-icon"></svg-icon>
          </div>
        </div>
        <div class="idm-message-list-box-title-right" v-if="propData.showMore" @click="handleClickMore">
          <span v-if="propData.showTotalNumber">{{Number(messageData.total) > 99 ? '99+' : messageData.total || 0}}</span> <span v-else>更多</span> <van-icon name="arrow" />
        </div>
      </div>
    </template>
    <div class="idm-message-list-box" :style="{width: propData.width, height: propData.height}">
      <div v-if="propData.compStyle === 'styleFour' && propData.showTab" class="idm-message-list-box-top d-flex just-b align-c">
        <div class="idm-message-list-box-top-left flex-1 idm-message-list-box-title-font-fourStyle">
          <span v-for="(item, index) in propData.messageTitleList" :key="index" :class="{active: defaultIndex === index}" @click="handleTitleClick(item,index)">{{item.tabTitle}}</span>
        </div>
        <van-icon v-if="propData.showMore" class="idm-message-list-box-top-more" name="ellipsis" @click="handleClickMore" />
      </div>
      <div v-if="propData.compStyle !== 'styleFour' && propData.showTab" class="idm-message-list-box-top2 d-flex just-b align-c">
        <div class="idm-message-list-box-top2-left d-flex flex-1">
          <div v-for="(item, index) in propData.messageTitleList" :key="index" :class="{active: defaultIndex === index}" @click="handleTitleClick(item,index)">{{item.tabTitle}}</div>
        </div>
      </div>
      <div class="idm-message-list-box-container">
        <ul class="idm-message-list-box-list" v-if="!pageLoading && (propData.compStyle === 'styleFour' || propData.compStyle === 'styleOne')">
          <li class="d-flex align-c" v-for="(item, index) in messageData.list" :key="index" @click="handleClickItem(item)">
            <!-- <span class="idm-message-list-box-list-style-square" v-if="propData.compStyle === 'styleFour'"></span>
            <span class="idm-message-list-box-list-style-square1" v-else></span> -->
            <svg-icon iconClass="square" class="idm-message-list-box-list-style-square"></svg-icon>
            <span class="idm-message-list-box-list-content">{{IDM.express.replace('@['+propData.dataFiled+']', item, true)}}</span>
            <span class="idm-message-list-box-list-time" v-if="propData.compStyle !== 'styleOne'">{{item.time}}</span>
            </li>
        </ul>
        <ul class="idm-message-list-box-list2" v-if="!pageLoading && (propData.compStyle === 'styleTwo' || propData.compStyle === 'styleThree')">
          <li class="d-flex" v-for="(item, index) in messageData.list" :key="index" @click="handleClickItem(item)">
            <img :src="getImageUrl(item.image)" :class="propData.compStyle === 'styleTwo' ? 'idm-message-list-box-list2-left-img' : 'idm-message-list-box-list2-left-img2'" alt="">
            <div style="overflow:hidden; flex: 1">
              <div class="idm-message-list-box-list2-title" :class="propData.compStyle === 'styleTwo' ? 'idm-message-list-box-list2-title' : 'idm-message-list-box-list2-title2'">
                {{IDM.express.replace('@['+propData.dataFiled+']', item, true)}}
              </div>
              <div class="idm-message-list-box-list2-title-bottom">
                {{item.time}}
              </div>
            </div>
          </li>
        </ul>
        <div v-if="!isFirst && ( !messageData.list || messageData.list.length === 0)" class="idm-message-list-box-empty">
          <van-empty :description="propData.emptyText || '数据为空'" >
            <template  #image>
              <van-image width="60" height="60" :src="IDM.url.getModuleAssetsWebPath(require('../assets/empty-default.png'), moduleObject)" />
            </template>
          </van-empty>
        </div>
        <van-loading v-if="pageLoading" type="circular" vertical>加载中...</van-loading>
      </div>
      <div class="idm-message-list-parent-box-mask" v-if="moduleObject.env === 'develop' && !propData.dataSource">
        <span>！未绑定数据源</span>
      </div>
    </div>
  </div>
</template>

<script>

import { Icon, Loading, Empty, Image as VanImage } from 'vant';
import 'vant/lib/icon/style';
import 'vant/lib/loading/style';
import 'vant/lib/empty/style';
import 'vant/lib/image/style';
import { getAdaptiveSize } from '@/utils/adaptationScreen'

import { getDatasInterfaceUrl } from '@/api/config'
function getDefault () {
  const _this = this
return {
    list:[{
      title: "营商环境优，引得“近邻”来",
      image: 'data:image/jpeg;base64,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',
      jumpUrl: "",
      time: "2022-04-15",
      author: "作者"
    },
    {
      title: "山东“职教高地”建设提质培优",
      image: 'data:image/jpeg;base64,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',
      jumpUrl: "",
      time: "2022-04-14",
      author: "作者"
    },
    {
      title: "山东省人民政府办公厅关于印发",
      image: 'data:image/jpeg;base64,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',
      jumpUrl: "",
      time: "2022-04-13",
      author: "作者"
    }],
    moreUrl: "",
    total:"99"
  }
}

export default {
  name: 'IMessageList',
  components: {
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    [Empty.name]: Empty,
    [VanImage.name]: VanImage,
  },
  data(){
    return {
      moduleObject:{},
      defaultIndex: 0,
      propData:this.$root.propData.compositeAttr||{
        title:"信息列表",
        width: '100%',
        height: 'auto',
        bgColor: {hex: ''},
        titleFontStyle: {
          fontColors: {
            colors: {
              hex: '#333'
            }
          }
        },
        showTab: true,
        dataFiled: 'title',
        compStyle: 'styleFour',
        limit: 3,
        messageTitleList: [{tabTitle: '今日信息', tabKey: 'todayInfos', isActive: false}]
      },
      messageData: {list: []},
      pageLoading: false,
      isFirst: true,
      pageWidth: null,
      onceLoadData: []
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
    this.convertThemeListAttrToStyleObject()
  },
  methods:{
    getImageUrl(url) {
      if(url && url.indexOf('base64') > -1){
        return url
      }
      if(url && url.indexOf('/DreamWeb') == -1){
        return IDM.url.getWebPath(url)
      }
      return url
    },
    /**
     * 单个信息点击事件
     * @param {单个信息} item
     */
    handleClickItem(item){
      if(this.moduleObject.env === 'develop') {
        return
      }
      var clickMessageItemFunction = this.propData.clickMessageItemFunction;
      if (clickMessageItemFunction) {
        clickMessageItemFunction.forEach((item) => {
        console.log(window[item.name])
        window[item.name] &&
            window[item.name].call(this, {
            customParam: item.param,
            _this: this,
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
     * 点击更多事件d
     */
    handleClickMore(){
      if(this.moduleObject.env === 'develop') {
        return
      }
      //默认接口地址
      let url =  this.messageData.moreUrl
      if(this.propData.messageTitleList[this.defaultIndex].moreListLink) {
        url = this.propData.messageTitleList[this.defaultIndex].moreListLink
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
    // 顶部tabs点击
    handleTitleClick(item, index) {
      if(this.propData.dataLoadType === 'onceLoad') {
        this.defaultIndex = index
        if(this.onceLoadData.length > 0){
          this.messageData = this.onceLoadData[index]
        }else{
          this.messageData = { list: []}
        }
        return
      }
      this.initData(item, index)
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
      let tabFontStyleObj = {}
      let titleFontStyleActiveObj = {}
      let subBoxStyleObj = {}
      let messageItemFontStyleObj = {}
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
                styleObject["background-color"]=IDM.hex8ToRgbaString(element.hex8);
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
                  styleObject["border-top-color"]=IDM.hex8ToRgbaString(element.border.top.colors.hex8);
                }
              }
              if(element.border.right.width>0){
                styleObject["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                styleObject["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  styleObject["border-right-color"]=IDM.hex8ToRgbaString(element.border.right.colors.hex8);
                }
              }
              if(element.border.bottom.width>0){
                styleObject["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                styleObject["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  styleObject["border-bottom-color"]=IDM.hex8ToRgbaString(element.border.bottom.colors.hex8);
                }
              }
              if(element.border.left.width>0){
                styleObject["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                styleObject["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  styleObject["border-left-color"]=IDM.hex8ToRgbaString(element.border.left.colors.hex8);
                }
              }
              styleObject["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
            case "subWidth":
              subBoxStyleObj['width']=element;
              break;
            case "subHeight":
              subBoxStyleObj['height']=element;
              break;
            case "subBgColor":
              if(element&&element.hex8){
                subBoxStyleObj["background-color"]=IDM.hex8ToRgbaString(element.hex8);
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
                  subBoxStyleObj["border-top-color"]=IDM.hex8ToRgbaString(element.border.top.colors.hex8);
                }
              }
              if(element.border.right.width>0){
                subBoxStyleObj["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                subBoxStyleObj["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  subBoxStyleObj["border-right-color"]=IDM.hex8ToRgbaString(element.border.right.colors.hex8);
                }
              }
              if(element.border.bottom.width>0){
                subBoxStyleObj["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                subBoxStyleObj["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  subBoxStyleObj["border-bottom-color"]=IDM.hex8ToRgbaString(element.border.bottom.colors.hex8);
                }
              }
              if(element.border.left.width>0){
                subBoxStyleObj["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                subBoxStyleObj["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  subBoxStyleObj["border-left-color"]=IDM.hex8ToRgbaString(element.border.left.colors.hex8);
                }
              }
              subBoxStyleObj["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              subBoxStyleObj["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              subBoxStyleObj["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              subBoxStyleObj["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
            case "titleIconFontColor":
                styleObjectTitleIcon["fill"] = IDM.hex8ToRgbaString(element.hex8) + ' !important';
                break
            case "titleIconFontSize":
                styleObjectTitleIcon["font-size"] = getAdaptiveSize.call(this,element) + "px";
                styleObjectTitleIcon["width"] = getAdaptiveSize.call(this,element) + "px";
                styleObjectTitleIcon["height"] = getAdaptiveSize.call(this,element) + "px";
                break
            case 'titleFontStyle':
                titleFontStyleObj["font-family"] = element.fontFamily;
                if (element.fontColors.hex8) {
                    titleFontStyleObj["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                }
                titleFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                titleFontStyleObj["font-style"] = element.fontStyle;
                titleFontStyleObj["font-size"] =  getAdaptiveSize.call(this, element.fontSize) + element.fontSizeUnit;
                titleFontStyleObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                titleFontStyleObj["text-align"] = element.fontTextAlign;
                titleFontStyleObj["text-decoration"] = element.fontDecoration;
                break;
            case 'tabFontStyle':
                tabFontStyleObj["font-family"] = element.fontFamily;
                if (element.fontColors.hex8) {
                    tabFontStyleObj["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                }
                tabFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                tabFontStyleObj["font-style"] = element.fontStyle;
                tabFontStyleObj["font-size"] =  getAdaptiveSize.call(this, element.fontSize) + element.fontSizeUnit;
                tabFontStyleObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                tabFontStyleObj["text-align"] = element.fontTextAlign;
                tabFontStyleObj["text-decoration"] = element.fontDecoration;
                break;
            case 'titleFontStyleActive':
                titleFontStyleActiveObj["font-family"] = element.fontFamily;
                if (element.fontColors.hex8) {
                    titleFontStyleActiveObj["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8) + ' !important';
                }
                titleFontStyleActiveObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                titleFontStyleActiveObj["font-style"] = element.fontStyle;
                titleFontStyleActiveObj["font-size"] = getAdaptiveSize.call(this, element.fontSize) + element.fontSizeUnit;
                titleFontStyleActiveObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                titleFontStyleActiveObj["text-align"] = element.fontTextAlign;
                titleFontStyleActiveObj["text-decoration"] = element.fontDecoration;
                break;
            case 'messageItemFontStyle':
                messageItemFontStyleObj["font-family"] = element.fontFamily;
                if (element.fontColors.hex8) {
                    messageItemFontStyleObj["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                }
                messageItemFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                messageItemFontStyleObj["font-style"] = element.fontStyle;
                messageItemFontStyleObj["font-size"] = getAdaptiveSize.call(this, element.fontSize) + element.fontSizeUnit;
                messageItemFontStyleObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                messageItemFontStyleObj["text-align"] = element.fontTextAlign;
                messageItemFontStyleObj["text-decoration"] = element.fontDecoration;
                break;
            }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
      if(this.propData.showTab){
        window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-container", subBoxStyleObj);
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-title .idm-message-list-box-title-icon", styleObjectTitleIcon);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-top-left span", tabFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-top2-left div", tabFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-title-font", titleFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-top-left span.active", titleFontStyleActiveObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-top2-left div.active", titleFontStyleActiveObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-list-content", messageItemFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-list2-title", messageItemFontStyleObj);

      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-list2-left-img", {
        'width': getAdaptiveSize.call(this, 80) + 'px',
        'height': getAdaptiveSize.call(this, 70) + 'px'
      });
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-list2-left-img2", {
        'width': getAdaptiveSize.call(this, 60) + 'px',
        'height': getAdaptiveSize.call(this, 60) + 'px'
      });
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-list-style-square", {
        'font-size': getAdaptiveSize.call(this, 10) + 'px'
      });
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-list-time", {
        'font-size': getAdaptiveSize.call(this, 14) + 'px',
      });
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-list2-title-bottom", {
        'font-size': getAdaptiveSize.call(this, 14) + 'px',
      });
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-top-left > span", {
        'padding-left': getAdaptiveSize.call(this, 15, 4.5) + 'px',
        'padding-right': getAdaptiveSize.call(this, 15, 4.5) + 'px',
      });
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-top2-left > div", {
        'margin-left': getAdaptiveSize.call(this, 4, 4.5) + 'px',
        'margin-right': getAdaptiveSize.call(this, 4, 4.5) + 'px',
      });
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-message-list-box-title-right", {
        'font-size': getAdaptiveSize.call(this, 14) + 'px'
      });
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
        let fontActiveColorObj = {
          color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
        };
        let iconColorObj = {
          fill: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
        };
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .idm-message-list-box-top-left .active",
          fontActiveColorObj
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .idm-message-list-box-top2-left .active",
          fontActiveColorObj
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .idm-message-list-box-title .idm-message-list-box-title-icon",
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
    },
    /**
     * 加载动态数据
     */
    initData(item = {}, index = -1){
      // 获取传入titleList默认选中
      let activeIndex = this.propData.messageTitleList && this.propData.messageTitleList.findIndex(el => el.isActive)
      //如果没有设置，初始化为第一个
      if(activeIndex === -1){
        activeIndex = 0
      }
      // 标题点击设置选中
      if(index === -1) this.defaultIndex = activeIndex
      else this.defaultIndex = index //配置时或初始化时设置选中
      if(this.moduleObject.env === 'develop') {
        let messageData = getDefault.call(this)
        this.messageData = _.cloneDeep(messageData)
        return
      }
      if(this.propData.dataLoadType === 'onceLoad'){
          window.IDM.http.post(getDatasInterfaceUrl, {
            id: this.propData.dataSource && this.propData.dataSource.value,
            limit: this.propData.limit,
            start: 0,
          }, {headers: { "Content-Type": "application/json;charset=UTF-8" }})
          .then((res) => {
            if(res.status == 200 && res.data.code == 200){
              this.activeIndex = 0
              this.propData.messageTitleList = []
              this.onceLoadData = []
              res.data.data.forEach(el => {
                const item = Object.values(el)[0]
                this.propData.messageTitleList.push({tabTitle: item.tabName})
                this.onceLoadData.push(item)
              })
              this.messageData = this.onceLoadData[this.defaultIndex]
              // this.messageData = this.onceLoadData[this.propData.messageTitleList[this.defaultIndex].tabKey]
            }else {
              IDM.message.error(res.data.message)
            }
          }).finally(()=>{
            this.isFirst = false
          })
        return
      }
      this.pageLoading = true
      // 获取数据源
      window.IDM.http.post(getDatasInterfaceUrl, {
        id: this.propData.dataSource && this.propData.dataSource.value,
        tabKey: item.tabKey || this.propData.messageTitleList[this.defaultIndex] && this.propData.messageTitleList[this.defaultIndex].tabKey,
        limit: this.propData.limit,
        type: '',
        start: 0,
      }, {headers: { "Content-Type": "application/json;charset=UTF-8" }})
      .then((res) => {
        if(res.status == 200 && res.data.code == 200){
          this.messageData = res.data.data
        }else {
          IDM.message.error(res.data.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(()=>{
          this.isFirst = false
          this.pageLoading = false
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
      // // 配置了刷新KEY，消息类型是websocket，收到的消息对象有message并不为空
      // if(this.propData.messageRefreshKey && messageObject.type === 'websocket' && messageObject.message){
      //   const messageData = typeof messageObject.message === 'string' && JSON.parse(messageObject.message) || messageObject.message
      //   const arr = this.propData.messageRefreshKey.split(',')
      //   if(messageData.badgeType && arr.includes(messageData.badgeType)){
      //     this.initData(this.propData.messageTitleList[this.defaultIndex], this.defaultIndex)
      //   }
      // }
      switch(messageObject.type) {
        case 'linkageReload':
          this.initData(this.propData.messageTitleList[this.defaultIndex], this.defaultIndex)
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
.idm-message-list-parent-box{
  overflow: hidden;
  position: relative;
  .idm-message-list-box{
    overflow: hidden;
    &-title{
      padding: 0 0 10px 0;
      color: #333;
      font-weight: 600;
      &-left-icon{
        display: flex;
        align-items: center;
        margin: 0 8px 0 0;
      }
      &-right-icon{
        display: flex;
        align-items: center;
      }
      &-icon{
        font-size: 14px;
        width: 14px;
        fill: currentColor;
        vertical-align: -0.15em;
        outline: none;
        margin: 0 0 0 8px;
      }
      &-right{
        font-weight: 400;
        color: #aaa;
        font-size: 14px;
      }
    }
    &-top{
      font: inherit;
      margin: 0 0 10px 0;
      &-left{
        white-space: nowrap;
        overflow: hidden;
        overflow-x: auto;
        scrollbar-width: none; /* firefox */
        -ms-overflow-style: none; /* IE 10+ */
        color: #888;
        &::-webkit-scrollbar {
          display: none;
        }
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
          color: #333;
          font-weight: 600;
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
        white-space: nowrap;
        overflow: hidden;
        overflow-x: auto;
        scrollbar-width: none; /* firefox */
        -ms-overflow-style: none; /* IE 10+ */
        &::-webkit-scrollbar {
          display: none; 
        }
        >div{
          background-color: #eee;
          border-radius: 20px;
          overflow: hidden;
          margin: 0 4px;
          color: #000;
          padding: 2px 15px;
          display: flex;
          align-items: center;
          &:last-child{
            
          }
        }
        .active{
          color: rgb(61, 140, 243);
          font-weight: 500;
          background-color: transparent;
          font-weight: 600;
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
        color: #000;
      }
      &-time{
        white-space: nowrap;
        color: #999;
        font-size: 14px;
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
        object-fit: fill;
      }
      &-left-img2{
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin:0 10px 0 0;
        object-fit: fill;
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
        color: #888;
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
        color: #999;
        font-size: 14px;
      }
      &-title-bottom2{
        margin: 10px 0 0 0;
        color: #999;
        font-size: 3.7vw;
      }
    }
  }
  &-empty{
    overflow: hidden;
    height: 90px;
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