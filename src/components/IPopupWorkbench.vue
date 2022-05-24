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
    class="idm_popupWorkbench_box"
  >
    <div
      v-show="!visible && menuList.length > 1 || moduleObject.env === 'develop'"
      :class="
        this.propData.position === 'left'
          ? 'hover_button hover_button_left'
          : 'hover_button hover_button_right'
      "
      :style="
        moduleObject.env === 'develop' && {
          position: 'static'
        }
      "
      @click="handleVisible"
    >
      <svg
        v-if="propData.openIcon && propData.openIcon.length > 0"
        class="idm_filed_svg_icon"
        aria-hidden="true"
      >
        <use
          :xlink:href="`#${propData.openIcon && propData.openIcon[0]}`"
        ></use>
      </svg>
      <van-icon
        v-else
        :name="this.propData.position === 'left' ? 'arrow' : 'arrow-left'"
      />
    </div>
    <van-popup
      v-if="moduleObject.env !== 'develop'"
      id="idm_popupWorkbench_popup"
      v-model="visible"
      :position="this.propData.position || 'left'"
      get-container="body"
      class="idm_popupWorkbench_popup"
      :close-on-click-overlay="this.propData.overlayClose"
      style="overflow: visible"
    >
      <div style="overflow-y: scroll; height: 100%">
        <div
          v-for="item in menuList"
          :key="item.key"
          @touchstart="addClass(item.key)"
          @touchend="removeClass()"
          :class="
            activeKey == item.key ? 'cell_box cell_box_active' : 'cell_box'
          "
        >
          <van-cell
            @click="onCellChange(item)"
            :class="selectedKey == item.key && 'cell_selected'"
          >
            <template slot="title">
              <div>
                {{
                  IDM.express.replace(
                    "@[" + propData.dataFiled + "]",
                    item,
                    true
                  )
                }}
              </div>
            </template>
          </van-cell>
        </div>

        <div
          :class="
            this.propData.position === 'left'
              ? 'hover_button hover_button_left'
              : 'hover_button hover_button_right'
          "
          @click="handleVisible"
        >
          <svg
            v-if="propData.closeIcon && propData.closeIcon.length > 0"
            class="idm_filed_svg_icon"
            aria-hidden="true"
          >
            <use
              :xlink:href="`#${propData.closeIcon && propData.closeIcon[0]}`"
            ></use>
          </svg>
          <van-icon
            v-else
            :name="this.propData.position === 'left' ? 'arrow-left' : 'arrow'"
          />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Icon, Cell } from "vant";
