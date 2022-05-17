<template>
    <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id"
        :title="propData.htmlTitle ? propData.fontContent : ''" v-show="propData.defaultStatus != 'hidden'">
        <!-- 组件内部容器 增加class="drag_container" 必选 idm-ctrl-id：组件的id，这个必须不能为空 idm-container-index  组件的内部容器索引，不重复唯一且不变，必选 -->
        <div class="idm_applicationmanage">
            <div class="idm_applicationmanage_block">
                <div class="idm_applicationcenter_title flex_between">
                    <div class="idm_applicationcenter_title_left">
                        <div class="idm_applicationcenter_title_left_text">我的应用</div>
                    </div>
                    <div @click="manageApplication" class="idm_applicationcenter_title_right">管理</div>
                </div>
                <div v-if="my_application_data && my_application_data.length" class="idm_applicationcenter_main">
                    <van-grid :border="false" :column-num="5">
                        <van-grid-item v-for="(item,index) in my_application_data" :key="item.value">
                            <div class="idm_applicationcenter_main_list">
                                <div v-if="item.imageUrl">
                                    <img :src="item.imageUrl">
                                </div>
                                <svg-icon v-else icon-class="application" />

                                <div class="idm_applicationcenter_main_list_name">{{ item.title || ('应用' + index + 1) }}</div>
                                <van-icon @click="deleteApplication(item,index)" v-if="is_edit" class="icon" name="minus" color="#fff" />
                            </div>
                        </van-grid-item>
                    </van-grid>
                </div>
            </div>
            
            <div class="idm_applicationmanage_block">
                <div class="idm_applicationcenter_title flex_between">
                    <div class="idm_applicationcenter_title_left">
                        <div class="idm_applicationcenter_title_left_text">全部应用</div>
                    </div>
                </div>
                 <div v-if="application_data && application_data.length" class="idm_applicationcenter_main">
                    <van-tabs>
                        <van-tab v-for="(item,index) in application_data" :key="item.value" :title="item.title">
                            <van-grid :border="false" :column-num="5">
                                <van-grid-item v-for="(item1,index1) in item.children" :key="item1.value">
                                    <div class="idm_applicationcenter_main_list">
                                        <div v-if="item1.imageUrl">
                                            <img :src="item1.imageUrl">
                                        </div>
                                        <svg-icon v-else icon-class="application" />

                                        <div class="idm_applicationcenter_main_list_name">{{ item1.title || ('应用' + index1 + 1) }}</div>
                                        <div v-if="is_edit">
                                            <van-icon v-if="isHaveInMyApplication(item1)" class="icon icon_disabled" name="plus" color="#fff" />
                                            <van-icon @click="addApplication(item1)" v-else class="icon" name="plus" color="#fff" />
                                        </div>
                                    </div>
                                </van-grid-item>
                            </van-grid>
                        </van-tab>
                    </van-tabs>
                </div>
            </div>
            <div class="idm_applicationmanage_search flex_end">
                <div @click="search" class="search_main">
                    <van-icon name="search" color="#fff"/>
                </div>
            </div>
            <div class="idm_applicationmanage_footer flex_between">
                <van-button @click="cancel" class="button" block type="default">取消</van-button>
                <van-button @click="save" class="button" block type="info">保存</van-button>
            </div>
            
        </div>
    </div>
</template>

<script>
import { base_url } from '../api/config.js'
import { Grid,GridItem,Tab,Tabs,Icon,Button,Toast } from 'vant';

