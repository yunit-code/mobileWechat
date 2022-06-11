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
                <div class="idm_applicationmanage_title flex_between">
                    <div class="idm_applicationcenter_title_left">
                        <div class="idm_applicationmanage_title_left_text">{{ propData.title || '我的应用' }}</div>
                    </div>
                    <div @click="manageApplication" class="idm_applicationcenter_title_right">管理</div>
                </div>
                <div v-if="is_loading_my_application" class="loading_box loading_box_my">
                    <van-loading vertical>加载中...</van-loading>
                </div>
                <div v-else class="block">
                    <div v-if="my_application_data && my_application_data.length" class="idm_applicationmanage_main">
                        <van-grid :border="false" :column-num="5">
                            <van-grid-item v-for="(item,index) in my_application_data" :key="item.value">
                                <div class="idm_applicationmanage_main_list">
                                   <div class="img_box">
                                        <img v-if="item.imageUrl" :src="item.imageUrl">
                                        <svg-icon v-else icon-class="application" />
                                        <van-icon @click="deleteApplication(item,index)" v-if="is_edit" class="icon" name="minus" color="#fff" />
                                    </div>
                                    <div class="idm_applicationmanage_main_list_name">{{ item.title || ('应用' + index + 1) }}</div>
                                </div>
                            </van-grid-item>
                        </van-grid>
                    </div>
                    <van-empty class="empty_block" v-else image-size="80px" description="暂无数据">
                        <template #description>
                            <div>暂无数据</div>
                        </template>
                    </van-empty>
                </div>
                
            </div>
            
            <div class="idm_applicationmanage_block">
                <div class="idm_applicationmanage_title flex_between">
                    <div class="idm_applicationcenter_title_left">
                        <div class="idm_applicationmanage_title_left_text">全部应用</div>
                    </div>
                </div>
                <div v-if="is_loading_all_application" class="loading_box loading_box_all">
                    <van-loading vertical>加载中...</van-loading>
                </div>
                <div v-else class="block">
                    <div v-if="application_data && application_data.length" class="idm_applicationmanage_main">
                        <van-tabs>
                            <van-tab v-for="(item,index) in application_data" :key="item.value" :title="item.title">
                                <van-grid :border="false" :column-num="5">
                                    <van-grid-item v-for="(item1,index1) in item.children" :key="item1.value">
                                        <div class="idm_applicationmanage_main_list">
                                            <div class="img_box">
                                                <img v-if="item1.imageUrl" :src="item1.imageUrl">
                                                <svg-icon v-else icon-class="application" />
                                                <div v-if="is_edit">
                                                    <van-icon v-if="isHaveInMyApplication(item1)" class="icon icon_disabled" name="plus" color="#fff" />
                                                    <van-icon @click="addApplication(item1)" v-else class="icon" name="plus" color="#fff" />
                                                </div>
                                            </div>
                                            <div class="idm_applicationmanage_main_list_name">{{ item1.title || ('应用' + index1 + 1) }}</div>
                                            
                                        </div>
                                    </van-grid-item>
                                </van-grid>
                            </van-tab>
                        </van-tabs>
                    </div>
                    <van-empty class="empty_block" v-else image-size="80px" description="暂无数据">
                        <template #description>
                            <div>暂无数据</div>
                        </template>
                    </van-empty>
                </div>
                    
            </div>
            <div class="idm_applicationmanage_search flex_end">
                <div @click="search" class="search_main">
                    <van-icon name="search" color="#fff"/>
                </div>
            </div>
            <div v-if="is_edit" class="idm_applicationmanage_footer flex_between">
                <van-button @click="cancel" class="button" block type="default">取消</van-button>
                <van-button @click="save" class="button" block type="info">保存</van-button>
            </div>
            
        </div>
    </div>
</template>

<script>
import { base_url } from '../api/config.js'
import { translatePxToAdaptationApi } from '@/utils/adaptationScreen'
import { Grid,GridItem,Tab,Tabs,Icon,Button,Toast,Empty,Loading } from 'vant';

