<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    :title="propData.htmlTitle"
    v-show="propData.defaultStatus != 'hidden'"
    class="idm-banner-box"
  >
    <div class="idm-banner-box-swiper">
      <div :class="'idm-banner-box-swiper-container' + refreshKeyNumber">
        <ul class="swiper-wrapper">
          <li
            class="swiper-slide idm-banner-box-swiper-item-container banner-item-container"
            v-for="(item, index) in bannerData.value"
            :key="index"
            @click="handleClick(item, index)"
          >
            <img v-if="propData && propData.dataType === 'custom'" :src="item.image && IDM.url.getWebPath(item.image)"  class="slider-img" alt="" />

            <img v-else :src="IDM.express.replace('@['+propData.dataFiled+']', item, true)"  class="slider-img" alt="" />
            <span class="idm-banner-box-swiper-text">{{item.title}}</span>
          </li>
        </ul>
        <div class="idm-banner-swiper-pagination"></div>
      </div>
    </div>
    <div class="idm-banner-box-mask" v-if="moduleObject.env === 'develop' && (propData.dataType === 'dataSource' && !propData.dataSource)">
      <span>！未绑定数据源</span>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
import { getDatasInterfaceUrl } from '@/api/config'
import { getAdaptiveSize } from '@/utils/adaptationScreen'
const data = {
  value: [{
    jumpUrl: '/dreamweb/',
    image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp7.itc.cn%2Fimages01%2F20200903%2F9f80293e09644046a408f8be7359d4ff.jpeg&refer=http%3A%2F%2Fp7.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654761049&t=b2726a52f403b5d4dcca968820d55109",
    title:
      "主持召开省政府常务会议研究",
  },
  {
    jumpUrl: '/dreamweb/',
    image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp6.itc.cn%2Fimages01%2F20201012%2F19ebfe9ad37b4e29bac785eb0146d02e.jpeg&refer=http%3A%2F%2Fp6.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654761049&t=5100670fe8877ffd3ad76e0f0f7bb6a0",
    title:
      "山东“职教高地”建设提质培优",
  },
  {
    jumpUrl: '/dreamweb/',
    image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp1.itc.cn%2Fq_70%2Fimages03%2F20210129%2Fcb5a1f799b364202beed7f122e87bf8a.png&refer=http%3A%2F%2Fp1.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654761049&t=8a20f26c2574d17e04376728ba796324",
    title:
      "营商环境优，引得“近邻”来",
  },
  {
    jumpUrl: '/dreamweb/',
    image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp6.itc.cn%2Fimages01%2F20201012%2F19ebfe9ad37b4e29bac785eb0146d02e.jpeg&refer=http%3A%2F%2Fp6.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654761049&t=5100670fe8877ffd3ad76e0f0f7bb6a0",
    title:
      "[发文] 关于扎实做好近期疫情防控有关工作的通知",
  }],
  moreUrl: "更多跳转地址"
}
export default {
  name: "IBanner",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        htmlTitle: "广告轮播",
        width: "100%",
        height: "240px",
        limit: 5,
        showBullet: true,
        imgBorderRadius: {
          inputVal: 8,
          selectVal: "px"
        },
        dataFiled: 'image',
        dataType: 'dataSource'
      },
      bannerData: {value: []},
      refreshKeyNumber: 0
    };
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
    this.convertThemeListAttrToStyleObject()
  },
  mounted() {
    if(this.moduleObject.env === 'develop') {
      this.initSwiper();
    }
  },
  methods: {
    initSwiper() {
      this.$nextTick(()=> {
        let swiper = new Swiper('#'+this.moduleObject.id + " .idm-banner-box-swiper-container" + this.refreshKeyNumber, {
          autoplay: 2000,                                           //自动播放
          speed: 500,                                               //播放速度
          loop: true,                                               //循环播放
          loopedSlides: 100,                                        //循环个数
          slidesPerView: 'auto',                                    //预览slide个数
          effect: 'coverflow',                                      //特效组件
          pagination: this.moduleObject.env === 'develop' || !this.propData.showBullet ? '' :  { //指示器
            el: '.idm-banner-swiper-pagination',                    //指示器元素
            bulletClass : 'idm-banner-my-bullet',                   //指示器单个元素类名
            bulletActiveClass: 'idm-banner-my-bullet-active',       //指示器单个元素当前激活类名
          },
          centeredSlides: true,                                     //居中
          coverflowEffect: {                                        //特效组件属性
            rotate: 0,                                              //旋转度数
            stretch: '-7%',                                         //左右拉伸
            depth: 100,                                             //位置深度，越大越小
            modifier: 1,                                            //depth和rotate和stretch的倍率
            slideShadows: false,                                    //阴影
          },
          observer: true,                                           //监视器，开启时下面两个才生效
          observeParents: true,                                     //监视父级元素变化,例如show/hide、第一级子元素增加/删除等，则更新Swiper 并触发 observerUpdate 事件
          observeSlideChildren: true,                               //监视监测Swiper 的子元素（wrapper、pagination、navigation、scrollbar）。 当新增/删除这些子元素时，则更新Swiper 并触发 observerUpdate 事件
          on: {
            observerUpdate: function(){
              console.log('Swiper更新了');
            },
            paginationUpdate: function(){
              console.log('pagination更新了')
            },
          }
        });
        const index = window.sessionStorage.swiperClickedIndex
        if(index != undefined) {
          swiper.slideTo(Number(index), 0, false)
        }
      })
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject()
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      var styleObject = {};
      let bannerItemStyleObj = {}
      let bannerFontStyleObj = {}
      if (this.propData.bgSize && this.propData.bgSize == "custom") {
        styleObject["background-size"] =
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal +
              this.propData.bgSizeWidth.selectVal
            : "auto") +
          " " +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal +
              this.propData.bgSizeHeight.selectVal
            : "auto");
      } else if (this.propData.bgSize) {
        styleObject["background-size"] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject["background-position-x"] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject["background-position-y"] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case "width":
              styleObject[key] = element;
              break;
            case "height":
              styleObject[key] = element.inputVal + element.selectVal;
              bannerItemStyleObj[key] = element.inputVal + element.selectVal;
              break;
            case "box":
              if (element.marginTopVal) {
                styleObject["margin-top"] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                styleObject["margin-right"] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                styleObject["margin-bottom"] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                styleObject["margin-left"] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                styleObject["padding-top"] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                styleObject["padding-right"] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                styleObject["padding-bottom"] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                styleObject["padding-left"] = `${element.paddingLeftVal}`;
              }
              break;
            case "bgImgUrl":
              styleObject[
                "background-image"
              ] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移

              break;
            case "positionY":
              //背景纵向偏移

              break;
            case "bgRepeat":
              //平铺模式
              styleObject["background-repeat"] = element;
              break;
            case "bgAttachment":
              //背景模式
              styleObject["background-attachment"] = element;
              break;
            case "border":
              if (element.border.top.width > 0) {
                styleObject["border-top-width"] =
                  element.border.top.width + element.border.top.widthUnit;
                styleObject["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  styleObject["border-top-color"] =
                    element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                styleObject["border-right-width"] =
                  element.border.right.width + element.border.right.widthUnit;
                styleObject["border-right-style"] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  styleObject["border-right-color"] =
                    element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                styleObject["border-bottom-width"] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                styleObject["border-bottom-style"] =
                  element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  styleObject["border-bottom-color"] =
                    element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                styleObject["border-left-width"] =
                  element.border.left.width + element.border.left.widthUnit;
                styleObject["border-left-style"] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  styleObject["border-left-color"] =
                    element.border.left.colors.hex8;
                }
              }

              styleObject["border-top-left-radius"] =
                element.radius.leftTop.radius +
                element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"] =
                element.radius.rightTop.radius +
                element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"] =
                element.radius.leftBottom.radius +
                element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"] =
                element.radius.rightBottom.radius +
                element.radius.rightBottom.radiusUnit;
              break;
            case "titleFontStyle":
              bannerFontStyleObj["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                bannerFontStyleObj["color"] = element.fontColors.hex8;
              }
              bannerFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              bannerFontStyleObj["font-style"] = element.fontStyle;
              bannerFontStyleObj["font-size"] = getAdaptiveSize.call(this, element.fontSize) + element.fontSizeUnit;
              bannerFontStyleObj["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              bannerFontStyleObj["text-align"] = element.fontTextAlign;
              bannerFontStyleObj["text-decoration"] = element.fontDecoration;
              break;
            case 'imgBorderRadius':
              bannerItemStyleObj['border-radius'] = element.inputVal + element.selectVal;
              break;
            case "marginTop":
              bannerFontStyleObj['margin-top'] = element.inputVal + element.selectVal;
              break;
            case "marginBottom":
              bannerFontStyleObj['margin-bottom'] = element.inputVal + element.selectVal;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-banner-box-swiper-item-container', bannerItemStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-banner-box-swiper-text', bannerFontStyleObj);
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
        let bulletBgColorObj = {
          'background-color': item.mainColor ? item.mainColor.hex8 : "",
        };
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .idm-banner-my-bullet",
          bulletBgColorObj
        );
      }
    },
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam() {
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
    reload() {
      //请求数据源
      this.initData();
    },
    /**
     * 加载动态数据
     */
    initData() {
      // 刷新数每次加1,确保元素刷新
      this.refreshKeyNumber ++
      if(this.propData.dataType === 'custom'){
         // 自定义数据直接使用
        this.$set(this.bannerData, 'value', this.propData.bannerTable)
        this.initSwiper();
        return
      }else{
        // 开发环境使用假数据，深拷贝方式数据fix不更新
        if(this.moduleObject.env === 'develop') {
          this.bannerData = _.cloneDeep(data)
          this.initSwiper();
          return
        }
      }
      window.IDM.http
        .post(getDatasInterfaceUrl, {
          type: 'picture',
          id: this.propData.dataSource && this.propData.dataSource.value,
          limit: this.propData.limit,
          start: 0
        },{
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          }
        })
        .then((res) => {
          //res.data
          if(res.status == 200 && res.data.code == 200){
            this.bannerData = res.data.data
          }else {
            IDM.message.error(res.data.message)
          }
          this.initSwiper()
        })
        .catch((error) => {
          this.initSwiper()
      })
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if (dataFiled) {
        var filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths("[") ? "" : ".") + filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
      }
      //对结果进行再次函数自定义
      if (
        this.propData.customFunction &&
        this.propData.customFunction.length > 0
      ) {
        var params = this.commonParam();
        var resValue = "";
        try {
          resValue =
            window[this.propData.customFunction[0].name] &&
            window[this.propData.customFunction[0].name].call(this, {
              ...params,
              ...this.propData.customFunction[0].param,
              moduleObject: this.moduleObject,
              expressData: _defaultVal,
              interfaceData: resultData,
            });
        } catch (error) {}
        _defaultVal = resValue;
      }

      return _defaultVal;
    },
    /**
     * 轮播点击事件
     */
    handleClick(item, index) {
      if(this.moduleObject.env === 'develop') {
        return
      }
      // window.sessionStorage.swiperClickedIndex = index
      if(item.jumpUrl) {
        window.open(IDM.url.getWebPath(item.jumpUrl), this.propData.jumpStyle || '_self')
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
    receiveBroadcastMessage(messageObject) {
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
    sendBroadcastMessage(object) {
      window.IDM.broadcast && window.IDM.broadcast.send(object);
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
        this.$set(
          this.propData,
          "bannerData",
          this.getExpressData(
            this.propData.dataName,
            this.propData.dataFiled,
            object.data
          )
        );
      }
    },
  },
};
</script>

<style lang="scss">
.idm-banner-box {
  padding: 0;
  overflow: hidden;
  position: relative;
  &-swiper-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  & &-swiper-item-container {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  &-swiper-text {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 4px 100px 4px 8px;
    background-color: rgba(0, 0, 0, 0.3);
    font-size: 14px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
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


.swiper-slide {
  -webkit-transition: transform .5s;
  -moz-transition: transform .5s;
  -ms-transition: transform .5s;
  -o-transition: transform .5s;
  -webkit-transform: scale(1);
  transform: scale(0.9);
  position: relative;
}
.swiper-slide-active,
.swiper-slide-duplicate-active {
  -webkit-transform: scale(1);
  transform: scale(1);
}
.slider-img{
  border-radius: 8px;
  overflow: hidden;
  object-fit: cover;
}
.idm-banner-swiper-pagination{
  position: absolute;
  left: 80% !important;
  bottom: 5px !important;
  z-index: 9;
}
.idm-banner-my-bullet{
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 0;
  transform: rotate(45deg);
  background-color: #1D335E;
  margin: 0 3px;
}
.idm-banner-my-bullet-active{
  background-color:  #fff !important;
}
</style>
<style lang="scss" scoped>
li {
  display: inline-block;
  float: left;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
