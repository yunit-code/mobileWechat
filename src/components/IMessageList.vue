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
          <span v-if="propData.showTotalNumber">{{messageData.total}}</span> <span v-else>更多</span> <van-icon name="arrow" />
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
            <img :src="item.image" :class="propData.compStyle === 'styleTwo' ? 'idm-message-list-box-list2-left-img' : 'idm-message-list-box-list2-left-img2'" alt="">
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
const messageData = {
    list:[{
      title: "营商环境优，引得“近邻”来",
      image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.xntv.tv%2Fd%2Ffile%2F2018-04-26%2Ffa767ea3d7f35f9d44531daa96fd32a4.jpg&refer=http%3A%2F%2Fwww.xntv.tv&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655102114&t=f60af982a9e9191280839e5d2a4cafd1",
      jumpUrl: "",
      time: "2022-04-15",
      author: "作者"
    },
    {
      title: "山东“职教高地”建设提质培优",
      image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_70%2Cc_zoom%2Cw_640%2Fimages%2F20190329%2F3dfe53bbc72945efa027676bc250d87c.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655102114&t=d03ee07e0978bf8c3483099216cdac6c",
      jumpUrl: "",
      time: "2022-04-14",
      author: "作者"
    },
    {
      title: "山东省人民政府办公厅关于印发",
      image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.xntv.tv%2Fd%2Ffile%2F2018-04-26%2Ffa767ea3d7f35f9d44531daa96fd32a4.jpg&refer=http%3A%2F%2Fwww.xntv.tv&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655102114&t=f60af982a9e9191280839e5d2a4cafd1",
      jumpUrl: "",
      time: "2022-04-13",
      author: "作者"
    }],
    moreUrl: "",
    total:"99"
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
              if(element&&element.hex){
                styleObject["background-color"]=element.hex;
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
                if(element.border.top.colors.hex){
                  styleObject["border-top-color"]=element.border.top.colors.hex;
                }
              }
              if(element.border.right.width>0){
                styleObject["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                styleObject["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex){
                  styleObject["border-right-color"]=element.border.right.colors.hex;
                }
              }
              if(element.border.bottom.width>0){
                styleObject["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                styleObject["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex){
                  styleObject["border-bottom-color"]=element.border.bottom.colors.hex;
                }
              }
              if(element.border.left.width>0){
                styleObject["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                styleObject["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex){
                  styleObject["border-left-color"]=element.border.left.colors.hex;
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
              if(element&&element.hex){
                subBoxStyleObj["background-color"]=element.hex;
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
                if(element.border.top.colors.hex){
                  subBoxStyleObj["border-top-color"]=element.border.top.colors.hex;
                }
              }
              if(element.border.right.width>0){
                subBoxStyleObj["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                subBoxStyleObj["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex){
                  subBoxStyleObj["border-right-color"]=element.border.right.colors.hex;
                }
              }
              if(element.border.bottom.width>0){
                subBoxStyleObj["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                subBoxStyleObj["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex){
                  subBoxStyleObj["border-bottom-color"]=element.border.bottom.colors.hex;
                }
              }
              if(element.border.left.width>0){
                subBoxStyleObj["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                subBoxStyleObj["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex){
                  subBoxStyleObj["border-left-color"]=element.border.left.colors.hex;
                }
              }
              subBoxStyleObj["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              subBoxStyleObj["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              subBoxStyleObj["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              subBoxStyleObj["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
            case "titleIconFontColor":
                styleObjectTitleIcon["fill"] = element.hex + ' !important';
                break
            case "titleIconFontSize":
                styleObjectTitleIcon["font-size"] = getAdaptiveSize.call(this,element) + "px";
                styleObjectTitleIcon["width"] = getAdaptiveSize.call(this,element) + "px";
                styleObjectTitleIcon["height"] = getAdaptiveSize.call(this,element) + "px";
                break
            case 'titleFontStyle':
                titleFontStyleObj["font-family"] = element.fontFamily;
                if (element.fontColors.hex) {
                    titleFontStyleObj["color"] = element.fontColors.hex;
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
                if (element.fontColors.hex) {
                    tabFontStyleObj["color"] = element.fontColors.hex;
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
                if (element.fontColors.hex) {
                    titleFontStyleActiveObj["color"] = element.fontColors.hex + ' !important';
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
                if (element.fontColors.hex) {
                    messageItemFontStyleObj["color"] = element.fontColors.hex;
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
          color: item.mainColor ? item.mainColor.hex : "",
        };
        
        let iconColorObj = {
          fill: item.mainColor ? item.mainColor.hex : "",
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