import 'vant/lib/grid/style';
import 'vant/lib/tabs/style';
import 'vant/lib/icon/style';
import 'vant/lib/button/style';
import 'vant/lib/toast/style';
import 'vant/lib/empty/style';
import 'vant/lib/loading/style';
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
        [Empty.name]: Empty,
        [Loading.name]: Loading
    },
    data() {
        return {
            moduleObject: {},
            propData: { },
            is_edit: false,
            my_application_data: [ ],
            application_data: [ ],
            is_loading_my_application: false,
            is_loading_all_application: false,
            clientWidth: 414,
        }
    },
    props: [ 'datas' ],
    created() {
        this.moduleObject = this.$root.moduleObject
        this.propData = {
            ...this.datas
        }
        console.log('moduleObject',this.moduleObject)
        console.log('propData',this.propData)
        this.getClientWidth()
        this.initDevelopData()
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
        /** * 主题颜色 */
        convertThemeListAttrToStyleObject() {
            const themeList = this.propData.themeListManage;
            console.log(themeList,"themeList")
            if (!themeList) {
                return;
            }
            const themeNamePrefix =
                IDM.setting &&
                IDM.setting.applications &&
                IDM.setting.applications.themeNamePrefix
                ? IDM.setting.applications.themeNamePrefix
                : "idm-theme-";
            console.log(themeNamePrefix,"themeNamePrefix")
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i];
                let styleObject = {
                    "color": item.mainColor ? item.mainColor.hex : "",
                    "background-color": item.minorColor ? item.minorColor.hex : "",
                };
                let fontStyleObject = {
                    "color": item.mainColor ? item.mainColor.hex : "",
                }
                
                // IDM.setStyleToPageHead(
                //     "." +
                //         themeNamePrefix +
                //         item.key +
                //         " #" +
                //         (this.moduleObject.packageid || "module_demo") +
                //         " .idm_applicationmanage",
                //     styleObject
                // );
                // IDM.setStyleToPageHead(
                //     "." +
                //         themeNamePrefix +
                //         item.key +
                //         " #" +
                //         (this.moduleObject.packageid || "module_demo") +
                //         " .idm_applicationmanage .van-tab",
                //     fontStyleObject
                // );
                // IDM.setStyleToPageHead(
                //     "." +
                //         themeNamePrefix +
                //         item.key +
                //         " #" +
                //         (this.moduleObject.packageid || "module_demo") +
                //         " .idm_applicationmanage .van-tabs__line",
                //     styleObject
                // );
                
            }
        },
        initDevelopData() {
            if ( this.moduleObject.env == 'develop' ) {
                this.my_application_data = [
                    {
                        value: '1',
                        imageUrl: '',
                        title: '应用名称'
                    }
                ]
                this.application_data = [
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
                    },
                    {
                        title: '会议',
                        value: '2',
                    },
                    {
                        title: '签报',
                        value: '3',
                    },
                    {
                        title: '日程',
                        value: '4',
                    },
                    {
                        title: '人事',
                        value: '4',
                    }
                ]
            }
        },
        getMyApplicatinData() {
            console.log('初始化数据',this.moduleObject)
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            this.is_loading_my_application = true;
            window.IDM.http.get(base_url + '/ctrl/tencentApp/queryMyFavorite',{
                componentId: this.moduleObject ? this.moduleObject.id : ''
            }).then((res) => {
                this.is_loading_my_application = false;
                if ( res.data && res.data.type == 'success' ) {
                    this.my_application_data = res.data.data
                }
            }).catch(function (error) {
                this.is_loading_my_application = false;
            });
        },
        getAllApplicatinData() {
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            this.is_loading_all_application = true;
            window.IDM.http.post(base_url + '/ctrl/tencentApp/queryAppGroupByGrant',{
                componentId: this.moduleObject ? this.moduleObject.id : ''
            }).then((res) => {
                    this.is_loading_all_application = false;
                    if ( res.data && res.data.type == 'success' ) {
                        this.application_data = res.data.data
                    }
                }).catch(function (error) {
                    this.is_loading_all_application = false;
                });
        },
        save() {
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            let appId_arr = [];
            let appId = '';
            this.my_application_data.forEach((item) => {
                appId_arr.push(item.value)
            })
            appId = appId_arr.join(',')
            window.IDM.http.post(base_url + '/ctrl/tencentApp/batchSetFavoriteApp',{
                appId: appId,
                componentId: this.moduleObject ? this.moduleObject.id : ''
            }).then((res) => {
                if ( res.data && res.data.type == 'success' ) {
                    Toast.success(res.data.message);
                    this.is_edit = false;
                } else {
                    Toast.fail(res.data.message)
                }
            }).catch(function (error) {

            });
        },
        search() {
            this.is_edit = false;
            this.$emit('openApplicationSearch')
        },
        cancel() {
            this.is_edit = false;
            this.initData()
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
        getClientWidth() {
            if ( this.moduleObject.env == 'develop' ) {
                return
            } else {
                this.clientWidth = window.innerWidth;
            }
        },
        translatePxToAdaptation(data,is_img) {
            return translatePxToAdaptationApi(data,this.propData.adaptationBaseManage,this.propData.adaptationPercentManage,this.clientWidth,is_img)
        },
        convertAttrToStyleObject() {
            this.convertThemeListAttrToStyleObject()
            var styleObject = {};
            var styleObjectTitle = {};
            var fontStyleObject = {};
            var navStyleBackground = {};
            var imgStyleObject = {};

            if (this.propData.bgSizeManage && this.propData.bgSizeManage == "custom") {
                styleObject["background-size"] = (this.propData.bgSizeWidthManage ? this.propData.bgSizeWidthManage.inputVal + this.propData.bgSizeWidthManage.selectVal : "auto") + " " + (this.propData.bgSizeHeightManage ? this.propData.bgSizeHeightManage.inputVal + this.propData.bgSizeHeightManage.selectVal : "auto")
            } else if (this.propData.bgSizeManage) {
                styleObject["background-size"] = this.propData.bgSizeManage;
            }
            if (this.propData.positionXManage && this.propData.positionXManage.inputVal) {
                styleObject["background-position-x"] = this.propData.positionXManage.inputVal + this.propData.positionXManage.selectVal;
            }
            if (this.propData.positionYManage && this.propData.positionYManage.inputVal) {
                styleObject["background-position-y"] = this.propData.positionYManage.inputVal + this.propData.positionYManage.selectVal;
            }
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthManage":
                            styleObject['width'] = element;
                            break
                        case "titleWidth":
                            styleObjectTitle['width'] = element;
                            break
                        case "heightManage":
                            styleObject['height'] = element;
                            break;
                        case "titleHeight":
                            styleObjectTitle['height'] = element;
                            break;
                        case "bgColorManage":
                            if (element && element.hex) {
                                styleObject["background-color"] = element.hex;
                                navStyleBackground["background-color"] = element.hex;
                            }
                            break;
                        case "titleBgColor":
                            if (element && element.hex) {
                                styleObjectTitle["background-color"] = element.hex;
                            }
                            break;
                        case "boxManage":
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
                        case "bgImgUrlManage":
                            styleObject["background-image"] = `url(${window.IDM.url.getWebPath(element)})`;
                            break;
                        case "positionXManage":
                            //背景横向偏移

                            break;
                        case "positionYManage":
                            //背景纵向偏移

                            break;
                        case "bgRepeatManage":
                            //平铺模式
                            styleObject["background-repeat"] = element;
                            break;
                        case "bgAttachmentManage":
                            //背景模式
                            styleObject["background-attachment"] = element;
                            break;
                        case "borderManage":
                            if (element.border.top.width > 0) {
                                styleObject["border-top-width"] = element.border.top.width + element.border.top.widthUnit;
                                styleObject["border-top-style"] = element.border.top.style;
                                if (element.border.top.colors.hex) {
                                    styleObject["border-top-color"] = element.border.top.colors.hex;
                                }
                            }
                            if (element.border.right.width > 0) {
                                styleObject["border-right-width"] = element.border.right.width + element.border.right.widthUnit;
                                styleObject["border-right-style"] = element.border.right.style;
                                if (element.border.right.colors.hex) {
                                    styleObject["border-right-color"] = element.border.right.colors.hex;
                                }
                            }
                            if (element.border.bottom.width > 0) {
                                styleObject["border-bottom-width"] = element.border.bottom.width + element.border.bottom.widthUnit;
                                styleObject["border-bottom-style"] = element.border.bottom.style;
                                if (element.border.bottom.colors.hex) {
                                    styleObject["border-bottom-color"] = element.border.bottom.colors.hex;
                                }
                            }
                            if (element.border.left.width > 0) {
                                styleObject["border-left-width"] = element.border.left.width + element.border.left.widthUnit;
                                styleObject["border-left-style"] = element.border.left.style;
                                if (element.border.left.colors.hex) {
                                    styleObject["border-left-color"] = element.border.left.colors.hex;
                                }
                            }

                            styleObject["border-top-left-radius"] = element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
                            styleObject["border-top-right-radius"] = element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
                            styleObject["border-bottom-left-radius"] = element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
                            styleObject["border-bottom-right-radius"] = element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
                            break;
                        case "fontManage":
                            fontStyleObject["font-family"] = element.fontFamily;
                            if (element.fontColors.hex) {
                                fontStyleObject["color"] = element.fontColors.hex;
                            }
                            fontStyleObject["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            fontStyleObject["font-style"] = element.fontStyle;
                            fontStyleObject["font-size"] = this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit;
                            fontStyleObject["line-height"] = this.translatePxToAdaptation(element.fontLineHeight) + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            fontStyleObject["text-align"] = element.fontTextAlign;
                            fontStyleObject["text-decoration"] = element.fontDecoration;
                            break;
                        case "titleFontManage":
                            styleObjectTitle["font-family"] = element.fontFamily;
                            if (element.fontColors.hex) {
                                styleObjectTitle["color"] = element.fontColors.hex;
                            }
                            styleObjectTitle["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectTitle["font-style"] = element.fontStyle;
                            styleObjectTitle["font-size"] = this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit;
                            styleObjectTitle["line-height"] = this.translatePxToAdaptation(element.fontLineHeight) + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectTitle["text-align"] = element.fontTextAlign;
                            styleObjectTitle["text-decoration"] = element.fontDecoration;
                            break;
                        case "applicationImgWidthManage":
                            imgStyleObject['width'] = this.translatePxToAdaptation(element,true) + 'px'
                            imgStyleObject['height'] = this.translatePxToAdaptation(element,true) + 'px'
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' #application_manage_pop', styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .van-tabs__wrap', navStyleBackground);

            window.IDM.setStyleToPageHead(this.moduleObject.id + ' #application_manage_pop' + " .idm_applicationmanage_title", styleObjectTitle);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' #application_manage_pop' + " .idm_applicationmanage_main_list_name", fontStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " #application_manage_pop .idm_applicationmanage_main_list .img_box", imgStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " #application_manage_pop .idm_applicationmanage_main_list img", imgStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " #application_manage_pop .idm_applicationmanage_main_list svg", imgStyleObject);
            
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
            } else if ( messageObject.type && messageObject.type == "linkageReload" ) {
                this.initData()
            } else if ( messageObject.type && messageObject.type == "pageResize" ) {
                this.clientWidth = messageObject.message ? messageObject.message.width : 414;
                this.convertAttrToStyleObject()
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
    // border-radius: 10px;
    .idm_applicationmanage_block{
        margin-bottom: 5px;
        .idm_applicationmanage_title{
            padding: 10px 10px 10px 10px;
            .idm_applicationmanage_title_left_text{
                font-family: PingFangSC-Medium;
                font-weight: 600;
                line-height: 23px;
            }
        }
        .idm_applicationmanage_main{
            // background: white;
            .idm_applicationmanage_main_list{
                position: relative;
                text-align: center;
                .img_box{
                    width: 40px;
                    position: relative;
                    margin: 0 auto 2.5px auto;
                }
                img,svg{
                    width: 40px;
                }
                .idm_applicationmanage_main_list_name{
                    font-size: 12px;
                    // color: #333333;
                    text-align: center;
                }
                .icon{
                    width: 15px;
                    height: 15px;
                    line-height: 15px;
                    position: absolute;
                    top: -6px;
                    right: -4px;
                    text-align: center;
                    font-size: 12px;
                    // color: white;
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
        margin-top: 40px;
        padding: 0 20px;
        // background: white;
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
<style lang="scss">
.idm_applicationmanage {
    .empty_block{
        padding: 10px 0;
    }
    .loading_box_my{
        margin: 20px 0 20px 0;
    }
    .loading_box_all{
        margin-top: 50px;
    }
    .van-tabs__nav{
        background-color: inherit;
    }
}
</style>