import 'vant/lib/grid/style';
import 'vant/lib/tabs/style';
import 'vant/lib/icon/style';
import 'vant/lib/button/style';
import 'vant/lib/toast/style';
export default {
    name: 'IApplicationManage',
    components: {
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [Icon.name]: Icon,
        [Button.name]: Button,
        [Toast.name]: Toast,
    },
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                showRows: 2,
                showColumn: 5,
                getMyApplicationUrl: '/ctrl/tencentApp/queryMyFavorite',
                getAllApplicationUrl: '/ctrl/tencentApp/queryAppGroupByGrant',
            },
            is_edit: false,
            my_application_data: [
                {
                    value: '1',
                    imageUrl: '',
                    title: '应用名称'
                }
            ],
            application_data: [
                {
                    title: '公文',
                    value: '1',
                    children: [
                        {
                            is_favorite: "1", //是否设置我的应用 0否 1是
                            imageUrl: "", //应用图标url
                            appUrl: "", //应用点击url
                            title: "公文管理", //应用名称
                            value: "11", //应用ID
                            key: "11" //应用ID
                        }
                    ]
                }
            ],
        }
    },
    props: {
    },
    created() {
        this.moduleObject = this.$root.moduleObject
        this.convertAttrToStyleObject();
    },
    mounted() {
        //赋值给window提供跨页面调用
        this.$nextTick(function (params) {
            //单独组件不能使用这种方式
            // window[this.moduleObject.packageid] = this;
        });
    },
    destroyed() { },
    methods: {
        getMyApplicatinData() {
            console.log('初始化数据',this.moduleObject)
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            console.log('propData',this.propData)
            if ( this.propData.getMyApplicationUrl ) {
                window.IDM.http.get(base_url + this.propData.getMyApplicationUrl)
                    .then((res) => {
                        if ( res.data && res.data.type == 'success' ) {
                            this.my_application_data = res.data.data
                        }
                    }).catch(function (error) {

                    });
            }
        },
        getAllApplicatinData() {
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            if ( this.propData.getAllApplicationUrl ) {
                window.IDM.http.post(base_url + this.propData.getAllApplicationUrl)
                    .then((res) => {
                        if ( res.data && res.data.type == 'success' ) {
                            this.application_data = res.data.data
                        }
                    }).catch(function (error) {

                    });
            }
        },
        save() {
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            if ( this.propData.saveMyApplicationUrl ) {
                let appId_arr = [];
                let appId = '';
                this.my_application_data.forEach((item) => {
                    appId_arr.push(item.value)
                })
                appId = appId_arr.join(',')
                window.IDM.http.post(base_url + this.propData.saveMyApplicationUrl,{
                    appId: appId
                }).then((res) => {
                    if ( res.data && res.data.type == 'success' ) {
                        Toast.success('添加应用成功');
                        this.is_edit = false;
                    }
                }).catch(function (error) {

                });
            }
        },
        search() {
            // this.save()
            this.is_edit = false;
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            if ( this.propData.clickSearchUrl ) {
                if ( this.propData.clickSearchJumpType == '_self' ) {
                    window.location.href = this.propData.clickSearchUrl
                } else {
                    window.open(this.propData.clickSearchUrl,this.propData.clickSearchJumpType);
                }
            }            
        },
        cancel() {
            this.is_edit = false;
            let urlObject = window.IDM.url.queryObject();
            let pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
            var clickNewFunction = this.propData.clickCancelFunction;
            clickNewFunction && clickNewFunction.forEach(item=>{
                window[item.name]&&window[item.name].call(this,{
                    urlData:urlObject,
                    pageId,
                    customParam:item.param,
                    _this:this
                });
            })
        },
        manageApplication() {
            this.is_edit = true;
        },
        deleteApplication(item,index) {
            this.my_application_data.splice(index,1)
        },
        addApplication(item) {
            this.my_application_data.push(item)
        },
        isHaveInMyApplication(e) {
            let result = this.my_application_data.filter((item) => {
                return item.value == e.value
            })
            if ( result && result.length ) {
                return true
            } else {
                return false
            }
        },
       
        /** * 提供父级组件调用的刷新prop数据组件 */
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            this.convertAttrToStyleObject();
        },
        /**
         * 把属性转换成样式对象
         */
        convertAttrToStyleObject() {
            var styleObject = {};
            var styleObjectTitle = {};
            if (this.propData.bgSize && this.propData.bgSize == "custom") {
                styleObject["background-size"] = (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") + " " + (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto")
            } else if (this.propData.bgSize) {
                styleObject["background-size"] = this.propData.bgSize;
            }
            if (this.propData.positionX && this.propData.positionX.inputVal) {
                styleObject["background-position-x"] = this.propData.positionX.inputVal + this.propData.positionX.selectVal;
            }
            if (this.propData.positionY && this.propData.positionY.inputVal) {
                styleObject["background-position-y"] = this.propData.positionY.inputVal + this.propData.positionY.selectVal;
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
                        case "titleWidth":
                            styleObjectTitle[key] = element;
                        case "height":
                            styleObject[key] = element;
                            break;
                        case "titleHeight":
                            styleObjectTitle[key] = element;
                            break;
                        case "bgColor":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "titleBgColor":
                            if (element && element.hex8) {
                                styleObjectTitle["background-color"] = element.hex8;
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
                        case "titleBox":
                            if (element.marginTopVal) {
                                styleObjectTitle["margin-top"] = `${element.marginTopVal}`;
                            }
                            if (element.marginRightVal) {
                                styleObjectTitle["margin-right"] = `${element.marginRightVal}`;
                            }
                            if (element.marginBottomVal) {
                                styleObjectTitle["margin-bottom"] = `${element.marginBottomVal}`;
                            }
                            if (element.marginLeftVal) {
                                styleObjectTitle["margin-left"] = `${element.marginLeftVal}`;
                            }
                            if (element.paddingTopVal) {
                                styleObjectTitle["padding-top"] = `${element.paddingTopVal}`;
                            }
                            if (element.paddingRightVal) {
                                styleObjectTitle["padding-right"] = `${element.paddingRightVal}`;
                            }
                            if (element.paddingBottomVal) {
                                styleObjectTitle["padding-bottom"] = `${element.paddingBottomVal}`;
                            }
                            if (element.paddingLeftVal) {
                                styleObjectTitle["padding-left"] = `${element.paddingLeftVal}`;
                            }
                            break;
                        case "bgImgUrl":
                            styleObject["background-image"] = `url(${window.IDM.url.getWebPath(element)})`;
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
                                styleObject["border-top-width"] = element.border.top.width + element.border.top.widthUnit;
                                styleObject["border-top-style"] = element.border.top.style;
                                if (element.border.top.colors.hex8) {
                                    styleObject["border-top-color"] = element.border.top.colors.hex8;
                                }
                            }
                            if (element.border.right.width > 0) {
                                styleObject["border-right-width"] = element.border.right.width + element.border.right.widthUnit;
                                styleObject["border-right-style"] = element.border.right.style;
                                if (element.border.right.colors.hex8) {
                                    styleObject["border-right-color"] = element.border.right.colors.hex8;
                                }
                            }
                            if (element.border.bottom.width > 0) {
                                styleObject["border-bottom-width"] = element.border.bottom.width + element.border.bottom.widthUnit;
                                styleObject["border-bottom-style"] = element.border.bottom.style;
                                if (element.border.bottom.colors.hex8) {
                                    styleObject["border-bottom-color"] = element.border.bottom.colors.hex8;
                                }
                            }
                            if (element.border.left.width > 0) {
                                styleObject["border-left-width"] = element.border.left.width + element.border.left.widthUnit;
                                styleObject["border-left-style"] = element.border.left.style;
                                if (element.border.left.colors.hex8) {
                                    styleObject["border-left-color"] = element.border.left.colors.hex8;
                                }
                            }

                            styleObject["border-top-left-radius"] = element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
                            styleObject["border-top-right-radius"] = element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
                            styleObject["border-bottom-left-radius"] = element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
                            styleObject["border-bottom-right-radius"] = element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
                            break;
                        case "font":
                            styleObject["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObject["color"] = element.fontColors.hex8;
                            }
                            styleObject["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObject["font-style"] = element.fontStyle;
                            styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObject["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObject["text-align"] = element.fontTextAlign;
                            styleObject["text-decoration"] = element.fontDecoration;
                            break;
                        case "titleFont":
                            styleObjectTitle["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectTitle["color"] = element.fontColors.hex8;
                            }
                            styleObjectTitle["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectTitle["font-style"] = element.fontStyle;
                            styleObjectTitle["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectTitle["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectTitle["text-align"] = element.fontTextAlign;
                            styleObjectTitle["text-decoration"] = element.fontDecoration;
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationcenter_title_left_text", styleObjectTitle);
            this.initData();
        },
       
        /** * 重新加载 */
        reload() {
            //请求数据源
            this.initData();
        },
        initData() {
            this.getMyApplicatinData()
            this.getAllApplicatinData()
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
        receiveBroadcastMessage(object) {
            console.log("组件收到消息", object)
            if (object.type && object.type == "linkageShowModule") {
                this.showThisModuleHandle();
            } else if (object.type && object.type == "linkageHideModule") {
                this.hideThisModuleHandle();
            }
        },
        showThisModuleHandle() {
            this.propData.defaultStatus = "default";
        },
        hideThisModuleHandle() {
            this.propData.defaultStatus = "hidden";
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
        }
    }
}
</script>
<style lang="scss">
.idm_applicationmanage {
    width: auto;
    border-radius: 10px;
    .idm_applicationmanage_block{
        margin-bottom: 5px;
        .idm_applicationcenter_title{
            padding: 10px 10px 10px 10px;
            .idm_applicationcenter_title_left_text{
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #333333;
                line-height: 22px;
            }
        }
        .idm_applicationcenter_main{
            background: white;
            .idm_applicationcenter_main_list{
                position: relative;
                text-align: center;
                img,svg{
                    width: 40px;
                    height: 40px;
                    margin: 0 auto 2.5px auto;
                }
                .idm_applicationcenter_main_list_name{
                    font-size: 12px;
                    color: #333333;
                    text-align: center;
                }
                .icon{
                    width: 15px;
                    height: 15px;
                    line-height: 15px;
                    position: absolute;
                    top: -7px;
                    right: 0px;
                    text-align: center;
                    font-size: 12px;
                    color: white;
                    background: #E81B1B;
                    border-radius: 50%;
                }
                .icon_disabled{
                    background: #999;
                }
            }
        }
    }
    
    .idm_applicationmanage_footer{
        width: 100%;
        // position: fixed;
        // bottom: 80px;
        margin-top: 40px;
        padding: 0 20px;
        background: white;
        .button:nth-child(1){
            margin-right: 20px;
        }
    }
    .idm_applicationmanage_search{
        margin-top: 100px;
        padding-right: 20px;
        .search_main{
            width: 40px;
            height: 40px;
            line-height: 40px;
            // position: fixed;
            // bottom: 160px;
            // right: 20px;
            text-align: center;
            background: #1989fa;
            border-radius: 50%;
        }
    }
}
</style>