import "vant/lib/popup/style";
import "vant/lib/icon/style";
import "vant/lib/cell/style";
export default {
  name: "IPopupWorkbench",
  components: {
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
  },
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        position: "left",
        overlayClose: "true",
        height: "32px",
        width: "32px",
        dataFiled: "title",
        menuWidth: "80%",
        iconSize: "24px",
        themeList: [
          {
            key: "blue",
            mainColor: {
              hex8: "#3976c7ff",
            },
            minorColor: {
              hex8: "#ebedf0ff",
            },
          },
          {
            key: "red",
            mainColor: {
              hex8: "red",
            },
            minorColor: {
              hex8: "red",
            },
          },
        ],
      },
      visible: false,
      selectedKey: "",
      activeKey: "",
      // [{key: '1', pageId: '1', title: '测试用例1'}, {key: '2', pageId: '2', title: '测试用例2'}]
      menuList: [],
    };
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
    this.convertThemeListAttrToStyleObject();
    this.getMenuList();
  },
  methods: {
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
    },
    addClass(key) {
      this.activeKey = key;
    },
    removeClass() {
      this.activeKey = "";
    },
    handleVisible() {
      if (this.moduleObject.env === "develop") {
        return false;
      }
      this.visible = !this.visible;
      // this.visible && this.getMenuList();
    },
    onCellChange(item) {
      if (
        this.moduleObject.env === "develop" ||
        !this.propData.changeUrl ||
        this.selectedKey == item.key
      ) {
        return false;
      }
      const layerIndex = IDM.layer.load();
      IDM.http
        .post(this.propData.changeUrl, { pageId: item.pageId })
        .done((res) => {
          IDM.layer.close(layerIndex);
          if (res.type === "success") {
            this.selectedKey = item.key;
            const url = window.location.href;
            const jumpUrl = url.split("#")[0] + "#/preview/" + item.pageId;
            window.open(jumpUrl, this.propData.jumpStyle || "_self");
          } else {
            IDM.message.error(res.message);
          }
        })
        .error((error) => {});
    },
    getMenuList() {
      if (this.moduleObject.env === "develop" || !this.propData.dataSourceUrl) {
        return false;
      }
      const pageId =
        window.IDM.broadcast && window.IDM.broadcast.pageModule
          ? window.IDM.broadcast.pageModule.id
          : "";
      this.activeKey = "";
      this.selectedKey = pageId;
      this.menuList = [];
      // const layerIndex = IDM.layer.load();
      IDM.http
        .get(this.propData.dataSourceUrl)
        .done((res) => {
          // IDM.layer.close(layerIndex);
          if (res.type === "success") {
            this.menuList = res.data.map((item) => ({
              ...item,
              key: item.id,
              pageId: item.id,
            }));
          } else {
            IDM.message.error(res.message);
          }
        })
        .error((error) => {});
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      let btnStyleObject = {};
      let cellSelectedStyleObject = {};
      let popupStyleObject = {};
      let titleStyleObject = {};
      let iconSizeStyleObject = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case "btnTop":
              btnStyleObject["top"] = element;
              break;
            case "themeColor":
              btnStyleObject["color"] = element.hex8;
              cellSelectedStyleObject["color"] = element.hex8;
              break;
            case "bdShadow":
              popupStyleObject["box-shadow"] = element;
              btnStyleObject["box-shadow"] = element;
              break;
            case "width":
              btnStyleObject["width"] = element;
              break;
            case "height":
              btnStyleObject["height"] = element;
              break;
            case "iconSize":
              btnStyleObject["font-size"] = element;
              iconSizeStyleObject["font-size"] = element;
              iconSizeStyleObject["width"] = element;
              iconSizeStyleObject["height"] = element;
              break;
            case "fontStyle":
              if (element.fontFamily) {
                titleStyleObject["font-family"] = element.fontFamily;
              }
              if (element.fontColors.hex8) {
                titleStyleObject["color"] = element.fontColors.hex8;
              }
              if (element.fontWeight) {
                titleStyleObject["font-weight"] =
                  element.fontWeight && element.fontWeight.split(" ")[0];
              }
              if (element.fontStyle) {
                titleStyleObject["font-style"] = element.fontStyle;
              }
              if (element.fontSize) {
                titleStyleObject["font-size"] =
                  element.fontSize + element.fontSizeUnit;
              }
              if (element.fontLineHeight) {
                titleStyleObject["line-height"] =
                  element.fontLineHeight +
                  (element.fontLineHeightUnit == "-"
                    ? ""
                    : element.fontLineHeightUnit);
              }
              if (element.fontTextAlign) {
                titleStyleObject["text-align"] = element.fontTextAlign;
              }
              if (element.fontDecoration) {
                titleStyleObject["text-decoration"] = element.fontDecoration;
              }
              break;
            case "lineHeight":
              titleStyleObject["height"] = element;
              break;
            case "menuWidth":
              popupStyleObject["width"] = element;
              break;
            case "box":
              if (element.marginTopVal) {
                popupStyleObject["margin-top"] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                popupStyleObject["margin-right"] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                popupStyleObject[
                  "margin-bottom"
                ] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                popupStyleObject["margin-left"] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                popupStyleObject["padding-top"] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                popupStyleObject[
                  "padding-right"
                ] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                popupStyleObject[
                  "padding-bottom"
                ] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                popupStyleObject["padding-left"] = `${element.paddingLeftVal}`;
              }
              break;
            case "border":
              if (element.border.top.width > 0) {
                popupStyleObject["border-top-width"] =
                  element.border.top.width + element.border.top.widthUnit;
                popupStyleObject["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  popupStyleObject["border-top-color"] =
                    element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                popupStyleObject["border-right-width"] =
                  element.border.right.width + element.border.right.widthUnit;
                popupStyleObject["border-right-style"] =
                  element.border.right.style;
                if (element.border.right.colors.hex8) {
                  popupStyleObject["border-right-color"] =
                    element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                popupStyleObject["border-bottom-width"] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                popupStyleObject["border-bottom-style"] =
                  element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  popupStyleObject["border-bottom-color"] =
                    element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                popupStyleObject["border-left-width"] =
                  element.border.left.width + element.border.left.widthUnit;
                popupStyleObject["border-left-style"] =
                  element.border.left.style;
                if (element.border.left.colors.hex8) {
                  popupStyleObject["border-left-color"] =
                    element.border.left.colors.hex8;
                }
              }
              popupStyleObject["border-top-left-radius"] =
                element.radius.leftTop.radius +
                element.radius.leftTop.radiusUnit;
              popupStyleObject["border-top-right-radius"] =
                element.radius.rightTop.radius +
                element.radius.rightTop.radiusUnit;
              popupStyleObject["border-bottom-left-radius"] =
                element.radius.leftBottom.radius +
                element.radius.leftBottom.radiusUnit;
              popupStyleObject["border-bottom-right-radius"] =
                element.radius.rightBottom.radius +
                element.radius.rightBottom.radiusUnit;
              break;
            case "btnbox":
              if (element.marginTopVal) {
                btnStyleObject["margin-top"] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                btnStyleObject["margin-right"] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                btnStyleObject["margin-bottom"] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                btnStyleObject["margin-left"] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                btnStyleObject["padding-top"] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                btnStyleObject["padding-right"] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                btnStyleObject[
                  "padding-bottom"
                ] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                btnStyleObject["padding-left"] = `${element.paddingLeftVal}`;
              }
              break;
            case "btnborder":
              if (element.border.top.width > 0) {
                btnStyleObject["border-top-width"] =
                  element.border.top.width + element.border.top.widthUnit;
                btnStyleObject["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  btnStyleObject["border-top-color"] =
                    element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                btnStyleObject["border-right-width"] =
                  element.border.right.width + element.border.right.widthUnit;
                btnStyleObject["border-right-style"] =
                  element.border.right.style;
                if (element.border.right.colors.hex8) {
                  btnStyleObject["border-right-color"] =
                    element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                btnStyleObject["border-bottom-width"] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                btnStyleObject["border-bottom-style"] =
                  element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  btnStyleObject["border-bottom-color"] =
                    element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                btnStyleObject["border-left-width"] =
                  element.border.left.width + element.border.left.widthUnit;
                btnStyleObject["border-left-style"] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  btnStyleObject["border-left-color"] =
                    element.border.left.colors.hex8;
                }
              }
              btnStyleObject["border-top-left-radius"] =
                element.radius.leftTop.radius +
                element.radius.leftTop.radiusUnit;
              btnStyleObject["border-top-right-radius"] =
                element.radius.rightTop.radius +
                element.radius.rightTop.radiusUnit;
              btnStyleObject["border-bottom-left-radius"] =
                element.radius.leftBottom.radius +
                element.radius.leftBottom.radiusUnit;
              btnStyleObject["border-bottom-right-radius"] =
                element.radius.rightBottom.radius +
                element.radius.rightBottom.radiusUnit;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .hover_button",
        btnStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .hover_button .idm_filed_svg_icon",
        iconSizeStyleObject
      );
      window.IDM.setStyleToPageHead(
        "idm_popupWorkbench_popup" + " .hover_button",
        btnStyleObject
      );
      window.IDM.setStyleToPageHead(
        "idm_popupWorkbench_popup" + " .hover_button .idm_filed_svg_icon",
        iconSizeStyleObject
      );
      window.IDM.setStyleToPageHead(
        "idm_popupWorkbench_popup" +
          " .van-cell.cell_selected .van-cell__title div",
        cellSelectedStyleObject
      );
      window.IDM.setStyleToPageHead(
        "idm_popupWorkbench_popup",
        popupStyleObject
      );
      window.IDM.setStyleToPageHead(
        "idm_popupWorkbench_popup" + " .van-cell .van-cell__title div",
        titleStyleObject
      );
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
        const cssObject_color_main = {
          color: item.mainColor ? item.mainColor.hex8 : "",
        };
        const cssObject_background_minor = {
          "background-color": item.minorColor ? item.minorColor.hex8 : "",
        };
        const cssObject_boderColor_minor = {
          "border-bottom-color": item.minorColor ? item.minorColor.hex8 : "",
        };
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .hover_button",
          cssObject_color_main
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #idm_popupWorkbench_popup" +
            " .hover_button",
          cssObject_color_main
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #idm_popupWorkbench_popup" +
            " .van-cell.cell_selected .van-cell__title div",
          cssObject_color_main
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #idm_popupWorkbench_popup" +
            " .van-cell.cell_selected",
          cssObject_background_minor
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #idm_popupWorkbench_popup" +
            " .van-cell :after",
          cssObject_boderColor_minor
        );
      }
    },
  },
};
</script>
<style lang="scss">
.idm_popupWorkbench_box {
  .hover_button {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #3976c7;
    position: fixed;
    z-index: 1000;
    top: 10px;
    background-color: #fff;
    .idm_filed_svg_icon {
      font-size: 16px;
      fill: currentColor;
      vertical-align: -0.15em;
      outline: none;
    }
  }
  .hover_button_left {
    padding: 0px 6px 0px 2px;
    border-radius: 0 50% 50% 0;
    left: 0;
  }
  .hover_button_right {
    padding: 0px 2px 0px 6px;
    border-radius: 50% 0 0 50%;
    right: 0;
  }
}
.idm_popupWorkbench_popup {
  width: 30%;
  height: 100%;
  .cell_box {
    background-color: #fff;
    &.cell_box_active {
      background-color: #d0e8ff;
    }
    .van-cell {
      background-color: transparent;
      :after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 16px;
        bottom: 0;
        left: 16px;
        border-bottom: 1px solid #ebedf0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
      &.cell_selected {
        color: #3976c7;
        background-color: #ebedf0;
      }
    }
  }
  .hover_button {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #3976c7;
    position: fixed;
    top: 10px;
    background-color: #fff;
    .idm_filed_svg_icon {
      font-size: 16px;
      fill: currentColor;
      vertical-align: -0.15em;
      outline: none;
    }
  }
  .hover_button_left {
    padding: 0px 6px 0px 2px;
    border-radius: 0 50% 50% 0;
    left: 100%;
  }
  .hover_button_right {
    padding: 0px 2px 0px 6px;
    border-radius: 50% 0 0 50%;
    right: 100%;
  }
}
</style>
