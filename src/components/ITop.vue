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
   class="idm_top_box"
   >
    <!--
      组件内部容器
      增加class="drag_container" 必选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
    -->
     <div class="top-bg">
        <div class="top-set">
          <svg-icon v-show="propData.set" @click.native="goUrl" icon-class="isort-set" class="svg" :style="{fontSize: propData.iconSize + 'px'}"/>
        </div>
        <div class="top-content">
          <div class="user-info" v-if="propData.userInfo">
            <img class="default-logo" :src="logo ? logo : IDM.url.getModuleAssetsWebPath(require('../assets/default_headpic.jpeg'),moduleObject)" alt="">
            <div>
              <div class="text">{{userName}}</div>
              <div class="text">{{userUnit}}</div>
            </div>      
          </div>
          <div class="weather-info" v-if="propData.weather">
            <div class="text">
              <img v-if="weatherLogo" :src="weatherLogo" alt="">
              {{temperature | temperature}}
              {{weather}}
            </div>
            <div class="text">{{city}}</div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'ITop',
  data(){
    return {
      moduleObject:{},
      logo: '',
      userName: '',
      userUnit: '',
      weatherLogo: '',
      weather: '',
      temperature: '',
      city: '',
      // 当前设备宽度
      currentEquipWidth: 0,
      propData:this.$root.propData.compositeAttr||{
        userInfo:true,
        weather: true,
        set: true,
        jumpType: 'new',
        iconSize: '30',
        setUrl: 'https://www.baidu.com/',
        headerBgUrl: '',
        themeList: [
          {
            key: "blue",
            mainColor: {
              hex8: "#4A90E2FF",
            },
            minorColor: {
              hex8: "#FFFFFFFF",
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
      }
    }
  },
  filters: {
    temperature(value) {
      if (value) {
        return (value + '°C')
      }
      return value
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.getClientWidth();
    this.initData();
    this.convertAttrToStyleObject();
    this.convertThemeListAttrToStyleObject();
    if(this.moduleObject.env=="develop" || !IDM.env_dev){
      this.userName = '测试';
      this.userUnit = '单位';
      this.temperature = '32.7';
      this.city = '广东市';
    }
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
    getClientWidth() {
      if ( this.moduleObject.env == 'develop' ) {
          return
      } else {
          this.currentEquipWidth = window.screen.width;
      }
    },
    // 设置图标跳转
    goUrl() {
      if (this.propData.setUrl) {
        let url = this.propData.setUrl;
        url+=url.indexOf("?")>-1?"&":"?";
        url+="pageid="+this.commonParam().pageId;
        this.propData.jumpType === 'new' &&  window.open(IDM.url.getWebPath(url))
        this.propData.jumpType === 'current' && this.moduleObject.env=="production" && (window.location.href=IDM.url.getWebPath(url))
      }
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
    },
    /**
     * 把属性转换成样式对象
     */
    translatePxToAdaptation(data) {
      const clientWidth = this.currentEquipWidth;
      if (!data || !clientWidth) {
        return data;
      }
      const adaptationBase = this.propData.adaptationBase || 414;
      const adaptationPercent = this.propData.adaptationPercent || 1;
      const percent =
        (clientWidth / adaptationBase - 1) * (adaptationPercent - 1) + 1;
      return data * percent;
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(){
      let styleObject = {};
      let fontStyleObject = {};
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
            case "font":
              fontStyleObject["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                fontStyleObject["color"]=element.fontColors.hex8;
              }
              fontStyleObject["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              fontStyleObject["font-style"]=element.fontStyle;
              fontStyleObject["font-size"]=this.translatePxToAdaptation(element.fontSize)+element.fontSizeUnit;
              fontStyleObject["line-height"]=this.translatePxToAdaptation(element.fontLineHeight) + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              fontStyleObject["text-align"]=element.fontTextAlign;
              fontStyleObject["text-decoration"]=element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .top-bg .top-content .text",fontStyleObject);
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
        const cssObject_color_minor = {
          color: item.minorColor ? item.minorColor.hex8 : "",
        };
        const cssObject_background_main = {
          "background-color": item.mainColor ? item.mainColor.hex8 : "",
        };
        let cssObject_background_detail = {};
        if(item.bgSize&&item.bgSize=="custom"){
          cssObject_background_detail["background-size"]=(item.bgSizeWidth?item.bgSizeWidth.inputVal+item.bgSizeWidth.selectVal:"auto")+" "+(item.bgSizeHeight?item.bgSizeHeight.inputVal+item.bgSizeHeight.selectVal:"auto")
        }else if(item.bgSize){
          cssObject_background_detail["background-size"]=item.bgSize;
        }
        if(item.positionX&&item.positionX.inputVal){
          cssObject_background_detail["background-position-x"]=item.positionX.inputVal+item.positionX.selectVal;
        }
        if(item.positionY&&item.positionY.inputVal){
          cssObject_background_detail["background-position-y"]=item.positionY.inputVal+item.positionY.selectVal;
        }
        if (item.bgImgUrl) {
          cssObject_background_detail["background-image"]=`url(${window.IDM.url.getWebPath(item.bgImgUrl)})`;
        }
        if (item.bgRepeat) {
          cssObject_background_detail["background-repeat"]=item.bgRepeat;
        }
        if (item.bgAttachment) {
          cssObject_background_detail["background-attachment"]=item.bgAttachment;
        }
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") + " .idm_top_box",
          cssObject_background_main
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") + " .top-bg",
          cssObject_color_minor
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") + " .idm_top_box",
          cssObject_background_detail
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
    // 定位当前城市、街道
    getWeather() {
      const weatherApi = '/ctrl/weather/getWeatherByLocation';
      IDM.http.get(weatherApi).done(res => {
        if (res.type === "success") {
          this.temperature = res.data.temp;
          this.city = res.data.cityName;
          this.weather = res.data.weather;
        } else {
          IDM.message.error(res.message);
        }
      })
      // 因浏览器限制，放弃这种方式
      // navigator.geolocation.getCurrentPosition((pos) => {
      //   // 当前经纬度存入变量 lat、lon
      //     lat = pos.coords.latitude;
      //     lon = pos.coords.longitude;
      //     IDM.http.get(weatherApi, {lon, lat}).done(res => {
      //       if (res.type === "success") {
      //         this.temperature = res.data.temp2;
      //         this.city = res.data.city;
      //       } else {
      //         IDM.message.error(res.message);
      //       }
      //     })
      // })
    },
    /**
     * 加载动态数据
     */
    initData(){
      this.getWeather();
      if(this.moduleObject.env=="production"){
        this.getWeather();
        var dataObject = {IDM:window.IDM};
        dataObject["userInfo"] = IDM.user.getCurrentUserInfo();

        var _defaultVal = "";
        var _defaultUnit = "";
        if(this.propData.userFiled){
          let filedExp = this.propData.userFiled;
          filedExp = "userInfo"+(filedExp.startsWiths("[")?"":".")+filedExp;
          _defaultVal = window.IDM.express.replace.call(this, "@["+filedExp+"]", dataObject);
        }
        if(this.propData.unitFiled){
          let filedExp = this.propData.unitFiled;
          filedExp = "userInfo"+(filedExp.startsWiths("[")?"":".")+filedExp;
          _defaultUnit = window.IDM.express.replace.call(this, "@["+filedExp+"]", dataObject);
        }
        this.userName = _defaultVal;
        this.userUnit = _defaultUnit;
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
    receiveBroadcastMessage(messageObject){
      console.log("组件收到消息",messageObject)
      if (messageObject.type && messageObject.type == "linkageReload") {
        this.reload();
      } else if (messageObject.type && messageObject.type == "pageResize") {
        this.currentEquipWidth = messageObject.message.width;
        this.convertAttrToStyleObject();
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
        this.$set(this.propData,"summaryConfigList",object.data);
      }
    }
  }
}
</script>
<style lang="scss">
.idm_top_box{
  background-color: #4A90E2FF;
  .top-bg{
    height: 100%;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    color: #fff;
    padding: 10px 10px 20px 10px;
    display: flex;
    flex-direction: column;
    .top-set{
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .top-content{
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      margin: 5px;
      line-height: 1.5;
      .user-info{
        display: flex;
        align-items: center;
      }
      .default-logo{
        width: 36px;
        height: 36px;
        margin-right: 10px;
        border-radius: 50%;
        background: #ccc;
        display: inline-block;
      }
    }
  }
}
</style>
