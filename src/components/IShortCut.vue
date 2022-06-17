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
      <div class="com-title" v-if="propData.isShowTitle">
        <div class="idm_applicationcenter_title_left_icon" v-if="propData.titleIconPosition === 'left'" style="margin-right: 5px">
            <svg v-if="propData.titleIconClass && propData.titleIconClass.length" class="idm_filed_svg_icon" aria-hidden="true" >
                <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
            </svg>
            <svg-icon v-else icon-class="application-icon" />
        </div>
        <span>{{propData.title}}</span>
        <div class="idm_applicationcenter_title_left_icon" v-if="propData.titleIconPosition === 'right'" style="margin-left: 5px">
            <svg v-if="propData.titleIconClass && propData.titleIconClass.length" class="idm_filed_svg_icon" aria-hidden="true" >
                <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
            </svg>
            <svg-icon v-else icon-class="application-icon" />
        </div>
      </div>
      <div class="idm_shortcut_cont">
        <template v-if="propData.shortCutStyle === 'default'">
          <ul class="short-box">
            <template v-for="(v,i) in propData.shortConfigList">
              <li :key="i" class="short-item"
                v-if="v.isShow"
                :style="{width: `${100/propData.maxNumber}%`}">
                <div class="short-bg"
                :style="v.styles"
                @click="goUrl(v)">
                  <span>{{v.name}}</span>
                  <!-- <div v-if="v.showTodoNumber && v.todoNumber" class="number">{{ v.todoNumber }}</div> -->
                  <div v-if="v.showTodoNumber && v.todoNumber && v.todoNumber<=99" class="number">{{ v.todoNumber }}</div>
                  <div v-if="v.showTodoNumber && v.todoNumber && v.todoNumber>99" class="number number2">99+</div>
                </div>
              </li>
            </template>
          </ul>
        </template>
        <template v-else-if="propData.shortCutStyle === 'default2'">
          <van-grid :border="false" :column-num="propData.maxNumber">
            <template v-for="(v,i) in propData.shortConfigList">
              <van-grid-item :key="i" v-if="v.isShow">
                <div @click="goUrl(v)" class="idm_applicationcenter_main_list">
                  <div class="img_box">
                    <img v-if="v.bgUrl" :src="IDM.url.getWebPath(v.bgUrl)">
                    <svg-icon v-else icon-class="application" />
                    <div v-if="v.showTodoNumber && v.todoNumber && v.todoNumber<=99" class="number">{{ v.todoNumber }}</div>
                    <div v-if="v.showTodoNumber && v.todoNumber && v.todoNumber>99" class="number number2">99+</div>
                  </div>
                  <div class="idm_applicationcenter_main_list_name">{{ v.name }}</div>
                </div>
              </van-grid-item>
            </template>
          </van-grid>
        </template>
        <template v-else>
          <van-grid :border="false" :column-num="propData.maxNumber">
            <template v-for="(v,i) in propData.shortConfigList">
              <van-grid-item :key="i" v-if="v.isShow">
                <div @click="goUrl(v)" class="idm_applicationcenter_main_list-three">
                  <!-- <div class="img_box"> -->
                    <div class="img_box">
                      <div class="two">
                        <div class="three">
                          <img v-if="v.bgUrl" :src="IDM.url.getWebPath(v.bgUrl)">
                          <svg-icon v-else icon-class="application" />
                        </div>
                      </div>
                    <!-- </div> -->
                    <!-- <img v-if="v.bgUrl" :src="IDM.url.getWebPath(v.bgUrl)">
                    <svg-icon v-else icon-class="application" />
                    <div v-if="v.showTodoNumber && v.todoNumber" class="number">{{ v.todoNumber }}</div> -->
                  </div>
                  <!-- <div v-if="v.showTodoNumber && v.todoNumber" class="number">{{ v.todoNumber }}</div> -->
                  <div v-if="v.showTodoNumber && v.todoNumber && v.todoNumber<=99" class="number">{{ v.todoNumber }}</div>
                  <div v-if="v.showTodoNumber && v.todoNumber && v.todoNumber>99" class="number number2">99+</div>
                  <div class="idm_applicationcenter_main_list_name">
                    <div class="empty-view"></div>
                    <div class="tit">{{ v.name }}</div>
                  </div>
                </div>
              </van-grid-item>
            </template>
          </van-grid>
        </template>
      </div>
    </div>
    
  </div>
</template>

