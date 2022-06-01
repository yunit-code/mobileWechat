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
    class="i-schedule-outer"
  >
    <div class="i-schedule-header" v-if="propData.isShowTitleBar === undefined ? true : propData.isShowTitleBar">
      <div class="i-schedule-header-main">
        <div class="i-schedule-header-tit">
          <span>{{ propData.title || "日程提醒" }}</span>
          <template v-if="propData.showIcon === undefined ? true : propData.showIcon">
            <svg
              v-if="propData.titleIcon && propData.titleIcon.length > 0"
              class="idm_filed_svg_icon"
              aria-hidden="true"
            >
              <use
                :xlink:href="`#${propData.titleIcon && propData.titleIcon[0]}`"
              ></use>
            </svg>
            <svg-icon v-else icon-class="application-icon" />
          </template>
        </div>
        <div class="i-schedule-header-date">{{ nowDate }}</div>
      </div>
      <div
        class="i-schedule-header-more"
        v-if="propData.moreBtn === undefined ? true : propData.moreBtn"
        @click="moreClick"
      >
        更多>
      </div>
    </div>
    <div class="i-schedule-content">
      <div class="i-schedule-content-calendar swiper-container">
        <div class="swiper-wrapper">
          <ul
            class="swiper-slide"
            v-for="(item, i) in currentList"
            :key="`week-${i}`"
            ref="ul"
          >
            <li
              v-for="(k, j) in item"
              @click="setCurrent(j, k.sendDate)"
              :key="`date-${j}`"
              :class="{ holiday: k.week === '六' || k.week === '日' }"
            >
              <p>{{ k.week }}</p>
              <svg-icon
                v-if="k.now"
                class="today"
                :class="{ active: currentClassStatus(i, j) }"
                icon-class="ischedule-today"
              />
              <span
                v-else
                class="date-num"
                :class="{ active: currentClassStatus(i, j) }"
                >{{ k.showDate }}</span
              >
            </li>
          </ul>
        </div>
      </div>
      <van-loading v-if="isLoading" size="24px" vertical>加载中...</van-loading>
      <div class="i-schedule-content-note" v-if="!isLoading">
        <a-tabs v-model="nowDate" :animated="false">
          <a-tab-pane
            :tab="item.realDate"
            v-for="item in scheduleList"
            :key="item.sendDate"
          >
            <div class="i-schedule-content-note-inner">
              <div class="i-schedule-content-note-left">
                <p
                  v-for="(time, i) in item.schedule"
                  :key="`time-${i}`"
                  :class="{ active: isTimeRange(time.startTime.split(' ')[0],time.timeRange) }"
                >
                  {{ time.startTime.split(" ")[1] }}
                </p>
              </div>
              <div class="i-schedule-content-note-right">
                <div
                  class="schedule-item"
                  v-for="(desc, i) in item.schedule"
                  :key="`desc-${i}`"
                  @click="detailClick(desc.jumpUrl)"
                >
                  <div class="schedule-item-name">{{ desc.title }}</div>
                  <div class="schedule-item-addr">{{ desc.address }}</div>
                  <div class="schedule-item-time">{{ desc.timeRange }}</div>
                </div>
              </div>
            </div>
            <van-empty
              v-if="
                !item.schedule || (item.schedule && item.schedule.length == 0)
              "
              :image-size="emptyImageSize"
              :description="propData.emptyDescription || '暂无日程'"
            />
          </a-tab-pane>
        </a-tabs>
        <van-empty
          v-if="!scheduleList || scheduleList.length == 0"
          :image-size="emptyImageSize"
          :description="propData.emptyDescription || '暂无日程'"
        />
      </div>
    </div>
    <div class="i-schedule-mask" v-if="moduleObject.env !== 'production' && !propData.dataSource">
      <span>！未绑定数据源</span>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
