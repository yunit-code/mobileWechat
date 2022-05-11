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
  >
    <div class="i-sort-outer">
      <draggable
        handle=".i-sort-item-handle"
        v-model="listData"
        animation="200"
        @end="dragEnd"
      >
        <div
          class="i-sort-item"
          v-for="(item, index) in listData"
          :key="`sort-${index}`"
        >
          <div class="i-sort-item-handle">
            <svg-icon icon-class="isort-drag" />
          </div>
          <div class="i-sort-item-name">{{ item.comName }}</div>
          <div class="i-sort-item-operation">
            <span @click="toppingClick(index)">
              <svg-icon v-show="index !== 0" icon-class="isort-topping" />
            </span>
            <span @click="visibleClick(item)">
              <svg-icon
                :icon-class="!item.hidden ? 'isort-visible' : 'isort-invisible'"
              />
            </span>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
export default {
  name: "ISort",
  components: {
    Draggable,
  },
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      listData: [],
      pageInfo: {},
      pageId: "",
      pageVersion: "",
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
    
    if (!this.moduleObject.env || this.moduleObject.env === "develop") {
      //开发模式下给例子数据
      this.listData = [
        {
          comId: "1",
          comName: "广告轮播",
          hidden: false,
        },
        {
          comId: "2",
          comName: "统一待办",
          hidden: false,
        },
        {
          comId: "3",
          comName: "待办列表",
          hidden: false,
        },
        {
          comId: "4",
          comName: "应用中心",
          hidden: false,
        },
        {
          comId: "5",
          comName: "信息列表",
          hidden: false,
        },
      ];
    }
    if(this.moduleObject.env ===  "production"){
      this.requestUserCustomization()
    }
  },
  mounted() {},
  destroyed() {},
  methods: {
    /**
     * 请求失败
     */
    failRequest(url) {
      console.log(url + "请求失败");
    },
    /**
     * 取用户定制化数据
     */
    requestUserCustomization() {
      const url = IDM.express.replace(
        this.propData.userCustomizationUrl,
        {},
        true
      );
      IDM.http
        .get(url)
        .done((res) => {
          if (res.code === "200") {
            const list =
              res.data.page &&
              res.data.page.layout &&
              res.data.page.layout.children;
            if (list && list.length > 0) {
              this.dealRes(res, list);
            } else {
              this.requestDefaultCustomization();
            }
          } else {
            this.failRequest(url);
          }
        })
        .error((response) => {
          this.failRequest(url);
        });
    },
    /**
     * 取页面默认数据
     */
    requestDefaultCustomization() {
      const url = IDM.express.replace(this.propData.componentListUrl, {}, true);
      IDM.http
        .get(url)
        .done((res) => {
          if (res.code === "200") {
            const list =
              res.data.page && res.data.page.layout && res.data.page.children;
            this.dealRes(res, list);
          } else {
            this.failRequest(url);
          }
        })
        .error((response) => {
          this.failRequest(url);
        });
    },
    /**
     * 处理返回列表数据
     */
    dealRes(res, list) {
      // 保存页面信息
      this.pageId = res.data.id;
      this.pageVersion = res.data.pageBaseInfo.version;
      this.pageInfo = {
        comName: res.data.page.layout.comName,
        id: res.data.page.layout.id,
      };
      // 添加隐藏数据
      list.forEach((item) => {
        if (item.hidden === undefined) item.hidden = false;
      });
      // 保存列表信息
      this.listData = list;
    },
    /**
     * 拖拽结束
     */
    dragEnd() {
      const { id, comName } = this.pageInfo;
      const customData = {
        id,
        comName,
        children: this.listData,
      };
      IDM.http
        .post(this.propData.saveUserCustomizationUrl, {
          pageid: this.pageId,
          version: this.pageVersion,
          customData: JSON.stringify(customData),
        })
        .done((res) => {
          if (res !== "200") {
            this.failRequest(this.propData.saveUserCustomizationUrl);
          }
        })
        .error((response) => {
          this.failRequest(this.propData.saveUserCustomizationUrl);
        });
    },
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
            case "height":
              styleObject[key] = element;
              break;
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] = element.hex8;
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
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      // this.initData();
    },
    /**
     * 置顶
     */
    toppingClick(index) {
      this.listData.unshift(this.listData.splice(index, 1)[0]);
    },
    /**
     * 	是否可见
     */
    visibleClick(item) {
      item.hidden = !item.hidden;
    },
  },
};
</script>
<style scoped lang="scss">
.i-sort-outer {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 10px;

  .i-sort-item {
    display: flex;
    height: 50px;
    line-height: 50px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #333333;
    margin-bottom: 14px;
    border-radius: 10px;
    background-color: #fff;

    .i-sort-item-handle {
      width: 40px;
      height: 100%;
      text-align: center;
    }

    .i-sort-item-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .i-sort-item-operation {
      width: 80px;
      height: 100%;
      text-align: center;
      display: flex;
      justify-content: center;

      span {
        display: inline-block;
        height: 100%;
        width: 30px;
      }
    }
  }
}
</style>