<script>
import { getDatasInterfaceUrl } from '@/api/config'
import { Grid, GridItem, Icon } from 'vant';
import 'vant/lib/grid/style';
import 'vant/lib/icon/style';
export default {
  name: 'IShortCut',
  components: {
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Icon.name]: Icon
  },
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{
        isShowTitle: true,
        shortItemHeight: {'inputVal':45, 'selectVal': 'px'},
        shortItemWidth: {'inputVal':100, 'selectVal': '%'},
        shortCutStyle: "default"
      },
      // 当前设备宽度
      currentEquipWidth: ""
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
    this.convertAttrToStyleObject2();
    // 主题
    this.convertThemeListAttrToStyleObject();
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
    // 快捷方式跳转
    goUrl(v) {
      if (v.shotUrl && this.moduleObject.env=="production") {
        switch(v.jumpType) {
          case 'new':
            window.open(IDM.url.getWebPath(v.shotUrl))
            break;
          case 'current':
            window.location.href=IDM.url.getWebPath(v.shotUrl)
            break;
          case 'new2':
            try {
              wx.invoke('openUrl', {
                "type": 0, //0或不填表示使用内部浏览器新窗口打开，1表示用系统浏览器打开
                "url": IDM.url.getWebPath(v.shotUrl), //url地址
              }, function(res){
                if (res.err_msg != "openUrl:ok") {
                  window.location.href = IDM.url.getWebPath(v.shotUrl)
                  //错误处理
                }
              });
            } catch (error) {
              window.location.href = IDM.url.getWebPath(v.shotUrl)
            }
            break;
        }
      }
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.convertAttrToStyleObject();
      this.convertAttrToStyleObject2();
      // 主题
      this.convertThemeListAttrToStyleObject();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(){
      
      var styleObject = {};
      var styleObjectTitleIcon = {};
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
      styleObject["font-size"] = `${this.funScreenAdaptation(16)}px`;
      // styleObject["font-weight"]=800;
      styleObject["color"]='#333333';
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
            case "font":
              styleObject["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObject["color"]=IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              styleObject["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObject["font-style"]=element.fontStyle;
              styleObject["font-size"]= `${this.funScreenAdaptation(element.fontSize||16)}${element.fontSizeUnit||'px'}`;
              styleObject["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObject["text-align"]=element.fontTextAlign;
              styleObject["text-decoration"]=element.fontDecoration;
              break;
            case "cardFont":
              styleObject["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObject["color"]=IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              styleObject["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObject["font-style"]=element.fontStyle;
              styleObject["font-size"]= `${this.funScreenAdaptation(element.fontSize||14)}${element.fontSizeUnit||'px'}`;
              styleObject["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObject["text-align"]=element.fontTextAlign;
              styleObject["text-decoration"]=element.fontDecoration;
              break;
            case "titleIconFontColor":
              if(element) {
                styleObjectTitleIcon["color"] = element.hex8?IDM.hex8ToRgbaString(element.hex8):"";
                styleObjectTitleIcon["fill"] = element.hex8?IDM.hex8ToRgbaString(element.hex8):"";
              }
              break
            case "titleIconFontSize":
                styleObjectTitleIcon["font-size"]= `${this.funScreenAdaptation(element)}px`;
                styleObjectTitleIcon["width"] = `${this.funScreenAdaptation(element)}px`;
                styleObjectTitleIcon["height"] = `${this.funScreenAdaptation(element)}px`;
                break
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .com-title .idm_applicationcenter_title_left_icon .idm_filed_svg_icon", styleObjectTitleIcon);
      this.initData();
    },
    
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject2(){
      var styleObject = {},
        styleObjectCont = {},
        styleObjectNum = {};
      if(this.propData.bgSize2&&this.propData.bgSize2=="custom"){
        styleObject["background-size"]=(this.propData.bgSizeWidth2?this.propData.bgSizeWidth2.inputVal+this.propData.bgSizeWidth2.selectVal:"auto")+" "+(this.propData.bgSizeHeight2?this.propData.bgSizeHeight2.inputVal+this.propData.bgSizeHeight2.selectVal:"auto")
      }else if(this.propData.bgSize2){
        styleObject["background-size"]=this.propData.bgSize2;
      }
      if(this.propData.positionX2&&this.propData.positionX2.inputVal){
        styleObject["background-position-x"]=this.propData.positionX2.inputVal+this.propData.positionX2.selectVal;
      }
      if(this.propData.positionY2&&this.propData.positionY2.inputVal){
        styleObject["background-position-y"]=this.propData.positionY2.inputVal+this.propData.positionY2.selectVal;
      }
      styleObject["font-weight"]=800;
      styleObject["color"]='#333333';
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if(!element&&element!==false&&element!=0){
            continue;
          }
          switch (key) {
            case "width2":
              styleObject['width']=element;
              break;
            case "height2":
              styleObject['height']=element;
              break;
            case "bgColor2":
              if(element&&element.hex8){
                styleObject["background-color"]=IDM.hex8ToRgbaString(element.hex8);
              }
              break;
            case "box2":
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
            case "bgImgUrl2":
              styleObject["background-image"]=`url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX2":
              //背景横向偏移
              
              break;
            case "positionY2":
              //背景纵向偏移
              
              break;
            case "bgRepeat2":
              //平铺模式
                styleObject["background-repeat"]=element;
              break;
            case "bgAttachment2":
              //背景模式
                styleObject["background-attachment"]=element;
              break;
            case "border2":
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
            case "font2":
              styleObject["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObject["color"]=IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              styleObject["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObject["font-style"]=element.fontStyle;
              styleObject["font-size"]= `${this.funScreenAdaptation(element.fontSize||12)}${element.fontSizeUnit||'px'}`;
              styleObject["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObject["text-align"]=element.fontTextAlign;
              if(element.fontTextAlign) {
                styleObjectCont['justify-content'] = element.fontTextAlign==='center'?'center':element.fontTextAlign==='right'?'flex-end':'flex-start'
              }
              styleObject["text-decoration"]=element.fontDecoration;
              break;
          }
        }
      }
      styleObjectNum['width'] = `${this.funScreenAdaptation(20)}'px'`;
      styleObjectNum['height'] = `${this.funScreenAdaptation(20)}'px'`;
      styleObjectNum['font-size'] = `${this.funScreenAdaptation(12)}'px'`;
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_shortcut_cont", styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_shortcut_cont .short-bg", styleObjectCont);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_shortcut_cont .number", styleObjectNum);
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
      // 主题
      this.convertThemeListAttrToStyleObject();
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
            that.$set(that.propData,"shortConfigList",res.data);
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
            } catch (error) {
            }
            that.propData.shortConfigList = resValue;
          }
          break;
      }
      if(this.propData.shortConfigList) {
        if(this.propData.shortCutStyle === 'default') {
          this.propData.shortConfigList.forEach(item=> {
            const styles = {}
            if(item.bgUrl) {
              styles["backgroundImage"]=`url(${window.IDM.url.getWebPath(item.bgUrl)})`;
            }else {
              styles["backgroundImage"]= 'linear-gradient(to right,#f4b0b0,#f4acac,#f18c8b)';
            }
            if(item.bgSizeWidth||item.bgSizeHeight) {
              styles["backgroundSize"]=(item.bgSizeWidth&&item.bgSizeWidth.selectVal?item.bgSizeWidth.inputVal+item.bgSizeWidth.selectVal:"auto")+" "+(item.bgSizeHeight&&item.bgSizeHeight.selectVal?item.bgSizeHeight.inputVal+item.bgSizeHeight.selectVal:"auto")
            }
            if(item.bgRepeat){
              styles["backgroundRepeat"]= item.bgRepeat;
            }
            if(item.bgAttachment) {
              styles["backgroundAttachment"]= item.bgAttachment;
            }
            styles['height'] = `${this.funScreenAdaptationHeight(this.propData.shortItemHeight.inputVal)}${this.propData.shortItemHeight.selectVal}`;
            styles['width'] = `${this.propData.shortItemWidth.inputVal}${this.propData.shortItemWidth.selectVal}`;
            let pClientWidth = this.currentEquipWidth;
            if(this.moduleObject.env!=="develop") {
              if(!pClientWidth) {
                pClientWidth = document.body.clientWidth;
              }
            }
            if(pClientWidth >600) {
              styles['margin'] = `0 10px`;
            }
            // styles['width'] = this.propData.shortItemWidth.inputVal+this.propData.shortItemWidth.selectVal;
            // styles['height'] = this.propData.shortItemHeight.inputVal+this.propData.shortItemHeight.selectVal;
            this.$set(item,'styles',styles);
          })
        }else if(this.propData.shortCutStyle === 'default2') {
          let styleObjects = {};
          styleObjects['width'] = `${this.funScreenAdaptationHeight(this.propData.shortItemWidth2 || 40, 0.5)}px`;
          styleObjects['height'] = `${this.funScreenAdaptationHeight(this.propData.shortItemWidth2 || 40, 0.5)}px`;
          window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_shortcut_cont .img_box", styleObjects);
          window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_shortcut_cont .img_box", styleObjects);
        }else {
          let styleObjects = {};
          let styleObjects2 = {};
          let styleObjects3 = {};
          styleObjects['width'] = `${this.funScreenAdaptationHeight(this.propData.shortItemWidth3 || 45, 0.5)}px`;
          styleObjects['height'] = `${this.funScreenAdaptationHeight(this.propData.shortItemWidth3 +5 || 50, 0.5)}px`;
          styleObjects['margin-bottom'] = `-${this.funScreenAdaptationHeight(30, 0.5)}px`;
          styleObjects2['width'] = `${this.funScreenAdaptationHeight(this.propData.shortItemWidth3 +5 || 50, 0.5)}px`;
          styleObjects2['height'] = `${this.funScreenAdaptationHeight(40, 0.5)}px`;
          styleObjects3['top'] = `${this.funScreenAdaptationHeight(8, 0.5)}px`;
          window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_shortcut_cont .img_box", styleObjects);
          window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_shortcut_cont .empty-view", styleObjects2);
          window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_shortcut_cont .number", styleObjects3);
        }
        this.getApplicationMarkNumber();
      }
    },
    getApplicationMarkNumber() {
      if(this.propData.shortConfigList) {
        const userInfo = window.IDM.user.getCurrentUserInfo();
        console.log('propData.shortConfigList',this.propData.shortConfigList)
        for( let i = 0,maxi = this.propData.shortConfigList.length;i < maxi;i++ ) {
          const item = this.propData.shortConfigList[i];
          this.getApplicationMarkShowBtn(item, userInfo.roleIds);
          if ( item.showTodoNumber && item.dataSource) {
            this.getApplicationMarkNumberSubmit(item)
          }
        }
      }
    },
    getApplicationMarkNumberSubmit(item) {
      // console.log('getApplicationMarkNumberUrl',JSON.stringify(item))
      window.IDM.http.post(getDatasInterfaceUrl,{
        id: item.dataSource && item.dataSource.value
      },{
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      }).then(result=>{
          console.log('角标接口请求回参',result)
          if ( result&&result.data&&result.data.type == 'success' && result.data.data ) {
              if ( !item.dataFiled ) {
                  this.$set(item, "todoNumber", result.data.data.count);
              } else {
                  this.$set(item, "todoNumber", result.data.data[item.dataFiled||'count']);
              }
          }else {
            IDM.message.error(result.data.message)
          }
      })
    },
    /**
     *@Description: 根据角色判断是否显示按钮
     *@MethodAuthor: AuthorName
     *@Date: 2022-06-16 10:46:38
    */
    getApplicationMarkShowBtn(item, ids) {
      console.log(item)
      if(this.moduleObject.env=="production") {
        if ( !item.shortOpenValid ) {
          this.$set(item, "isShow", true);
        } else {
          if(item.dataSource2 && item.dataSource2.length && ids) {
            for(let i = 0; i< item.dataSource2.length; i++) {
              if(ids.indexOf(item.dataSource2[i].value) >= 0) {
                this.$set(item, "isShow", true);
                return;
              }
            }
            this.$set(item, "isShow", false);
          }else {
            this.$set(item, "isShow", true);
          }
        }
      }else{
        this.$set(item, "isShow", true);
      }
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
          fill: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
        };
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .idm_filed_svg_icon",
          iconColorObj
        );
      }
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
      }else if(object.type&&object.type=== "pageResize"){
        this.currentEquipWidth = object.message.width;
        this.convertAttrToStyleObject();
        this.convertAttrToStyleObject2();
      } else if(object.type&&object.type=== "websocket") {
        // 配置了刷新KEY，消息类型是websocket，收到的消息对象有message并不为空
        if(this.propData.messageRefreshKey && this.propData.messageRefreshKey.length && object.message){
          const messageData = typeof object.message === 'string' && JSON.parse(object.message) || object.message
          const arr = this.propData.messageRefreshKey || []
          if(messageData.badgeType && arr.includes(messageData.badgeType)){
            this.getApplicationMarkNumber()
          }
        }
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
        this.$set(this.propData,"shortConfigList",object.data);
      }
    },
    /**
     *@Description: 屏幕适配
     *pClientWidth 当前设备宽度
     *screenAdaptiveRatio 适配比例
     *screenReferValue 屏幕基准值
    */
    funScreenAdaptation(e) {
      let pClientWidth = this.currentEquipWidth;
      if(this.moduleObject.env==="develop") {
        if(!pClientWidth) {
          return e;
        }
      }else {
        if(!pClientWidth) {
          pClientWidth = document.body.clientWidth;
        }
      }
      const screenReferValue = this.propData.screenReferValue || 414;
      const screenAdaptiveRatio = this.propData.screenAdaptiveRatio || 1.2;
      return Math.round(e * ( ( pClientWidth/screenReferValue - 1 ) * ( screenAdaptiveRatio - 1 ) + 1 ))
    },
    /**
     *@Description: 屏幕高度适配
     *pClientWidth 当前设备宽度
     *screenAdaptiveRatio 适配比例
     *screenReferValue 屏幕基准值
    */
    funScreenAdaptationHeight(e, diffVal = 0.3) {
      let pClientWidth = this.currentEquipWidth;
      if(this.moduleObject.env==="develop") {
        if(!pClientWidth) {
          return e;
        }
      }else {
        if(!pClientWidth) {
          pClientWidth = document.body.clientWidth;
        }
      }
      const screenReferValue = this.propData.screenReferValue || 414;
      const screenAdaptiveRatio = Number(this.propData.screenAdaptiveRatio) + diffVal || 1.2;
      return Math.round(e * ( ( pClientWidth/screenReferValue - 1 ) * ( screenAdaptiveRatio - 1 ) + 1 ))
    },
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
  .idm_shortcut_cont {
    font-size: 15px;
    ::v-deep .van-grid-item__content{
      padding: 7px 3px;
    }
    /* 样式二 */
    .idm_applicationcenter_main_list{
      position: relative;
      text-align: center;
      .img_box{
        position: relative;
        // width: 40px;
        // height: 40px;
        margin: 0 auto 2.5px auto;
        img,svg{
          width: 100%;
          height: 100%;
        }
      }
      .number{
        width: 20px;
        height: 20px;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: -10px;
        right: -10px;
        text-align: center;
        font-size: 12px;
        overflow: hidden;
        color: white;
        background: #E81B1B;
        border-radius: 10px;
        &.number2 {
          width: 30px;
        }
      }
    }
    /* 样式三 */
    .idm_applicationcenter_main_list-three {
      position: relative;
      .idm_applicationcenter_main_list_name {
        width: 100%;
        text-align: right;
        background-color: #ffffff;
        border-radius: 5px;
        padding: 0px 10px;
        display: flex;
        margin-top: 10px;
        .empty-view {
          width: 50px;
          height: 40px;
        }
        .tit {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
      }
      // .img_box,img,svg{
      //     width: 40px;
      //     height: 40px;
      //     margin: 0 auto 2.5px auto;
      // }
      // .img_box {
      //     width: 40px;
      //     height: 40px;
      //     margin: 0 auto 2.5px auto;
      //     position: absolute;
      //     bottom: 10px;
      //     left: 10px;
      // }
      .img_box{
        // position: absolute;
        // bottom: 15px;
        // left: 5px;
        // width: 45px;
        // height: 50px;
        float: left;
        margin-bottom: -30px;
        margin-left: 10px;
        overflow: hidden;
        transform: rotate(120deg);
        img,svg{
          width: 100%;
          height: 100%;
        }
      }
      .two{
          width: 100%;
          height: 100%;
          overflow: hidden;
          transform: rotate(-60deg);
      }
      .three{
          width: 100%;
          height: 100%;
          overflow: hidden;
          transform: rotate(-60deg);
      }
      .number{
        width: 20px;
        height: 20px;
        position: absolute;
        top: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        right: -5px;
        text-align: center;
        font-size: 12px;
        overflow: hidden;
        color: white;
        background: #E81B1B;
        border-radius: 10px;
        &.number2 {
          width: 30px;
        }
      }
    }
  }
  .short-box{
    display: flex;
    flex-wrap: wrap;
    // margin: 0 -5px;
    .short-item{
      position: relative;
      padding: 5px;
      text-align: center;
      display: flex;
      justify-content: center;
      // margin-bottom: 10px;
      .number {
        width: 20px;
        height: 20px;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: -3px;
        right: -3px;
        text-align: center;
        font-size: 12px;
        overflow: hidden;
        color: white;
        background: #E81B1B;
        border-radius: 10px;
        &.number2 {
          width: 30px;
        }
      }
    }
    .short-bg{
      border-radius: 6px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      display: flex;
      justify-content: center;
      align-items: center;
      // color: #fff;
    }
  }
</style>
