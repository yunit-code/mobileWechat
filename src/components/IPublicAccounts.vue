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
    <div v-if="accountList && accountList.length > 0" class="drag-bar-wrapper" @touchstart="down"  @touchmove="move"  @touchend="end" :style="{position: (moduleObject.env === 'production' || !IDM.env_dev) && propData.fixed && 'fixed',...offset}">    
      <van-popover
        v-model="showPopover"
        trigger="click"
        :placement="placement"
        :actions="accountList"
        :close-on-click-action="false"
        @select="onSelect"
        v-if="propData.dataSource"
      >
        <template #reference>
          <img :style="{height: propData.imgHeight || '32px', width: propData.imgWidth || '32px'}" v-if="propData.accountUrl && accountList" :src="IDM.url.getWebPath(propData.accountUrl)" alt="">
          <span class="drag-bar-mask" v-else>请上传或选择图标！</span>
        </template>
      </van-popover>
      <span class="drag-bar-mask" v-else>未绑定数据源！</span>
    </div>
  </div>
</template>

<script>
import { Popover } from 'vant';
import 'vant/lib/popover/style';
const placementObj = {
  'leftTop': 'bottom-start',
  'rightTop': 'bottom-end',
  'leftBottom': 'top-start',
  'rightBottom': 'top-end'
};
export default {
  name: 'IPublicAccounts',
  components: {
      [Popover.name]: Popover,
  },
  data(){
    return {
      showPopover: false,
      placement: placementObj[this.$root.propData.compositeAttr?.coordinates || 'leftBottom'],
      flags: false,
      position: { x: 0, y: 0 },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
      moduleObject:{},
      accountList:[],
      propData:this.$root.propData.compositeAttr||{
        accountUrl: '',
        fixed: true,
        coordinates: 'leftBottom',
        offsetX: '20',
        offsetY: '20',
        changeInterfaceUrl: '/ctrl/virtualAccount/switchAccount'
      }
    }
  },
  props: {
  },
  computed:{
    offset() {
      if (this.propData.coordinates === 'leftTop') {
        return {
          left: this.propData.offsetX + 'px',
          top: this.propData.offsetY+ 'px',
        }
      }
      if (this.propData.coordinates === 'rightTop') {
        return {
          right: this.propData.offsetX + 'px',
          top: this.propData.offsetY+ 'px',
        }
      }
      if (this.propData.coordinates === 'rightBottom') {
        return {
          right: this.propData.offsetX+ 'px',
          bottom: this.propData.offsetY+ 'px',
        }
      }
      return {
        left: this.propData.offsetX+ 'px',
        bottom: this.propData.offsetY+ 'px',
      }
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
    if(this.moduleObject.env=="develop" || !IDM.env_dev){
      this.accountList = [
        {
          text: '公共账号',
        },
      ]
    }
  },
  mounted() {
    //赋值给window提供跨页面调用
    this.$nextTick(function(params) {
      this.moduleObject && this.moduleObject.packageid
        ? (window[this.moduleObject.packageid] = this)
        : null;
    });
    if (this.propData.fixed === false) {
      let item_box = document.querySelector(".drag-bar-wrapper");
      if(item_box.offsetTop > IDM.getClientWH().height/2 ) {
        this.placement = 'top-start'
      } else {
        this.placement = 'bottom-start'
      }
    }
    
  },
  destroyed() {},
  methods:{
    // 实现移动端拖拽
    down() {
      let item_box = document.querySelector(".drag-bar-wrapper");
      this.flags = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.maxW = IDM.getClientWH().width - item_box.offsetWidth;
      this.maxH = IDM.getClientWH().height - item_box.offsetHeight;
      this.position.x = touch.clientX - item_box.offsetLeft;
      this.position.y = touch.clientY - item_box.offsetTop;
      this.dx = touch.clientX;
      this.dy = touch.clientY;
    },
    move(event) {
      event.preventDefault();
      let item_box = document.querySelector(".drag-bar-wrapper");
      if (this.flags) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        if (this.nx < 0) {
          this.nx = 0;
        } else if (this.nx > this.maxW) {
          this.nx = this.maxW;
        }
 
        if (this.ny < 0) {
          this.ny = 0;
        } else if (this.ny >= this.maxH) {
          this.ny = this.maxH;
        }
        item_box.style.left = this.nx + "px";
        item_box.style.top = this.ny + "px";
        item_box.style.right = "unset"
        item_box.style.bottom = "unset"
        if(this.ny > IDM.getClientWH().height/2 ) {
          if (this.nx < IDM.getClientWH().width/2) {
            this.placement = 'top-start'
          } else {
            this.placement = 'top-end'
          }
        } else {
          if (this.nx < IDM.getClientWH().width/2) {
            this.placement = 'bottom-start'
          } else {
            this.placement = 'bottom-end'
          } 
        }
        this.showPopover = false;
        document.addEventListener(
          "touchmove",
          function() {
            // event.preventDefault()
          },
          false
        );
      }
    },
    //鼠标释放
    end() {
      this.flags = false;
    },
    // 切换账号
    onSelect(action,index) {
      console.log(action,index)
      this.showPopover = true;
      if(this.moduleObject.env=="production"){
        const params = {id: action.userId, orgId: action.orgId, isVirtual: action.isVirtual, switchType: '1'}
        this.propData.changeInterfaceUrl&&window.IDM.http.get(this.propData.changeInterfaceUrl,params)
        .done((res) => {
          //res.data
          if ( res.type == 'success' ) {
            // this.accountList.forEach((v) => {
            //   v.className = ''
            // })
            // this.$set(this.accountList[index], 'className', 'chose')
            // 刷新当前页面
            this.showPopover = false;
            setTimeout(() => {
              this.moduleObject.env=="production" && window.location.reload();
            }, 200)
          }
        })
      }
      
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.convertAttrToStyleObject();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(){
      var styleObject = {};
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
                styleObject["background-color"]=element.hex8;
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
              styleObject["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObject["color"]=element.fontColors.hex8;
              }
              styleObject["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObject["font-style"]=element.fontStyle;
              styleObject["font-size"]=element.fontSize+element.fontSizeUnit;
              styleObject["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObject["text-align"]=element.fontTextAlign;
              styleObject["text-decoration"]=element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
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
    },
    /**
     * 加载动态数据
     */
    initData() {
      const that = this;
      const customInterfaceUrl = '/ctrl/dataSource/getDatas';
      if (this.moduleObject.env == "production") {
        this.propData.dataSource &&
          IDM.http
            .post(
              customInterfaceUrl,
              {
                id: this.propData.dataSource && this.propData.dataSource.value,
              },
              {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8",
                },
              }
            )
            .done((res) => {
              if (res.type === "success") {
                that.accountList = res.data.map((item) => ({
                    ...item,
                    text: item.userName,
                  }));
              } else {
                IDM.message.error(res.message);
              }
            });
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
        this.$set(this.propData,"accountList",object.data);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .drag-bar-wrapper{
    z-index: 99999;
    .drag-bar-mask {
        display: inline-block;
        white-space: nowrap;
        padding: 6px 20px;
        color: #e6a23c;
        background: #fdf6ec;
        border:1px solid #f5dab1;
        border-radius: 4px;
      } 
  }

  .accout-icon{
    display: inline-block;
    border-radius: 50%;
    width: 20px;
    height: 20px;
  }
  
</style>
<style lang="scss">
  .van-popup{
    .chose{
      color: #000;
      font-size: 18px;
    }
    .van-popover__action-text{
      word-break: break-word;
    }
  } 
</style>
