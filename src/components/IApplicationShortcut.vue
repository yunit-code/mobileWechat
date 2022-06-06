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
        <div class="idm_applicationshortcut">
            <div v-if="application_data && application_data.length" class="block">
                <div v-if="!propData.isSlide" class="idm_applicationcenter_main">
                    <van-grid :border="false" :column-num="propData.showColumn">
                        <van-grid-item v-for="(item,index) in application_data" :key="index">
                            <div @click="toApplication(item)" class="idm_applicationcenter_main_list">
                                <div class="img_box">
                                    <img v-if="(item.selectApplication && item.selectApplication.imageUrl) || item.applicationIconUrl" :src="getApplicationImgUrl(item)">
                                    <svg-icon v-else icon-class="application" />
                                    <div v-if="propData.showTodoNumber && item.showTodoNumber && item.todoNumber" class="number">{{ item.todoNumber }}</div>
                                </div>
                                <div class="idm_applicationcenter_main_list_name">{{ getApplicationName(item) }}</div>
                            </div>
                        </van-grid-item>
                    </van-grid>
                </div>
                <div v-else class="idm_applicationcenter_main">
                    <div class="swiper_block flex_start">
                        <span @click="toApplication(item)" v-for="(item,index) in application_data" :key="index" class="swiper_block_list">
                            <div class="img_box">
                                <img v-if="(item.selectApplication && item.selectApplication.imageUrl) || item.applicationIconUrl" :src="getApplicationImgUrl(item)">
                                <svg-icon v-else icon-class="application" />
                                <div v-if="propData.showTodoNumber && item.showTodoNumber && item.todoNumber" class="number">{{ item.todoNumber }}</div>
                            </div>
                            <div class="idm_applicationcenter_main_list_name">{{ getApplicationName(item) }}</div>
                        </span>
                    </div>
                </div>
            </div>
            <div v-else class="block">
                <van-empty class="empty_block" description="暂无数据">
                    <template #description>
                        <div>暂无数据</div>
                    </template>
                </van-empty>
            </div>
        </div>
    </div>
</template>

<script>
import { base_url } from '../api/config.js'
import { translatePxToAdaptationApi } from '@/utils/adaptationScreen'

