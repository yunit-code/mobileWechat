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
    class="i-sort-outer"
  >
  <div class="i-sort-tip" v-if="propData.showTip === undefined ? true : propData.showTip">
    {{ propData.tipText || '你可以通过拖拽对功能组件进行排序，点击置顶图标快速置顶重要组件，点击隐藏图标隐藏当前组件。'}}
  </div>
  <div class="i-sort-header">
    已添加的组件
  </div>
  <van-loading v-if="isLoading" size="24px" vertical>加载中...</van-loading>
  <div v-if="!isLoading">
    <draggable
      class="i-sort-drag"
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
        <div class="i-sort-item-name">{{ item.asName }}</div>
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
    <van-empty v-if="!listData || listData.length === 0" :image-size="propData.emptyImageSize || '100px'" :description="propData.emptyDescription || '暂无数据'" />
  </div>
</div>
</template>

<script>
import { Empty,Loading  } from 'vant';
import 'vant/lib/empty/style';
import 'vant/lib/loading/style';
import Draggable from "vuedraggable";
export default {
  name: "ISort",
  components: {
    Draggable,
    [Empty.name]: Empty,
    [Loading.name]: Loading
  },
  data() {
    return {
      isLoading:true,
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
    this.convertThemeListAttrToStyleObject();
    this.convertAttrToStyleObject();
    this.initData();
  },
  mounted() {},
  destroyed() {},
  methods: {
    /**
     * 组件通信：接收消息的方法
     */
    receiveBroadcastMessage(messageObject) {
      switch(messageObject.type) {
        case 'linkageReload':
          this.initData()
          break;
         case 'pageResize':
          this.convertAttrToStyleObject(messageObject.message);
          break;
      }
    },
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject(){
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
        
        let tipStyleObject = {
          "color": item.mainColor ? item.mainColor.hex8 : "",
          "background-color": item.minorColor ? item.minorColor.hex8 : "",
        };

        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .i-sort-tip",
          tipStyleObject
        );
      }
    },
    /**
     * 初始化组件
     */
    initData(){
      if (!this.moduleObject.env || this.moduleObject.env === "develop") {
        setTimeout(() => {
          //开发模式下给例子数据
          this.listData = [
            {
              comId: "1",
              asName: "广告轮播",
              hidden: false,
            },
            {
              comId: "2",
              asName: "统一待办",
              hidden: false,
            },
            {
              comId: "3",
              asName: "待办列表",
              hidden: false,
            },
            {
              comId: "4",
              asName: "应用中心",
              hidden: false,
            },
            {
              comId: "5",
              asName: "信息列表",
              hidden: false,
            },
          ];
          this.isLoading = false
        }, 1000);
      }else if(this.moduleObject.env ===  "production"){
        this.requestDefaultCustomization();
      }
    },
    /**
     * 请求失败
     */
    failRequest(url) {
      console.log(url + "请求失败");
    },
    /**
     * 取用户定制化数据
     */
    requestUserCustomization(defaultList) {
      const pageid = IDM.url.queryObject(window.location.href)[this.propData.pageid];
      const url = `/ctrl/idm/api/fetchUserCustomization?pageid=${pageid}&version=${this.pageVersion}`;
      IDM.http
        .get(url)
        .done((res) => {
          if (res&&res.code === "200" && res.data) {
            const list = JSON.parse(res.data.customData).children
            if (list && list.length > 0) {
              this.dealRes(list);
            } else {
              this.dealRes(defaultList)
            }
          }else if(res&&res.code === "200"){
              this.dealRes(defaultList)
          }else {
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
     * 取页面默认数据
     */
    requestDefaultCustomization() {
      const pageid = IDM.url.queryObject(window.location.href)[this.propData.pageid];
      const url = `/ctrl/idm/api/fetchPageSettingData?pageid=${pageid}&version=&savetype=`;
      IDM.http
        .get(url)
        .done((res) => {
          if (res.code === "200" && res.data) {
            // 保存页面信息
            this.pageInfo = {
              comName: res.data.page.layout.comName,
              id: res.data.page.layout.id,
              packageid:res.data.page.layout.packageid,
            };
            this.pageVersion = res.data.pageBaseInfo.version;
            this.pageId = res.data.id;

            const list = res.data.page.layout.children;
            this.requestUserCustomization(list);
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
     * 处理返回列表数据
     */
    dealRes(list) {
      // 添加隐藏数据
      list.forEach((item) => {
        if (item.hidden === undefined) item.hidden = false;
        if(item.children) delete item.children
      });
      // 保存列表信息
      this.listData = list;
      // 关闭加载状态
      this.isLoading = false;
    },
    /**
     * 拖拽结束
     */
    dragEnd() {
      const { id, comName,packageid } = this.pageInfo;
      const url = "/ctrl/idm/api/saveUserCustomization";
      const customData = {
        id,
        comName,
        packageid,
        children: this.listData,
      };
      IDM.http
        .post(url, {
          pageid: this.pageId,
          version: this.pageVersion,
          customData: JSON.stringify(customData),
        })
        .done((res) => {
          res = res?res.data:{};
          if (res.code !== "200") {
            this.failRequest(url);
          }
        })
        .error((response) => {
          this.failRequest(url);
        });
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
    convertAttrToStyleObject(pageSize = {}) {
      var styleObject = {};
      var tipStyleObject = {};
      var cardStyleObject = {};
      var emptyStyleObject = {};

      const scale  = this.getScale(pageSize.width);
      styleObject['--i-sort-scale'] = scale

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
            case "tipBgColor":
              if (element && element.hex8) {
                tipStyleObject["background-color"] = element.hex8;
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
            case "boxShadow":
              cardStyleObject["box-shadow"] = element;
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
            case "tipFont":
              tipStyleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                tipStyleObject["color"] = element.fontColors.hex8;
              }
              tipStyleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              tipStyleObject["font-style"] = element.fontStyle;
              tipStyleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              tipStyleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              tipStyleObject["text-align"] = element.fontTextAlign;
              tipStyleObject["text-decoration"] = element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + ".i-sort-outer .i-sort-tip", tipStyleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .i-sort-item", cardStyleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .van-empty", emptyStyleObject);
      // this.initData();
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
     * 置顶
     */
    toppingClick(index) {
      this.listData.unshift(this.listData.splice(index, 1)[0]);
      this.dragEnd();
    },
    /**
     * 	是否可见
     */
    visibleClick(item) {
      item.hidden = !item.hidden;
      this.dragEnd();
    },
  },
};
</script>
<style scoped lang="scss">
$scale: var(--i-sort-scale);
.i-sort-outer {
  width: auto;
  box-sizing: border-box;
  font-family: PingFangSC-Regular;
  font-size: calc(16px * #{ $scale });
  color: #333333;

  .i-sort-tip {
    background-color: #e6f7ff;
    color: #1890FF;
    padding: calc(14px * #{ $scale });
    font-size: calc(14px * #{ $scale });
  }

  .i-sort-header {
    background-color: #fff;
    padding: calc(14px * #{ $scale });
    margin-bottom: calc(14px * #{ $scale });
    color: #888;
    font-size: calc(14px * #{ $scale });
  }

  ::v-deep .van-loading {
    min-height: calc(210px * #{ $scale });
    justify-content: center;
  }

  .i-sort-drag {
    padding: 0 calc(14px * #{ $scale });
  }

  .i-sort-item {
    display: flex;
    height: calc(50px * #{ $scale });
    line-height: calc(50px * #{ $scale });
    margin-bottom: calc(14px * #{ $scale });
    border-radius: calc(10px * #{ $scale });
    background-color: #fff;
    box-shadow: 0 calc(2px * #{ $scale }) calc(4px * #{ $scale }) 0 rgba(0,0,0,.1);

    .i-sort-item-handle {
      width: calc(40px * #{ $scale });
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
      width: calc(80px * #{ $scale });
      height: 100%;
      text-align: center;
      display: flex;
      justify-content: center;

      span {
        display: inline-block;
        height: 100%;
        width: calc(30px * #{ $scale });
      }
    }
  }
}
</style>