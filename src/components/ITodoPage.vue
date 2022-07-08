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
   class="idm-todo-page-box in-box">
    <div class="idm-todo-page-box-header" v-if="propData.showSeach">
      <van-field class="idm-todo-page-box-header-search" v-model="searchInfo.title" left-icon="search" placeholder="搜索" clearable @input="searchChange"/>
      <div class="idm-todo-page-box-header-filter" @click="filterModel = true">
        <svg-icon icon-class="filter" />
      </div>
      <van-popup v-model="filterModel" position="bottom" round class="idm-todo-page-box-header-model" :style="{ height: '62%' }">
        <h3>搜索</h3>
        <van-form>
          <p>标题</p>
          <van-field
            v-model="searchInfo.title"
            name="标题"
            placeholder="请输入关键字"
            clearable
          />
          <p>发送人</p>
          <van-field
            v-model="searchInfo.sendUserName"
            name="发送人"
            placeholder="请输入关键字"
            clearable
          />
          <p>发送时间</p>
          <div class="idm-todo-page-box-header-model-calendar">
            <van-field
              readonly
              clickable
              name="startTime"
              :value="searchInfo.startTime"
              placeholder="选择日期"
              @click="startTimeInfo.model = true"
            />
            <span>-</span>
            <van-field
              readonly
              clickable
              name="endTime"
              :value="searchInfo.endTime"
              placeholder="选择日期"
              @click="endTimeInfo.model = true"
            />
          </div>
          <p>排序规则</p>
          <van-field
            readonly
            clickable
            :value="searchInfo.orderBy"
            placeholder="请选择"
            @click="sortPicker = true"
          />
          <div class="idm-todo-page-box-header-model-btn">
            <van-button block @click="searchReset">重置</van-button>
            <van-button block type="info" @click="searchConfirm">确定</van-button>
          </div>
        </van-form>
      </van-popup>
      <van-popup v-model="sortPicker" round position="bottom">
        <van-picker show-toolbar title="排序规则" :columns="sortList"  @cancel="sortPicker = false" @confirm="sortConfirm" :default-index="0" />
      </van-popup>
      <van-calendar v-model="startTimeInfo.model" :min-date="startTimeInfo.minDate" :max-date="startTimeInfo.maxDate" @confirm="calendarConfirm($event,0)" />
      <van-calendar v-model="endTimeInfo.model" :min-date="endTimeInfo.minDate" :max-date="endTimeInfo.maxDate" @confirm="calendarConfirm($event,1)" />
    </div>
    <div class="idm-todo-page-box-overflow">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :pulling-text="propData.pullingText" :loosing-text="propData.loosingText" :loading-text="propData.loadingText">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="propData.finishedText"
          :loading-text="propData.loadingText"
          @load="onLoad"
        >
          <div class="idm-todo-page-box-sub" v-for="(item, index) in todoData" :key="index" @click="handleClickItem(item)">
            <div class="idm-todo-page-box-sub-title" :class="{'idm-todo-page-box-sub-no-read': true}">
              <div class="flex-1">
                <div class="idm-todo-page-box-sub-content" :class="getExpressData('data', propData.readExpression, item) ?'idm-todo-page-box-sub-hasRead' : ''">
                  <span v-if="item.appShowName" class="ml-7">【{{item.appShowName}}】</span>{{IDM.express.replace('@['+propData.dataFiled+']', item, true)}}
                </div>
                <div class="idm-todo-page-box-sub-intr">
                  <div class="d-flex align-c">
                    <svg v-if="propData.readIcon && propData.readIcon.length > 0 && item.readStatus == '1'" class="idm-todo-page-box-sub-icon-has-read" aria-hidden="true" >
                      <use :xlink:href="`#${propData.readIcon[0]}`"></use>
                    </svg>
                    <svg v-if="propData.noReadIcon && propData.noReadIcon.length > 0 && item.readStatus != '1'" class="idm-todo-page-box-sub-icon-no-read" aria-hidden="true" >
                      <use :xlink:href="`#${propData.noReadIcon[0]}`"></use>
                    </svg>
                    <span>{{item.readStatusText}}</span> 
                  </div>
                  <div class="d-flex align-c">
                    <svg class="idm-todo-page-box-sub-icon" aria-hidden="true">
                      <use xlink:href="#idm-icon-ren"></use>
                    </svg>
                    <span>{{item.sendUserName}}</span> </div>
                  <div class="d-flex align-c">
                    <svg class="idm-todo-page-box-sub-icon" aria-hidden="true">
                      <use xlink:href="#idm-icon-shijian"></use>
                    </svg>
                    <span>{{item.time}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import monent from "moment"
import { Icon, Field, Popup, Calendar, Button, List, Cell, Picker, PullRefresh } from 'vant';
import { getAdaptiveSize } from '@/utils/adaptationScreen'
import 'vant/lib/icon/style';
import 'vant/lib/field/style';
import 'vant/lib/popup/style';
import 'vant/lib/calendar/style';
import 'vant/lib/button/style';
import 'vant/lib/list/style';
import 'vant/lib/cell/style';
import 'vant/lib/picker/style';
import 'vant/lib/pull-refresh/style';
const todoData = [
  {
    jumpUrl: '',
    isHot: '-1',
    readStatus: '0',
    appShowName: 'APP1',
    readStatusText: '未读',
    sendUserName: '文档处',
    time: '2022-04-21 12:56',
    title: '关于扎实做好近期疫情防控有关工作的通知'
  },{
    jumpUrl: '',
    isHot: '-1',
    appShowName: 'APP2',
    readStatus: '1',
    readStatusText: '已读',
    sendUserName: '张三',
    time: '2022-04-21 09:23',
    title: '关于印发《山东省职业卫生技术服务机构乙级资质认可程序》的通知'
  },{
    jumpUrl: '',
    isHot: '-1',
    readStatus: '1',
    appShowName: 'APP2',
    readStatusText: '已读',
    sendUserName: '文档处',
    time: '2022-04-21 08:56',
    title: '关于印发数字山东2021行动方案的通知'
  }
]
export default {
  name: 'ITodoPage',
  components: {
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Calendar.name]: Calendar,
    [Button.name]: Button,
    [List.name]: List,
    [Cell.name]: Cell,
    [Picker.name]: Picker,
    [PullRefresh.name]: PullRefresh,
  },
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{
        limit: 25,
        showSeach:true,
        width: '100%',
        height: '100vh',
        dataFiled: 'title',
        bgColor: '#fff',
        pullingText:"下拉即可刷新...",
        loosingText:"释放即可刷新...",
        loadingText:"加载中...",
        finishedText:'没有更多数据',
      },
      todoData: [],
      countKey: 'count',
      pageWidth: null,
      filterModel:false,
      startTimeInfo:{
        model:false,
        minDate:new Date(2010, 0, 1),
        maxDate:new Date(2030, 11, 31)
      },
      endTimeInfo:{
        model:false,
        minDate:new Date(2010, 0, 1),
        maxDate:new Date(2030, 11, 31)
      },
      searchInfo:{
        title:'',
        sendUserName:'',
        startTime:'',
        endTime:'',
        orderBy:''
      },
      loading:false,
      finished:false,
      sortList: ["按时间正序","按时间倒序"],
      sortPicker:false,
      start: 0,
      refreshing:false
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
    this.convertThemeListAttrToStyleObject();
    this.initData()
  },
  methods:{
    /**
     * 下拉刷新
     */
    onRefresh(){
      this.todoData = [];
      this.start = 0;
      this.finished = false;
      this.initData();
    },
    /**
     * 查询条件重置
     */
    searchReset(){
      this.searchInfo={
        title:'',
        sendUserName:'',
        startTime:'',
        endTime:'',
        orderBy:''
      };
      this.startTimeInfo.minDate = new Date(2010, 0, 1);
      this.startTimeInfo.maxDate = new Date(2030, 11, 31);
      this.endTimeInfo.minDate = new Date(2010, 0, 1);
      this.endTimeInfo.maxDate = new Date(2030, 11, 31);
    },
    /**
     * 查询确认
     */
    searchConfirm(){
      this.todoData = [];
      this.start = 0;
      this.filterModel = false;
      this.finished = false;
      this.initData();
    },
    /**
     * 排序规则确认
     */
    sortConfirm(value){
      this.searchInfo.orderBy = value;
      this.sortPicker = false
    },
     /**
     * 列表加载
     */
    onLoad(){
      this.start = this.start + this.propData.limit + 1;
      this.initData();
    },
    /**
     * 搜索回调
     */
    searchChange(){
      this.todoData = [];
      this.start = 0;
      this.filterModel = false;
      this.finished = false;
      this.initData();
    },
    /**
     * 过滤弹框显示隐藏
     */
    calendarConfirm(date,type){
      if(!type){
        this.searchInfo.startTime = monent(date).format("YYYY-MM-DD") ;
        this.startTimeInfo.model = false;
        this.endTimeInfo.minDate = date;
      }else{
        this.searchInfo.endTime = monent(date).format("YYYY-MM-DD");
        this.endTimeInfo.model = false;
        this.startTimeInfo.maxDate = date;
      }
    },
    /**
     * 点击单个事件
     * @param {单个待办} item 
     */
    handleClickItem(item){
      if(this.moduleObject.env=="develop"){
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
      pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
      var clickToDoItemFunction = this.propData.clickToDoItemFunction;
      if (clickToDoItemFunction) {
        clickToDoItemFunction.forEach((item) => {
        console.log(window[item.name])
        window[item.name] &&
            window[item.name].call(this, {
            customParam: item.param,
            _this: this,
            urlData:urlObject,
            pageId,
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
      let todoFontStyleObj = {}
      let readFontStyleObj = {}
      let emptyBoxHeightObj = {}
      let readIconObj = {}
      let noReadIconObj = {}
      let subBoxStyleObj = {}
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
                styleObject["background-color"]=IDM.hex8ToRgbaString(element.hex8)
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
                  styleObject["border-top-color"]=IDM.hex8ToRgbaString(element.border.top.colors.hex8)
                }
              }
              if(element.border.right.width>0){
                styleObject["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                styleObject["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  styleObject["border-right-color"]=IDM.hex8ToRgbaString(element.border.right.colors.hex8)
                }
              }
              if(element.border.bottom.width>0){
                styleObject["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                styleObject["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  styleObject["border-bottom-color"]=IDM.hex8ToRgbaString(element.border.bottom.colors.hex8)
                }
              }
              if(element.border.left.width>0){
                styleObject["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                styleObject["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  styleObject["border-left-color"]=IDM.hex8ToRgbaString(element.border.left.colors.hex8)
                }
              }
              styleObject["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
            case "titleIconFontColor":
                styleObjectTitleIcon["fill"] = IDM.hex8ToRgbaString(element.hex8) + ' !important';
                break
            case "titleIconFontSize":
                styleObjectTitleIcon["font-size"] = getAdaptiveSize.call(this, element) + "px";
                styleObjectTitleIcon["width"] = getAdaptiveSize.call(this, element) + "px";
                styleObjectTitleIcon["height"] = getAdaptiveSize.call(this, element) + "px";
                break
            case 'todoFontStyle':
              todoFontStyleObj["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                  todoFontStyleObj["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8)
              }
              todoFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              todoFontStyleObj["font-style"] = element.fontStyle;
              todoFontStyleObj["font-size"] = getAdaptiveSize.call(this, element.fontSize) + element.fontSizeUnit;
              todoFontStyleObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              todoFontStyleObj["text-align"] = element.fontTextAlign;
              todoFontStyleObj["text-decoration"] = element.fontDecoration;
              break
            case 'readFontStyle':
              readFontStyleObj["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                  readFontStyleObj["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8)
              }
              readFontStyleObj["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              readFontStyleObj["font-style"] = element.fontStyle;
              readFontStyleObj["font-size"] = getAdaptiveSize.call(this, element.fontSize) + element.fontSizeUnit;
              readFontStyleObj["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              readFontStyleObj["text-align"] = element.fontTextAlign;
              readFontStyleObj["text-decoration"] = element.fontDecoration;
              break
            case 'emptyBoxHeight':
              emptyBoxHeightObj['height'] = element.inputVal + element.selectVal
              break;
            case "readIconColor":
                readIconObj["fill"] = IDM.hex8ToRgbaString(element.hex8)
                break
            case "readIconSize":
                readIconObj["font-size"] = getAdaptiveSize.call(this, element) + "px";
                readIconObj["width"] = getAdaptiveSize.call(this, element) + "px";
                readIconObj["height"] = getAdaptiveSize.call(this, element) + "px";
                break
            case "noReadIconColor":
                noReadIconObj["fill"] = IDM.hex8ToRgbaString(element.hex8)
                break
            case "noReadIconSize":
                noReadIconObj["font-size"] = getAdaptiveSize.call(this, element) + "px";
                noReadIconObj["width"] = getAdaptiveSize.call(this, element) + "px";
                noReadIconObj["height"] = getAdaptiveSize.call(this, element) + "px";
                break
            case "subWidth":
              subBoxStyleObj['width']=element;
              break;
            case "subHeight":
              subBoxStyleObj['height']=element;
              break;
            case "subBgColor":
              if(element&&element.hex8){
                subBoxStyleObj["background-color"]=IDM.hex8ToRgbaString(element.hex8)
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
                if(element.border.top.colors.hex8){
                  subBoxStyleObj["border-top-color"]=IDM.hex8ToRgbaString(element.border.top.colors.hex8)
                }
              }
              if(element.border.right.width>0){
                subBoxStyleObj["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                subBoxStyleObj["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  subBoxStyleObj["border-right-color"]=IDM.hex8ToRgbaString(element.border.right.colors.hex8)
                }
              }
              if(element.border.bottom.width>0){
                subBoxStyleObj["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                subBoxStyleObj["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  subBoxStyleObj["border-bottom-color"]=IDM.hex8ToRgbaString(element.border.bottom.colors.hex8)
                }
              }
              if(element.border.left.width>0){
                subBoxStyleObj["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                subBoxStyleObj["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  subBoxStyleObj["border-left-color"]=IDM.hex8ToRgbaString(element.border.left.colors.hex8)
                }
              }
              subBoxStyleObj["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              subBoxStyleObj["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              subBoxStyleObj["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              subBoxStyleObj["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
            case 'boxShadow':
              subBoxStyleObj['box-shadow']=element;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-todo-page-box-overflow", subBoxStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-todo-page-box-sub-content", todoFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-todo-page-box-sub-hasRead", readFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-todo-page-box-empty", emptyBoxHeightObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-todo-page-box-sub-icon-has-read", readIconObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-todo-page-box-sub-icon-no-read", noReadIconObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-todo-page-box-sub-intr", {'font-size': getAdaptiveSize.call(this, 13) + 'px'});
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-todo-page-box-sub-icon", {'width': getAdaptiveSize.call(this, 18) + 'px', 'height': getAdaptiveSize.call(this, 18) + 'px'});
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-todo-page-box-header-search", {'font-size': getAdaptiveSize.call(this, 14) + 'px'});
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .van-field__left-icon .van-icon, .van-field__right-icon .van-icon", {'font-size': getAdaptiveSize.call(this, 16) + 'px'});
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm-todo-page-box-header-filter", {'font-size': getAdaptiveSize.call(this, 24) + 'px'});
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .van-list__finished-text", {'font-size': getAdaptiveSize.call(this, 14) + 'px'});
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
        
        // 搜索确定按钮
        let btnColorObj = {
          "background-color": item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
          "border-color":  item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ""
        };
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .van-button--info",
          btnColorObj
        );
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .van-button--danger",
          btnColorObj
        );
        
        // 搜索确定按钮
        let calendarColorObj = {
          "background-color": item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
        };
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .van-calendar__selected-day",
          calendarColorObj
        );

        // 搜索确定按钮
        let confirmColorObj = {
          "color": item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
        };
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .van-picker__confirm",
          confirmColorObj
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
     * 加载动态数据
     */
    initData(){
      // 模拟数据
      if(this.moduleObject.env === 'develop' || !this.moduleObject.env) {
        if(this.todoData.length===0){
          this.todoData = _.cloneDeep(todoData)
        }else{
          this.loading = true;
          setTimeout(() => {
            for (let i = 0; i < 10; i++) {
              this.todoData.push(this.todoData[0]);
            }
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            if (this.todoData.length >= 40) {
              this.finished = true;
            }
            this.refreshing = false;
          }, 1000);
        }
        return
      }
      // 真实请求
      const userInfo = IDM.user.getCurrentUserInfo();
      this.loading = true
      window.IDM.http
        .post("ctrl/customizeTodo/getUnifyTodoPage", {
          start: this.start,
          limit: this.propData.limit,
          operatorId:userInfo.userid,
          sendUserName:this.searchInfo.sendUserName,
          title: this.searchInfo.title,
          startDate:this.searchInfo.startTime,
          endDate:this.searchInfo.endTime,
          orderBy:this.searchInfo.orderBy === "按时间倒序" ? 'desc' : ''
        },{headers: {"Content-Type": "application/json;charset=UTF-8"}})
        .then((res) => {
          if(res.status == 200 && res.data.code == 200){
            const {total,start,limit,list} = res.data.data
            this.start = start;
            if(total === 0){
              this.finished = true
            }else{
              this.todoData = [...this.todoData,...list]
              if(start + limit >= total){
                this.finished = true
              }
            }
          }else {
            IDM.message.error(res.data.message)
          }
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(()=>{
          this.loading = false;
          this.refreshing = false;
        })
    },
    /**
     * 重载页面
     */
    reloadPage(){
      this.searchReset();
      this.filterModel = false;
      this.startTimeInfo.model = false;
      this.endTimeInfo.model = false;
      this.loading = false;
      this.finished = false;
      this.sortPicker = false;
      this.start = 0;
      this.todoData = [];
      this.initData();
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
      switch(messageObject.type) {
        case 'websocket':
          if(this.propData.messageRefreshKey && messageObject.message){
            const messageData = typeof messageObject.message === 'string' && JSON.parse(messageObject.message) || messageObject.message
            const arr = Array.isArray(this.propData.messageRefreshKey) ? this.propData.messageRefreshKey : [this.propData.messageRefreshKey]
            if(messageData.badgeType && arr.includes(messageData.badgeType)){
              this.reloadPage()
            }
          }
          break;
        case 'linkageReload':
          this.reloadPage()
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
.idm-todo-page-box{
  background-color: #fff;
  overflow: hidden;
  position: relative;
  height: 100%;

  .idm-todo-page-box-header {
    display: flex;
    align-items: center;

    &-search {
      background-color: #f3f3f3;
      border-radius: 4px;
      padding: 6px 16px;
    }
    
    &-filter {
      font-size: 24px;
      padding: 0 8px;
    }

    &-model {
      background-color:#FFF;
      padding: 14px;
      h3 {
        text-align: center;
        border-bottom: 1px solid #ebedf0;
        padding-bottom: 8px;
      }

      p {
        margin: 8px 0;
      }

      .van-cell {
        padding: 4px 14px;
        border: 1px solid #ebedf0;

        &::after {
          display: none;
        }
      }

      &-calendar {
        display: flex;
        align-items: center;
        span {
          margin: 0 16px;
          color: #ebedf0;
        }
      }

      &-btn {
        display: flex;
        margin-top: 20px;
        .van-button:first-child {
          margin-right: 16px;
        }
      }
    }
  }

  &-left-icon{
    display: flex;
    align-items: center;
    margin: 0 8px 0 0;
  }
  &-right-icon{
    display: flex;
    align-items: center;
    margin: 0 0 0 8px;
  }
  &-overflow{
    height: calc(100% - 36px);
    overflow-x: hidden;
    overflow-y: auto;
    // .van-pull-refresh {
        // height: 100%;
        // overflow: hidden;
        // overflow-y: auto;
    // }
  }
  &-sub{
    border-bottom: .6px solid #eee;
    &-title{
      display: flex;
      margin: 8px 0 0 0;
      &-icon{
        font-size: 15px;
        margin: 0 6px 0 0;
      }
    }
    &-content{
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
      // display: -moz-box;
      // -moz-line-clamp: 2;
      // -moz-box-orient: vertical;
      // overflow-wrap: break-word;
      // word-break: break-all;
      // white-space: normal;
      // overflow: hidden;
      letter-spacing: 1px;
      font-size: 15px;
      .ml-7{
        margin-left: -7px;
      }
    }
    &-no-read{
      color: #000;
      font-weight: 500;
    }
    &-hasRead{
      color: #363636;
    }
    &-intr{
      padding: 8px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #9e9e9e;
      font-size: 15px;
      font-family: PingFangSC-Regular;
    }
    &:last-child{
      border-bottom: 0
    }
    &-icon{
      width: 18px;
      height: 18px;
      fill: currentColor;
      vertical-align: -0.15em;
      outline: none;
      margin: 0 3px 0 0;
    }
    &-icon-no-read{
      font-size: 14px;
      width: 14px;
      fill: #f10215;
      vertical-align: -0.15em;
      outline: none;
      margin: 0 3px 0 0;
    }
    &-icon-has-read{
      font-size: 14px;
      width: 14px;
      fill: currentColor;
      vertical-align: -0.15em;
      outline: none;
      margin: 0 3px 0 0;
    }
    &-empty{
      overflow: hidden;
      height: 90px;
    }
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