import { Grid, GridItem, Empty } from 'vant';
import 'vant/lib/grid/style';
import 'vant/lib/empty/style';
export default {
    name: 'IApplicationShortcut',
    components: {
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
        [Empty.name]: Empty
    },
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                
            },
            application_data: [ ],
            have_power_application_data_ids: [],//用户有权限的app
            have_power_application_data: [],
            clientWidth: 414,
        }
    },
    props: {
    },
    watch: {
        'propData.isSlide': function(value,old) {
            if ( !value ) {
                this.changeLines()
            }
        },
        'propData.showRows': function(value,old) {
            this.changeLines()
        },
        'propData.applicationList': {
            handler(value) {
                if ( this.propData.applicationList && this.propData.applicationList.length ) {
                    let applicationList = this.changeApplicationIconAndUrl(this.propData.applicationList)
                    this.application_data = JSON.parse(JSON.stringify(applicationList))
                } else {
                    this.application_data = [];
                }
                this.changeLines()
            },
            deep: true
        },
    },
    created() {
        this.moduleObject = this.$root.moduleObject
        this.getClientWidth()
        this.getHavePowerApplication()
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
            const themeList = this.propData.themeList;
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
                    "background-color": item.minorColor ? item.minorColor.hex8 : "",
                };
                let fontStyleObject = {
                    "color": item.mainColor ? item.mainColor.hex8 : "",
                }
                // IDM.setStyleToPageHead(
                //     "." +
                //         themeNamePrefix +
                //         item.key +
                //         " #" +
                //         (this.moduleObject.packageid || "module_demo") +
                //         " .idm_applicationshortcut",
                //     styleObject
                // );
                // IDM.setStyleToPageHead(
                //     "." +
                //         themeNamePrefix +
                //         item.key +
                //         " #" +
                //         (this.moduleObject.packageid || "module_demo") +
                //         " .idm_applicationshortcut .idm_applicationcenter_main_list_name",
                //     fontStyleObject
                // );
            }
        },
        watchApplicationChange(value,old) {
            console.log('value',value)
            console.log('old',old)
            if ( (!value) || !value.length ) {
                return
            }
            if ( value.length != old.length ) {
                return
            }
            console.log('555')
            if( value.length == old.length ) {
                var is_sort_application = this.isSortApplication(value,old)
                console.log('is_sort_application',is_sort_application)
                for( let i = 0,maxi = value.length;i < maxi;i++ ) {
                    if ( value[i].selectApplication && value[i].selectApplication.value && !is_sort_application ) {
                        if ( (!old[i].selectApplication) || value[i].selectApplication.value != old[i].selectApplication.value ) {
                            value[i].applicationName = value[i].selectApplication.title;
                            value[i].applicationIconUrl = value[i].selectApplication.imageUrl;
                            value[i].applicationUrl = value[i].selectApplication.appUrl;
                            console.log('更改属性值',value)
                            IDM.develop.externalMixAttributeChangeHandle({
                                applicationList: JSON.parse(JSON.stringify(value))
                            },this.moduleObject.packageid,-1,false)
                        }
                    }

                }
            }
            
        },
        isSortApplication(value,old) {
            var flag = true;
            for( let i = 0,maxi = value.length;i < maxi;i++ ) {
                if ( value[i].selectApplication && value[i].selectApplication.value ) {
                    let is_change_application = this.isChangeSelectedApplication(value[i].selectApplication.value,old)
                    let is_have_in_selected = this.isHaveInSelectedApplication(value,value[i].selectApplication.value)
                    console.log('is_change_application',is_change_application)
                    if ( (!is_change_application) || !is_change_application.length ) {
                        flag = false
                        return flag
                    }
                    if ( is_have_in_selected && is_have_in_selected.length > 1 ) {
                        flag = false
                        return flag
                    }
                }
            }
            return flag
        },
        isHaveInSelectedApplication(value,id) {
            let result = value.filter((item) => {
                return item.selectApplication && item.selectApplication.value == id
            })
            return result
        },
        isChangeSelectedApplication(id,old) {
            let result = old.filter((item) => {
                return item.selectApplication && item.selectApplication.value == id
            })
            return result
        },
        getHavePowerApplication() {
            let user_info = window.IDM.user.getCurrentUserInfo()
            let apps = []
            let have_power_application_data_ids = [];
            if ( user_info && user_info.appRoleList && user_info.appRoleList.length ) {
                apps = user_info.appRoleList
                this.have_power_application_data = user_info.appRoleList;
            }
            apps.forEach((item) => {
                have_power_application_data_ids.push(item.value)
            })
            this.have_power_application_data_ids = have_power_application_data_ids;
        },
        initApplicationData() {
            if ( this.propData.applicationList && this.propData.applicationList.length ) {
                let applicationList = this.changeApplicationIconAndUrl(this.propData.applicationList)
                let application_data = [];
                for( let i = 0,maxi = applicationList.length;i < maxi;i++ ) {
                    if ( this.moduleObject.env == 'develop' || !applicationList[i].applicationOpenValid ) {
                        application_data.push(applicationList[i])
                    } else {
                        if ( applicationList[i].selectApplication && applicationList[i].selectApplication.value && this.have_power_application_data_ids.indexOf(applicationList[i].selectApplication.value) != -1 ) {
                            application_data.push(applicationList[i])
                        }
                    }
                }
                this.application_data = JSON.parse(JSON.stringify(application_data))
            }
            this.changeLines()
            this.getApplicationMarkNumber()
        },
        changeApplicationIconAndUrl(data) {
            if ( !data ) {
                return []
            }
            let application_list = JSON.parse(JSON.stringify(data));
            for( let i = 0,maxi = application_list.length;i < maxi;i++ ) {
                if ( application_list[i] && application_list[i].selectApplication ) {
                    let item = this.have_power_application_data.find((item1) => {
                        return item1.value == application_list[i].selectApplication.value
                    })
                    if ( item ) {
                        application_list[i].selectApplication.imageUrl = item.imageUrl;
                        application_list[i].selectApplication.appUrl = item.appUrl;
                        if ( !application_list[i].isUserEditable ) {
                            application_list[i].applicationIconUrl = item.imageUrl;
                            application_list[i].applicationUrl = item.appUrl;
                        }
                    }
                }
            }
            return application_list
        },
        getApplicationMarkNumber() {
            console.log('application_data',this.application_data)
            for( let i = 0,maxi = this.application_data.length;i < maxi;i++ ) {
                if ( this.propData.showTodoNumber && this.application_data[i].showTodoNumber &&  this.application_data[i].selectApplication && this.application_data[i].selectApplication.sourceId ) {
                    this.getApplicationMarkNumberSubmit(i,this.application_data[i].selectApplication.sourceId)
                }
            }
        },
        getApplicationMarkNumberSubmit(index,sourceId) {
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            window.IDM.http.post(base_url + '/ctrl/dataSource/getDatas',{
                id: sourceId
            },{
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                },
            }).then(result=>{
                console.log('角标接口请求回参',result)
                if ( result&&result.data&&result.data.type == 'success' && result.data.data ) {
                    if ( !this.propData.dataFiled ) {
                        console.log(456)
                        this.$set(this.application_data[index], "todoNumber", result.data.data.count);
                    } else {
                        console.log(123)
                        this.$set(this.application_data[index], "todoNumber", result.data.data[this.propData.dataFiled]);
                    }
                }
            })
        },
        getApplicationName(item) {
            if ( item.applicationName ) {
                return item.applicationName
            } else if ( item.selectApplication && item.selectApplication.title ) {
                return item.selectApplication.title
            } else {
                return '应用名称'
            }
        },
        getApplicationImgUrl(item) {
            if ( item.applicationIconUrl ) {
                return window.IDM.url.getWebPath(item.applicationIconUrl)
            } else if ( item.selectApplication && item.selectApplication.imageUrl ) {
                return item.selectApplication.imageUrl
            } else {

            }
        },
        changeLines() {
            if ( this.propData.isSlide ) {
                return
            }
            if ( this.application_data && (this.application_data.length > this.propData.showRows * this.propData.showColumn) ) {
                this.application_data.splice(this.propData.showRows * this.propData.showColumn)
            }
        },
        toApplication(item) {
            if ( this.moduleObject.env != 'develop' && item.selectApplication ) {
                let url = item.applicationUrl ? item.applicationUrl : (item.selectApplication ? item.selectApplication.appUrl : '')
                if ( url ) {
                    if ( item.applicationJumpType == '_self' ) {
                        window.location.href = url
                    } else {
                        window.open(url,item.applicationJumpType);
                    }
                }   
            }
        },

        /** * 提供父级组件调用的刷新prop数据组件 */
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            this.watchApplicationChange(propData.compositeAttr.applicationList,this.application_data)
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
            return translatePxToAdaptationApi(data,this.propData.adaptationBase,this.propData.adaptationPercent,this.clientWidth,is_img)
        },
        convertAttrToStyleObject() {
            // this.convertThemeListAttrToStyleObject()
            var styleObject = {};
            var fontStyleObject = {};
            var imgStyleObject = {};

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
                            fontStyleObject["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                fontStyleObject["color"] = element.fontColors.hex8;
                            }
                            fontStyleObject["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            fontStyleObject["font-style"] = element.fontStyle;
                            fontStyleObject["font-size"] = this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit;
                            fontStyleObject["line-height"] = this.translatePxToAdaptation(element.fontLineHeight) + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            fontStyleObject["text-align"] = element.fontTextAlign;
                            fontStyleObject["text-decoration"] = element.fontDecoration;
                            break;
                        case "applicationImgWidth":
                            imgStyleObject['width'] = this.translatePxToAdaptation(element,true) + 'px'
                            imgStyleObject['height'] = this.translatePxToAdaptation(element,true) + 'px'
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationshortcut .idm_applicationcenter_main_list_name", fontStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationshortcut .idm_applicationcenter_main_list .img_box", imgStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationshortcut .idm_applicationcenter_main_list .img_box img", imgStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationshortcut .idm_applicationcenter_main_list svg", imgStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationshortcut .swiper_block_list .img_box", imgStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationshortcut .swiper_block_list .img_box img", imgStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationshortcut .swiper_block_list svg", imgStyleObject);
            this.reload();
        },
        /**
         * 通用的url参数对象
         * 所有地址的url参数转换
         */
        commonParam() {
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
        reload() {
            //请求数据源
            this.initApplicationData();
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
        receiveBroadcastMessage(messageObject) {
            console.log("组件收到消息", messageObject)
            if (messageObject.type && messageObject.type == "linkageShowModule") {
                this.showThisModuleHandle();
            } else if (messageObject.type && messageObject.type == "linkageHideModule") {
                this.hideThisModuleHandle();
            } else if ( messageObject.type && messageObject.type == "linkageReload" ) {
                this.initApplicationData()
            } else if ( messageObject.type && messageObject.type == "pageResize" ) {
                this.clientWidth = messageObject.message ? messageObject.message.width : 414;
                this.convertAttrToStyleObject()
            }
            // 配置了刷新KEY，消息类型是websocket，收到的消息对象有message并不为空
            if(this.propData.messageRefreshKey && this.propData.messageRefreshKey.length && messageObject.type === 'websocket' && messageObject.message){
                const messageData = typeof messageObject.message === 'string' && JSON.parse(messageObject.message) || messageObject.message
                const arr = this.propData.messageRefreshKey || [];
                if(messageData.badgeType && arr.includes(messageData.badgeType)){
                    this.getApplicationMarkNumber()
                }
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
        sendBroadcastMessage(object) {
            window.IDM.broadcast && window.IDM.broadcast.send(object);
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
            // if (object.key == this.propData.dataName) {
            //     this.$set(this.propData, "applicationList", this.getExpressData(this.propData.dataName, this.propData.dataFiled, object.data));
            // }
        }
    }
}
</script>
<style lang="scss">
.van-grid-item__content{
    padding: 7px 3px;
}
.idm_applicationshortcut {
    width: auto;
    font-size: 12px;
    color: #333333;
    text-align: center;
    border-radius: 10px;
    .idm_applicationcenter_main{
        .idm_applicationcenter_main_list{
            position: relative;
            text-align: center;
            img,svg{
                width: 40px;
                height: 40px;
            }
            .img_box{
                width: 40px;
                margin: 0 auto 2.5px auto;
                position: relative;
            }
            .number{
                width: 15px;
                height: 15px;
                line-height: 15px;
                position: absolute;
                top: -7px;
                right: -7px;
                text-align: center;
                font-size: 12px;
                overflow: hidden;
                color: white;
                background: #E81B1B;
                border-radius: 50%;
            }
        }
        .swiper_block{
            width: auto;
            overflow: auto;
            flex-shrink: 0;
            flex-wrap: nowrap;
            flex-grow: 0;
            padding: 10px 0 10px 0;
            &::-webkit-scrollbar { 
                width: 0 !important 
            }
            .swiper_block_list{
                width: 20%;
                position: relative;
                text-align: center;
                flex-shrink: 0;
                img,svg{
                    width: 100%;
                }
                .img_box{
                    width: 40px;
                    margin: 0 auto 2.5px auto;
                    position: relative;
                }
                .number{
                    width: 15px;
                    height: 15px;
                    line-height: 15px;
                    position: absolute;
                    top: -7px;
                    right: -7px;
                    text-align: center;
                    font-size: 12px;
                    overflow: hidden;
                    color: white;
                    background: #E81B1B;
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>
<style lang="scss">
    .idm_applicationshortcut{
        .empty_block{
            padding: 10px 0;
            text-align: center;
            .van-empty__image{
                display: none;
            }
        }
    }
</style>