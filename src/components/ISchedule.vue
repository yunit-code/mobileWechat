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
    <div class="i-schedule-header">
      <div class="i-schedule-header-main">
        <div class="i-schedule-header-tit">
          {{ propData.title || '日程提醒' }}
          <svg
            class="idm_filed_svg_icon"
            aria-hidden="true"
          >
            <use :xlink:href="`#${(propData.titleIcon && propData.titleIcon[0])}`"></use>
          </svg>
        </div>
        <div class="i-schedule-header-date">{{ nowDate }}</div>
      </div>
      <div class="i-schedule-header-more">更多></div>
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
              <span v-else class="date-num" :class="{ active: currentClassStatus(i, j) }">{{
                k.showDate
              }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="i-schedule-content-note">
        <div class="i-schedule-content-note-left">
          <p class="active">9:00</p>
          <p>11:00</p>
        </div>
        <div class="i-schedule-content-note-right">
          <div class="schedule-item">
            <div class="schedule-item-name">部门小组早例会</div>
            <div class="schedule-item-addr">A12会议室</div>
            <div class="schedule-item-time">9:00-9:30</div>
          </div>
          <div class="schedule-item">
            <div class="schedule-item-name">参加信息中心季度总结会</div>
            <div class="schedule-item-addr">2楼大会议室</div>
            <div class="schedule-item-time">10:00-12:00</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
import "swiper/css/swiper.min.css";

export default {
  name: "ISchedule",
  components: {},
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      listData: [],
      nowDate: this.setNowDate(new Date()),
      currentIndex: new Date().getDay() - 1,
      currentList: [],
    };
  },
  props: {},
  created() {
    
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();

    this.init();
    // if (this.moduleObject.env == "develop") {
    //开发模式下给例子数据
    this.listData = [];
    // }
  },
  mounted() {
    this.initSwiper();
  },
  destroyed() {},
  methods: {
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      var styleObject = {};
      var titleStyleObject = {};
      var innerCardStyleObject = {};
      var iconStyleObject = {};
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
          console.log(key,"key",element)
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key] = element;
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
                innerCardStyleObject["margin-right"] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                innerCardStyleObject["margin-bottom"] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                innerCardStyleObject["margin-left"] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                innerCardStyleObject["padding-top"] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                innerCardStyleObject["padding-right"] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                innerCardStyleObject["padding-bottom"] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                innerCardStyleObject["padding-left"] = `${element.paddingLeftVal}`;
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
                innerCardStyleObject["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  innerCardStyleObject["border-top-color"] =
                    element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                innerCardStyleObject["border-right-width"] =
                  element.border.right.width + element.border.right.widthUnit;
                innerCardStyleObject["border-right-style"] = element.border.right.style;
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
                innerCardStyleObject["border-left-style"] = element.border.left.style;
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
            case "titleColor":
              iconStyleObject["color"] = element.titleColor;
              break
            case "titleSize":
              iconStyleObject["font-size"] = element.titleSize;
              break
          }
        }
      }
      // if(key == "titleFont")
      console.log(titleStyleObject,"标题")
      console.log(innerCardStyleObject,"内层")
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .i-schedule-header-tit", titleStyleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .i-schedule-content", innerCardStyleObject);
      // this.initData();
    },
    /**
     * 格式化当前时间
     */
    setNowDate(nowDate) {
      let year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1;
      let date = nowDate.getDate();
      return `${year}年${month}月${date}日`;
    },
    /**
     * 初始化
     */
    init() {
      let now = this.setDate(new Date());
      let pre = this.setDate(this.addDate(this.currentFirstDate, -7));
      let next = this.setDate(this.addDate(this.currentFirstDate, 14));
      this.currentList = [pre, now, next];
    },
    /**
     * 初始化滑块
     */
    initSwiper() {
      var mySwiper = new Swiper(".swiper-container", {
        on: {
          slidePrevTransitionStart: () => {},
          slidePrevTransitionEnd: () => {
            mySwiper.slideTo(1, 0, false);
            let pre = this.setDate(this.addDate(this.currentFirstDate, -21)); //11
            let now = this.setDate(this.addDate(this.currentFirstDate, 7)); //18
            let next = this.setDate(this.addDate(this.currentFirstDate, 7)); //25
            this.currentList = [pre, now, next];
            setTimeout(() => {
              this.currentIndex = 0;
              this.nowDate = this.currentList[1][0].sendDate;
            }, 20);
          },
          slideNextTransitionStart: () => {},
          slideNextTransitionEnd: () => {
            mySwiper.slideTo(1, 0, false);
            let pre = this.setDate(this.addDate(this.currentFirstDate, -7)); //18
            let now = this.setDate(this.addDate(this.currentFirstDate, 7)); //25
            let next = this.setDate(this.addDate(this.currentFirstDate, 7)); //32
            this.currentList = [pre, now, next];
            setTimeout(() => {
              this.currentIndex = 6;
              this.nowDate = this.currentList[1][6].sendDate;
            }, 20);
          },
        },
      });
      mySwiper.slideTo(1, 0, false);
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
  },
};
</script>
<style scoped lang="scss">
* {
  padding: 0;
  margin: 0;
  list-style: none;
}
.i-schedule-outer {
  width: auto;
  box-sizing: border-box;
  padding: 14px 10px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;

  .i-schedule-header {
    display: flex;
    height: 40px;
    line-height: 40px;
    justify-content: space-between;

    .i-schedule-header-main {
      display: flex;
      .i-schedule-header-tit {
        // font-weight: 700;
        margin-left: 6px;

        .idm_filed_svg_icon {
          font-size: 14px;
          max-height: 14px;
          width: 14px;
          fill: currentColor;
          vertical-align: -0.15em;
          // margin-right: 3px;
          outline: none;
        }
      }
      .i-schedule-header-date {
        margin-left: 10px;
      }
    }

    .i-schedule-header-more {
      opacity: 0.5;
    }
  }

  .i-schedule-content {
    background-color: #fff;
    border-radius: 10px;
    padding: 10px 14px;

    .i-schedule-content-calendar.swiper-container {
      position: relative;
      overflow: hidden;
      .swiper-wrapper {
        height: 68px;
        .swiper-slide {
          padding: 10px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          background-color: transparent;

          li {
            color: #333;
            font-size: 14px;
            text-align: center;
            width: 25px;
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
              font-size: 14px;
              opacity: 0.6;
            }

            span {
              margin-top: 5px;
              display: inline-block;
            }

            .date-num.active {
              width: 18px;
              height: 18px;
              line-height: 18px;
              text-align: center;
              background: #4d7eff;
              color: #ffffff;
              border-radius: 50%;
              font-size: 14px;
            }

            .today {
              display: inline-block;
              margin-top: 6px;
              transform: scale(1.5);

              &.active {
                color: #4d7eff;
              }
            }
          }
        }
      }
    }

    .i-schedule-content-note {
      border-top: 1px solid #eee;
      display: flex;
      min-height: 20vh;
      padding-top: 14px;

      .i-schedule-content-note-left {
        flex: 4;

        p {
          position: relative;
          height: 100px;

          &.active::before {
            content: "";
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #4d7eff;
            position: absolute;
            top: 0;
            right: 0;
            transform: translateX(50%);
          }
        }
      }

      .i-schedule-content-note-right {
        flex: 10;
        border-left: 1px solid #eee;
        padding-left: 14px;
        overflow:hidden;

        .schedule-item {
          position: relative;
          height: 100px;
          padding: 0 10px 10px;
          
          

          &>div {
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }

          .schedule-item-name {
            color: #000;
            padding-bottom: 8px;
          }
          .schedule-item-addr {
            color: #666;
          }
          .schedule-item-time {
            color: #aaa;
          }
        }
      }
    }
  }
}
</style>