import { Empty, Loading } from "vant";
import "vant/lib/empty/style";
import "vant/lib/loading/style";
export default {
  name: "ISchedule",
  components: {
    [Empty.name]: Empty,
    [Loading.name]: Loading,
  },
  data() {
    return {
      isLoading: true,
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      nowDate: this.setNowDate(new Date(), "年月日"),
      currentIndex: new Date().getDay() - 1,
      currentList: [],
      scheduleList: [],
      pageScale:1,
      mySwiper:null
    };
  },
  props: {},
  computed:{
    emptyImageSize(){
      let width = ""
      if(this.propData.emptyImageSize){
        width = this.propData.emptyImageSize.inputVal + this.propData.emptyImageSize.selectVal
      }else{
        width = (this.getScale() * 70) + "px"
      }
      return width
    }
  },
  created() {
    alert("日程组件加载开始...");
    this.moduleObject = this.$root.moduleObject;
    this.convertThemeListAttrToStyleObject();
    this.convertAttrToStyleObject();

    this.init();
  },
  mounted() {
    this.initSwiper();
  },
  destroyed() {},
  methods: {
    /**
     * 组件通信：接收消息的方法
     */
    receiveBroadcastMessage(messageObject) {
      switch(messageObject.type) {
        case 'websocket':
          if(this.propData.messageRefreshKey && messageObject.message){
            const messageData = typeof messageObject.message === 'string' && JSON.parse(messageObject.message) || messageObject.message
            const arr = Array.isArray(this.propData.messageRefreshKey) ? this.propData.messageRefreshKey : [this.propData.messageRefreshKey]
            if(messageData.badgeType && arr.includes(messageData.badgeType)){
              this.requsetList();
            }
          }
          break;
        case 'linkageReload':
          alert("日程组件监听到linkageReload");
          this.isLoading = true;
          this.mySwiper.destroy();
          this.mySwiper = null;
          this.nowDate = this.setNowDate(new Date(), "年月日");
          this.currentIndex = new Date().getDay() - 1;
          this.init()
          this.initSwiper();
          break;
        case 'pageResize':
          this.convertAttrToStyleObject(messageObject.message);
          break;
      }
    },
    /**
     * 适配页面
     */
    getScale(pageWidth){
      const base = this.propData.baseValue || 414
      const ratio = this.propData.adaptationRatio || 1.2
      const width = this.moduleObject.env ===  "production" ? window.innerWidth : pageWidth || 414
      return (width / base - 1) * (ratio - 1) + 1
    },
    /**
     * 初始化数据
     */
    initData() {
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        setTimeout(() => {
          const today = this.setNowDate(new Date());
          const mock = {
            value: [
              {
                date: today,
                schedule: [
                  {
                    startTime: today + " 09:00",
                    timeRange: "16:00-18:30",
                    address: "第一会议室",
                    title: "XXX会议",
                    jumpUrl: "打开详情地址",
                  },
                ],
              }
            ],
            moreUrl: "更多跳转地址",
          };
          this.dealRes(mock);
          this.isLoading = false;
        }, 1000);
      } else if (this.moduleObject.env === "production") {
        this.requsetList();
      }
    },
    /**
     * 请求数据
     */
    requsetList() {
      let dataSource = this.propData.dataSource
      if (!dataSource) {
        this.isLoading = false;
        return;
      }
      const startDate = this.currentList[0][0].realDate;
      const endDate = this.currentList[2][this.currentList[2].length - 1]
        .realDate;
      let url = `ctrl/dataSource/getDatas`;
      IDM.http
        .post(url, {
          id:dataSource.value,
          startDate,
          endDate,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
        .done((res) => {
          console.log(res, "接口数据");
          if (res.code === "200") {
            this.dealRes(res);
          } else {
            this.failRequest(url);
          }
          this.isLoading = false;
        })
        .error((response) => {
          this.failRequest(url);
          this.isLoading = false;
        });
    },
    /**
     * 处理返回结果
     */
    dealRes(res) {
      let data = res;
      if(this.moduleObject.env === "production") {
        data = this.propData.dataFiled ? this.getExpressData("dataName",this.propData.dataFiled,res) : res;
      }
      // 更多按钮地址
      if (data.moreUrl) {
        this.propData.moreUrl = this.propData.moreUrl
          ? this.propData.moreUrl
          : res.moreUrl;
      }
      // 日程列表
      const scheduleList = [];
      if (data.value.length > 0) {
        this.currentList.forEach((week) => {
          week.forEach((date) => {
            scheduleList.push(date);
            data.value.forEach((item) => {
              if (item.date === date.realDate) {
                date.schedule = item.schedule;
              }
            });
          });
        });
      }
      this.scheduleList = scheduleList;
    },
    /**
     * 请求失败
     */
    failRequest(url) {
      console.log(url + "请求失败");
    },
    /**
     * 日程详情
     */
    detailClick(url) {
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        return;
      }
      window.open(url, this.propData.detailTarget);
    },
    /**
     * 时间范围
     */
    isTimeRange(date,range) {
      // 如果不是今天 跳出
      if(date !== this.setNowDate(new Date())){
        return false
      }
      const beginTime = range.split("-")[0];
      const endTime = range.split("-")[1];
      var strb = beginTime.split(":");
      if (strb.length != 2) {
        return false;
      }

      var stre = endTime.split(":");
      if (stre.length != 2) {
        return false;
      }

      var b = new Date();
      var e = new Date();
      var n = new Date();

      b.setHours(strb[0]);
      b.setMinutes(strb[1]);
      e.setHours(stre[0]);
      e.setMinutes(stre[1]);

      return n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0;
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertThemeListAttrToStyleObject();
      this.convertAttrToStyleObject();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(pageSize={}) {
      
      var styleObject = {};
      var titleStyleObject = {};
      var innerCardStyleObject = {};
      var iconStyleObject = {};
      var emptyStyleObject = {};

      const scale  = this.getScale(pageSize.width);
      styleObject['--i-schedule-scale'] = scale

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
      if (this.propData.innerBgSize && this.propData.innerBgSize == "custom") {
        innerCardStyleObject["background-size"] =
          (this.propData.innerBgSizeWidth
            ? this.propData.innerBgSizeWidth.inputVal +
              this.propData.innerBgSizeWidth.selectVal
            : "auto") +
          " " +
          (this.propData.innerBgSizeHeight
            ? this.propData.innerBgSizeHeight.inputVal +
              this.propData.innerBgSizeHeight.selectVal
            : "auto");
      } else if (this.propData.innerBgSize) {
        innerCardStyleObject["background-size"] = this.propData.innerBgSize;
      }

      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject["background-position-x"] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (
        this.propData.innerPositionX &&
        this.propData.innerPositionX.inputVal
      ) {
        innerCardStyleObject["background-position-x"] =
          this.propData.innerPositionX.inputVal +
          this.propData.innerPositionX.selectVal;
      }

      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject["background-position-y"] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      if (
        this.propData.innerPositionY &&
        this.propData.innerPositionY.inputVal
      ) {
        innerCardStyleObject["background-position-y"] =
          this.propData.innerPositionY.inputVal +
          this.propData.innerPositionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key] = element;
              break;
            case "innerWidth":
              innerCardStyleObject['width'] = element;
              break
            case "innerHeight":
              innerCardStyleObject['height'] = element;
              break;
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] = element.hex8;
              }
              break;
            case "innerBgColor":
              if (element && element.hex8) {
                innerCardStyleObject["background-color"] = element.hex8;
              }
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
            case "innerBox":
              if (element.marginTopVal) {
                innerCardStyleObject["margin-top"] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                innerCardStyleObject[
                  "margin-right"
                ] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                innerCardStyleObject[
                  "margin-bottom"
                ] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                innerCardStyleObject[
                  "margin-left"
                ] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                innerCardStyleObject[
                  "padding-top"
                ] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                innerCardStyleObject[
                  "padding-right"
                ] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                innerCardStyleObject[
                  "padding-bottom"
                ] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                innerCardStyleObject[
                  "padding-left"
                ] = `${element.paddingLeftVal}`;
              }
              break;
            case "emptyBox":
              if (element.marginTopVal) {
                emptyStyleObject["margin-top"] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                emptyStyleObject["margin-right"] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                emptyStyleObject["margin-bottom"] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                emptyStyleObject["margin-left"] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                emptyStyleObject["padding-top"] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                emptyStyleObject["padding-right"] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                emptyStyleObject["padding-bottom"] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                emptyStyleObject["padding-left"] = `${element.paddingLeftVal}`;
              }
              break;
            case "bgImgUrl":
              styleObject[
                "background-image"
              ] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "innerBgImgUrl":
              innerCardStyleObject[
                "background-image"
              ] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移
              styleObject["background-position-x"] = element;
              break;
            case "innerPositionX":
              //背景横向偏移
              innerCardStyleObject["background-position-x"] = element;
              break;
            case "positionY":
              //背景纵向偏移
              styleObject["background-position-y"] = element;
              break;
            case "innerPositionY":
              //背景纵向偏移
              innerCardStyleObject["background-position-y"] = element;
              break;
            case "bgRepeat":
              //平铺模式
              styleObject["background-repeat"] = element;
              break;
            case "innerBgRepeat":
              //平铺模式
              innerCardStyleObject["background-repeat"] = element;
              break;
            case "bgAttachment":
              //背景模式
              styleObject["background-attachment"] = element;
              break;
            case "innerBgAttachment":
              //背景模式
              innerCardStyleObject["background-attachment"] = element;
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
            case "innerBorder":
              if (element.border.top.width > 0) {
                innerCardStyleObject["border-top-width"] =
                  element.border.top.width + element.border.top.widthUnit;
                innerCardStyleObject["border-top-style"] =
                  element.border.top.style;
                if (element.border.top.colors.hex8) {
                  innerCardStyleObject["border-top-color"] =
                    element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                innerCardStyleObject["border-right-width"] =
                  element.border.right.width + element.border.right.widthUnit;
                innerCardStyleObject["border-right-style"] =
                  element.border.right.style;
                if (element.border.right.colors.hex8) {
                  innerCardStyleObject["border-right-color"] =
                    element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                innerCardStyleObject["border-bottom-width"] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                innerCardStyleObject["border-bottom-style"] =
                  element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  innerCardStyleObject["border-bottom-color"] =
                    element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                innerCardStyleObject["border-left-width"] =
                  element.border.left.width + element.border.left.widthUnit;
                innerCardStyleObject["border-left-style"] =
                  element.border.left.style;
                if (element.border.left.colors.hex8) {
                  innerCardStyleObject["border-left-color"] =
                    element.border.left.colors.hex8;
                }
              }

              innerCardStyleObject["border-top-left-radius"] =
                element.radius.leftTop.radius +
                element.radius.leftTop.radiusUnit;
              innerCardStyleObject["border-top-right-radius"] =
                element.radius.rightTop.radius +
                element.radius.rightTop.radiusUnit;
              innerCardStyleObject["border-bottom-left-radius"] =
                element.radius.leftBottom.radius +
                element.radius.leftBottom.radiusUnit;
              innerCardStyleObject["border-bottom-right-radius"] =
                element.radius.rightBottom.radius +
                element.radius.rightBottom.radiusUnit;
              break;
            case "font":
              styleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject["color"] = element.fontColors.hex8;
              }
              styleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              styleObject["font-style"] = element.fontStyle;
              styleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              styleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              styleObject["text-align"] = element.fontTextAlign;
              styleObject["text-decoration"] = element.fontDecoration;
              break;
            case "titleFont":
              titleStyleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                titleStyleObject["color"] = element.fontColors.hex8;
              }
              titleStyleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              titleStyleObject["font-style"] = element.fontStyle;
              titleStyleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              titleStyleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              titleStyleObject["text-align"] = element.fontTextAlign;
              titleStyleObject["text-decoration"] = element.fontDecoration;
              break;
            case "titleIconColor":
              iconStyleObject["fill"] = element.hex8 + '!important';
              break;
            case "titleIconSize":
              iconStyleObject["font-size"] = (element * scale) + "px";
              iconStyleObject["width"] = (element * scale) + "px";
              iconStyleObject["height"] = (element * scale) + "px";
              break;
            case "titleIconPosition":
              titleStyleObject["flex-direction"] = element === "right" ? 'row' : 'row-reverse'
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .i-schedule-header-tit",
        titleStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .i-schedule-content",
        innerCardStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .i-schedule-header-tit .idm_filed_svg_icon",
        iconStyleObject
      );
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .van-empty", emptyStyleObject);
      // this.initData();
    },
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject() {
      const themeList = this.propData.themeList;
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
        
        let dateNumStyleObject = {
          "background-color": item.mainColor ? item.mainColor.hex8 : "",
        };
        let todayStyleObject = {
          "color": item.mainColor ? item.mainColor.hex8 : "",
        };
        let titleSvgStyleObject = {
          "fill": item.mainColor ? item.mainColor.hex8 : "",
        };

        console.log("." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .i-schedule-header-tit svg")

        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .i-schedule-header-tit svg",
          titleSvgStyleObject
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .swiper-wrapper .swiper-slide li .date-num.active",
          dateNumStyleObject
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .swiper-wrapper .swiper-slide li .today.active",
          todayStyleObject
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .i-schedule-content-note-left p.active::before",
          dateNumStyleObject
        );
      }
    },
    /**
     * 格式化当前时间
     */
    setNowDate(nowDate, sub = "-") {
      let year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1;
      let date = nowDate.getDate();
      let str = "";
      if (sub === "年月日") {
        str = `${year}年${month}月${date}日`;
      } else {
        str = `${year}${sub}${month > 9 ? month : "0" + month}${sub}${
          date > 9 ? date : "0" + date
        }`;
      }
      return str;
    },
    /**
     * 初始化
     */
    init() {
      let now = this.setDate(new Date());
      let pre = this.setDate(this.addDate(this.currentFirstDate, -7));
      let next = this.setDate(this.addDate(this.currentFirstDate, 14));
      this.currentList = [pre, now, next];
      this.initData();
    },
    /**
     * 初始化滑块
     */
    initSwiper() {
      this.mySwiper = new Swiper(".swiper-container", {
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        on: {
          slidePrevTransitionStart: () => {},
          slidePrevTransitionEnd: () => {
            this.mySwiper.slideTo(1, 0, false);
            let pre = this.setDate(this.addDate(this.currentFirstDate, -21)); //11
            let now = this.setDate(this.addDate(this.currentFirstDate, 7)); //18
            let next = this.setDate(this.addDate(this.currentFirstDate, 7)); //25
            this.currentList = [pre, now, next];
            setTimeout(() => {
              this.currentIndex = 0;
              this.nowDate = this.currentList[1][0].sendDate;
            }, 20);
            this.initData();
          },
          slideNextTransitionStart: () => {},
          slideNextTransitionEnd: () => {
            this.mySwiper.slideTo(1, 0, false);
            let pre = this.setDate(this.addDate(this.currentFirstDate, -7)); //18
            let now = this.setDate(this.addDate(this.currentFirstDate, 7)); //25
            let next = this.setDate(this.addDate(this.currentFirstDate, 7)); //32
            this.currentList = [pre, now, next];
            setTimeout(() => {
              this.currentIndex = 6;
              this.nowDate = this.currentList[1][6].sendDate;
            }, 20);
            this.initData();
          },
        },
      });
      this.mySwiper.slideTo(1, 0, false);
    },
    /**
     *
     */
    addDate(date, n) {
      date.setDate(date.getDate() + n);
      return date;
    },
    /**
     * 计算出一周的日期
     */
    setDate(date) {
      let week = date.getDay() === 0 ? 7 : date.getDay();
      date = this.addDate(date, 1 - week);
      this.currentFirstDate = new Date(date);
      let list = [];
      for (let i = 0; i < 7; i++) {
        list.push(
          this.formatDate(
            i === 0 ? this.addDate(date, 0) : this.addDate(date, 1)
          )
        );
      }
      return list;
    },
    /**
     *
     */
    formatDate(nowDate) {
      let year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1;
      let date = nowDate.getDate();
      let week = ["日", "一", "二", "三", "四", "五", "六"][nowDate.getDay()];
      return {
        week,
        showDate: date,
        listDate: `${month}月${date}日 ${week}`,
        sendDate: `${year}年${month}月${date}日`,
        realDate: `${year}-${month > 9 ? month : "0" + month}-${
          date > 9 ? date : "0" + date
        }`,
        now: nowDate.toLocaleDateString() === new Date().toLocaleDateString(),
      };
    },
    /**
     *
     */
    setCurrent(j, sendDate) {
      this.currentIndex = j;
      this.nowDate = sendDate;
    },
    /**
     *
     */
    currentClassStatus(i, j) {
      return i === 1 && j === this.currentIndex;
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
      
      return _defaultVal;
    },
    /**
     * 更多按钮跳转
     */
    moreClick() {
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        return;
      }
      window.open(this.propData.moreUrl, this.propData.moreTarget);
    },
  },
};
</script>
<style scoped lang="scss">
$scale: var(--i-schedule-scale);
.i-schedule-outer {
  width: auto;
  box-sizing: border-box;
  padding: 10px;
  font-family: PingFangSC-Regular;
  color: #333333;
  background-color: #fff;
  position: relative;
  font-size: calc(14px * #{ $scale });
  ul,
  li {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .i-schedule-header {
    display: flex;
    height: calc(40px * #{ $scale });
    line-height: calc(40px * #{ $scale });
    justify-content: space-between;

    .i-schedule-header-main {
      display: flex;
      .i-schedule-header-tit {
        font-family: PingFangSC-Regular;
        color: #333333;
        font-style: normal;
        text-decoration: none;
        display: flex;
        align-items: center;
        flex-direction: row;
        font-size: calc(16px * #{ $scale });

        .idm_filed_svg_icon {
          font-size: calc(14px * #{ $scale });
          width: calc(14px * #{ $scale });
          fill: currentColor;
          vertical-align: -0.15em;
          outline: none;
        }
      }
      .i-schedule-header-date {
        margin-left: calc(10px * #{ $scale });
      }
    }

    .i-schedule-header-more {
      opacity: 0.5;
    }
  }

  .i-schedule-content {
    background-color: #fff;
    border-radius: calc(10px * #{ $scale });
    padding: calc(10px * #{ $scale }) calc(14px * #{ $scale });

    ::v-deep .van-loading {
      min-height: calc(186px * #{ $scale });
      justify-content: center;
    }

    .i-schedule-content-calendar.swiper-container {
      position: relative;
      overflow: hidden;
      .swiper-wrapper {
        height: calc(68px * #{ $scale });
        .swiper-slide {
          padding: calc(10px * #{ $scale });
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          background-color: transparent;

          li {
            font-size: calc(14px * #{ $scale });
            text-align: center;
            width: calc(25px * #{ $scale });
            &.holiday {
              p {
                opacity: 0.5;
              }
              span {
                opacity: 0.5;
              }
              .active {
                opacity: 1;
              }
            }

            p {
              font-size: calc(14px * #{ $scale });
              opacity: 0.6;
            }

            span {
              margin-top: calc(5px * #{ $scale });
              display: inline-block;
            }

            .date-num.active {
              width: calc(18px * #{ $scale });
              height: calc(18px * #{ $scale });
              line-height: calc(18px * #{ $scale });
              text-align: center;
              background: #1890FF;
              color: #ffffff;
              border-radius: 50%;
              font-size: calc(14px * #{ $scale });
            }

            .today {
              display: inline-block;
              margin-top: calc(6px * #{ $scale });
              transform: scale(1.5);

              &.active {
                color: #1890FF;
              }
            }
          }
        }
      }
    }

    .i-schedule-content-note {
      border-top: calc(1px * #{ $scale }) solid #eee;
      padding-top: calc(14px * #{ $scale });
      min-height: 20vh;
      
      ::v-deep .ant-tabs {
        color: currentColor;
        font-size: inherit;

        .ant-tabs-bar {
          display: none;
        }
      }
      
      .i-schedule-content-note-inner {
        display: flex;

        .i-schedule-content-note-left {
          flex: 4;

          p {
            position: relative;
            height: calc(100px * #{ $scale });

            &.active::before {
              content: "";
              width: calc(5px * #{ $scale });
              height: calc(5px * #{ $scale });
              border-radius: 50%;
              background-color: #1890FF;
              position: absolute;
              top: 0;
              right: 0;
              transform: translateX(50%);
            }
          }
        }

        .i-schedule-content-note-right {
          flex: 10;
          border-left: calc(1px * #{ $scale }) solid #eee;
          padding-left: calc(14px * #{ $scale });
          overflow: hidden;

          .schedule-item {
            position: relative;
            height: calc(100px * #{ $scale });
            padding: 0 calc(10px * #{ $scale }) calc(10px * #{ $scale });

            & > div {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .schedule-item-name {
              padding-bottom: calc(8px * #{ $scale });
            }
            .schedule-item-addr {
              opacity: .8;
            }
            .schedule-item-time {
              opacity: .6;
            }
          }
        }
      }
    }
  }

  .i-schedule-mask {
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
      padding: calc(6px * #{ $scale }) calc(20px * #{ $scale });;
      color: #e6a23c;
      background: #fdf6ec;
      border:calc(1px * #{ $scale }) solid #f5dab1;
      border-radius: calc(4px * #{ $scale });;
    }
  }

  ::v-deep .van-empty {
    padding: 0;
  }

  ::v-deep .van-empty__description {
    font-size: inherit;
  }
}
</style>
