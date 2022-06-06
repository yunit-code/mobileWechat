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
        <!-- {{propData.fontContent}} -->
        <div class="idm_applicationcenter">
            <div v-if="propData.showTitle" class="idm_applicationcenter_title flex_between">
                <div class="idm_applicationcenter_title_left flex_start">
                    <svg v-if="propData.showTitleIcon && propData.titleIconPosition == 'left' && propData.titleIconClass && propData.titleIconClass.length" class="idm_filed_svg_icon idm_applicationcenter_title_left_icon1" aria-hidden="true" >
                        <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
                    </svg>
                    <svg-icon v-else-if="propData.showTitleIcon && propData.titleIconPosition == 'left' && ((!propData.titleIconClass) || !propData.titleIconClass.length)" icon-class="application-icon" />
                    <div class="idm_applicationcenter_title_left_text">{{ propData.title || '应用中心' }}</div>
                    <svg v-if="propData.showTitleIcon && propData.titleIconPosition == 'right' && propData.titleIconClass && propData.titleIconClass.length" class="idm_filed_svg_icon idm_applicationcenter_title_left_icon2" aria-hidden="true" >
                        <use :xlink:href="`#${propData.titleIconClass[0]}`"></use>
                    </svg>
                    <svg-icon v-else-if="propData.showTitleIcon && propData.titleIconPosition == 'right' && ((!propData.titleIconClass) || !propData.titleIconClass.length)" icon-class="application-icon" />
                </div>
                <div @click="toApplicationManage" v-if="propData.isMyApplication" class="idm_applicationcenter_title_right">
                    <van-icon class="idm-message-list-box-top-more" name="ellipsis" />
                </div>
            </div>
            <div class="idm_applicationcenter_main">
                <div v-if="is_loading" class="loading_box">
                    <van-loading />
                </div>
                <div v-else class="block">
                    <div v-if="application_data && application_data.length" class="block">
                        <div v-if="!propData.isSlide" class="block">
                            <van-grid :border="false" :column-num="propData.showColumn">
                                <van-grid-item v-for="(item,index) in application_data" :key="item.key">
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
                        <div v-else class="block">
                            <div class="swiper_block flex_start">
                                <span @click="toApplication(item)" v-for="(item,index) in application_data" :key="index" class="swiper_block_list idm_applicationcenter_main_list">
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
                    <van-empty class="empty_block" v-else description="暂无数据">
                        <template #image> <span></span> </template>
                        <template #description>
                            <div>暂无数据</div>
                        </template>
                    </van-empty>
                </div>
            </div>

            <van-popup id="application_manage_pop" v-model="is_application_manage_show" overlay-class="application_manage_pop" @close="closeApplicationManage" closeable round>
                <IApplicationManage :datas="propData" @openApplicationSearch="openApplicationSearch" v-if="is_application_manage_show"></IApplicationManage>
            </van-popup> 
            <van-popup id="application_search_pop" v-model="is_application_search_show" overlay-class="application_search_pop" @close="closeApplicationSearch" closeable round>
                <IApplicationSearch :datas="propData" v-if="is_application_search_show"></IApplicationSearch>
            </van-popup>
        </div>
    </div>
</template>

<script>
import { base_url } from '../api/config.js'
import { translatePxToAdaptationApi } from '@/utils/adaptationScreen'
import { Grid, GridItem, Icon, Popup, Empty, Loading } from 'vant';
import 'vant/lib/grid/style';
import 'vant/lib/icon/style';
import 'vant/lib/popup/style';
import 'vant/lib/empty/style';
import 'vant/lib/loading/style';
import IApplicationManage from './IApplicationManage.vue'
import IApplicationSearch from './IApplicationSearch.vue'
export default {
    name: 'IApplicationCenter',
    components: {
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Empty.name]: Empty,
        [Loading.name]: Loading,
        IApplicationManage,
        IApplicationSearch
    },
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {

            },
            application_data: [ ],
            have_power_application_data_ids: [],//用户有权限的appid
            have_power_application_data: [],//用户有权限的app
            is_application_manage_show: false,
            is_application_search_show: false,
            is_loading: false,
            clientWidth: 414,
        }
    },
    props: {
    },
    watch: {
        'propData.showRows': function(value,old) {
            this.changeLines()
        },
        'propData.applicationList': {
            handler(value) {
                if ( this.propData.applicationList && this.propData.applicationList.length && !this.propData.isMyApplication ) {
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
        console.log('moduleObject',this.moduleObject)
        console.log('propData',this.propData)
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
        openApplicationSearch() {
            this.is_application_manage_show = false;
            this.is_application_search_show = true;
        },
        closeApplicationSearch() {
            this.is_application_search_show = false;
            this.initApplicationData();
        },
        /** * 主题颜色 */
        convertThemeListAttrToStyleObject() {
            const themeList = this.propData.themeList;
            const themeNamePrefix = IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix ? IDM.setting.applications.themeNamePrefix : "idm-theme-";
            if (!themeList) {
                let arr = ['blue','red','green']
                for( let i = 0; i < arr.length; i++ ){
                    IDM.setStyleToPageHead(
                        "." + themeNamePrefix + arr[i] + " #" + (this.moduleObject.packageid || "module_demo") +
                            " .idm_applicationcenter_title_left .idm_filed_svg_icon",
                        { "color": '' }
                    );
                }
                return;
            }
            
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i];
                let styleObject = {
                    "background-color": item.minorColor ? item.minorColor.hex8 : "",
                };
                let fontStyleObject = {
                    "color": item.mainColor ? item.mainColor.hex8 : "",
                }
                IDM.setStyleToPageHead(
                    "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") +
                        " .idm_applicationcenter_title_left .idm_filed_svg_icon",
                    fontStyleObject
                );
                // IDM.setStyleToPageHead(
                //     "." +
                //         themeNamePrefix +
                //         item.key +
                //         " #" +
                //         (this.moduleObject.packageid || "module_demo") +
                //         " .idm_applicationcenter",
                //     styleObject
                // );
                
                // IDM.setStyleToPageHead(
                //     "." +
                //         themeNamePrefix +
                //         item.key +
                //         " #" +
                //         (this.moduleObject.packageid || "module_demo") +
                //         " .idm_applicationcenter_main_list",
                //     fontStyleObject
                // );
                // IDM.setStyleToPageHead(
                //     "." +
                //         themeNamePrefix +
                //         item.key +
                //         " #" +
                //         (this.moduleObject.packageid || "module_demo") +
                //         " .idm_applicationcenter_title_right i",
                //     fontStyleObject
                // );
                // IDM.setStyleToPageHead(
                //     "." +
                //         themeNamePrefix +
                //         item.key +
                //         " #" +
                //         (this.moduleObject.packageid || "module_demo") +
                //         " .idm_applicationcenter_title_left_text",
                //     fontStyleObject
                // );
            }
        },
        closeApplicationManage() {
            console.log('应用中心propsdata',this.propData)
            this.initApplicationData();
        },
        watchApplicationChange(value,old) {
            if ( (!value) || !value.length ) {
                return
            }
            if ( value.length != old.length ) {
                return
            }
            if( value.length == old.length ) {
                var is_sort_application = this.isSortApplication(value,old)
                for( let i = 0,maxi = value.length;i < maxi;i++ ) {
                    if ( value[i].selectApplication && value[i].selectApplication.value && !is_sort_application ) {
                        if ( (!old[i].selectApplication) || value[i].selectApplication.value != old[i].selectApplication.value ) {
                            value[i].applicationName = value[i].selectApplication.title;
                            value[i].applicationIconUrl = value[i].selectApplication.imageUrl;
                            value[i].applicationUrl = value[i].selectApplication.appUrl;
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
            console.log('获取用户信息',user_info)
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
            if ( this.propData.isMyApplication ) {
                this.getMyApplicatinData()
            } else {
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
            }
        },
        changeApplicationIconAndUrl(data) {
            console.log('更改服务器域名',data)
            if ( !data ) {
                return []
            }
            let application_list = JSON.parse(JSON.stringify(data));
            console.log('更改服务器域名-have_power_application_data',this.have_power_application_data)
            for( let i = 0,maxi = application_list.length;i < maxi;i++ ) {
                if ( application_list[i] && application_list[i].selectApplication ) {
                    let item = this.have_power_application_data.find((item1) => {
                        return item1.value == application_list[i].selectApplication.value
                    })
                    console.log('更改服务器域名-item',item)
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
            console.log('更改服务器域名-application_list',application_list)
            return application_list
        },
        getMyApplicatinData() {
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            this.is_loading = true
            window.IDM.http.get(base_url + '/ctrl/tencentApp/queryMyFavorite',{
                componentId: this.moduleObject ? this.moduleObject.id : ''
            }).then((res) => {
                this.is_loading = false;
                if ( res.data && res.data.type == 'success' ) {
                    this.makeMyApplicationData(res.data.data)
                }
            }).catch(function (error) {
                this.is_loading = false;
            });
        },
        makeMyApplicationData(data) {
            let application_data = [];
            for( let i = 0,maxi = data.length;i < maxi;i++ ) {
                application_data.push({
                    selectApplication: data[i],
                    showTodoNumber: true,
                    todoNumber: 0,
                    isUserEditable: false
                })
            }
            this.application_data = application_data;
            // 判断是否有数据源角标配置
            this.getApplicationMarkNumber()
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
            if ( item.selectApplication && item.selectApplication.imageUrl && !item.isUserEditable ) {
                return item.selectApplication.imageUrl
            } else if ( item.isUserEditable ) {
                if ( item.applicationIconUrl ) {
                    return window.IDM.url.getWebPath(item.applicationIconUrl)
                } else if ( item.selectApplication && item.selectApplication.imageUrl ) {
                    return item.selectApplication.imageUrl
                } else {
                    return 
                }
            }
        },
        toApplication(item) {
            if ( this.moduleObject.env != 'develop' && item.selectApplication ) {
                let url = item.applicationUrl ? item.applicationUrl : (item.selectApplication ? item.selectApplication.appUrl : '')
                if ( url ) {
                    if ( item.applicationJumpType == '_blank' ) {
                        window.open(url,item.applicationJumpType);
                    } else if ( item.applicationJumpType == '_self' ) {
                        window.location.href = url
                    } else {
                        try {
                            wx.invoke('openUrl', {
                                "type": 0, //0或不填表示使用内部浏览器新窗口打开，1表示用系统浏览器打开
                                "url": url, //url地址
                            }, function(res){
                                if (res.err_msg != "openUrl:ok") {
                                    window.location.href = url
                                    //错误处理
                                }
                            });
                        } catch (error) {
                            window.location.href = url
                        }
                    }
                }   
            }
        },
        toApplicationManage() {
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            this.is_application_manage_show = true;
        },
        changeLines() {
            if ( this.application_data && (this.application_data.length > this.propData.showRows * this.propData.showColumn) ) {
                this.application_data.splice(this.propData.showRows * this.propData.showColumn)
            }
        },
        getApplicationMarkNumber() {
            for( let i = 0,maxi = this.application_data.length;i < maxi;i++ ) {
                if ( this.propData.showTodoNumber && this.application_data[i].showTodoNumber && this.application_data[i].selectApplication && this.application_data[i].selectApplication.sourceId ) {
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
                }
            }).then(result=>{
                if ( result&&result.data&&result.data.type == 'success' && result.data.data ) {
                    if ( !this.propData.dataFiled ) {
                        this.$set(this.application_data[index], "todoNumber", result.data.data.count);
                    } else {
                        this.$set(this.application_data[index], "todoNumber", result.data.data[this.propData.dataFiled]);
                    }
                }
            })
        },

        /** * 提供父级组件调用的刷新prop数据组件 */
        propDataWatchHandle(propData) {
            console.log('propData',propData)
            this.watchApplicationChange(propData.compositeAttr.applicationList,this.application_data)
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
            return translatePxToAdaptationApi(data,this.propData.adaptationBase,this.propData.adaptationPercent,this.clientWidth,is_img)
        },
        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectInner()
            var styleObject = {};
            var styleObjectInner = {};
            var styleObjectTitle = {};
            var fontStyleObject = {};
            var styleObjectTitleIcon = {};
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
                if (this.propData.hasOwnProperty && this.propData.hasOwnProperty.call(this.propData, key)) {
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
                        case "titleFont":
                            styleObjectTitle["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectTitle["color"] = element.fontColors.hex8;
                            }
                            styleObjectTitle["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectTitle["font-style"] = element.fontStyle;
                            styleObjectTitle["font-size"] = this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit;
                            styleObjectTitle["line-height"] = this.translatePxToAdaptation(element.fontLineHeight) + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectTitle["text-align"] = element.fontTextAlign;
                            styleObjectTitle["text-decoration"] = element.fontDecoration;
                            break;
                        case "titleIconFontColor":
                            styleObjectTitleIcon["color"] = element.hex;
                            break
                        case "titleIconFontSize":
                            styleObjectTitleIcon["font-size"] = this.translatePxToAdaptation(element) + "px";
                            styleObjectTitleIcon["width"] = this.translatePxToAdaptation(element) + "px";
                            styleObjectTitleIcon["height"] = this.translatePxToAdaptation(element) + "px";
                            break
                        case "applicationImgWidth":
                            imgStyleObject['width'] = this.translatePxToAdaptation(element,true) + 'px'
                            imgStyleObject['height'] = this.translatePxToAdaptation(element,true) + 'px'
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationcenter_title_left_text", styleObjectTitle);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationcenter_title_left .idm_filed_svg_icon", styleObjectTitleIcon);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationcenter_main_list_name", fontStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationcenter .idm_applicationcenter_main_list .img_box", imgStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationcenter .idm_applicationcenter_main_list img", imgStyleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_applicationcenter .idm_applicationcenter_main_list svg", imgStyleObject);
            this.convertThemeListAttrToStyleObject()
            this.initApplicationData()
        },
        convertAttrToStyleObjectInner() {
            var styleObject = {};
            if (this.propData.bgSizeInner && this.propData.bgSizeInner == "custom") {
                styleObject["background-size"] = (this.propData.bgSizeWidthInner ? this.propData.bgSizeWidthInner.inputVal + this.propData.bgSizeWidthInner.selectVal : "auto") + " " + (this.propData.bgSizeHeightInner ? this.propData.bgSizeHeightInner.inputVal + this.propData.bgSizeHeightInner.selectVal : "auto")
            } else if (this.propData.bgSizeInner) {
                styleObject["background-size"] = this.propData.bgSizeInner;
            }
            if (this.propData.positionXInner && this.propData.positionXInner.inputVal) {
                styleObject["background-position-x"] = this.propData.positionXInner.inputVal + this.propData.positionXInner.selectVal;
            }
            if (this.propData.positionYInner && this.propData.positionYInner.inputVal) {
                styleObject["background-position-y"] = this.propData.positionYInner.inputVal + this.propData.positionYInner.selectVal;
            }

            for (const key in this.propData) {
                if (this.propData.hasOwnProperty && this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthInner":
                            styleObject['width'] = element;
                            break;
                        case "heightInner":
                            styleObject['height'] = element;
                            break;
                        case "bgColorInner":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "boxInner":
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
                        case "bgImgUrlInner":
                            styleObject["background-image"] = `url(${window.IDM.url.getWebPath(element)})`;
                            break;
                        case "positionXInner":
                            //背景横向偏移

                            break;
                        case "positionYInner":
                            //背景纵向偏移

                            break;
                        case "bgRepeatInner":
                            //平铺模式
                            styleObject["background-repeat"] = element;
                            break;
                        case "bgAttachmentInner":
                            //背景模式
                            styleObject["background-attachment"] = element;
                            break;
                        case "borderInner":
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
                        
                        
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm_applicationcenter_main', styleObject);
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
            this.initApplicationData()
        },
       
        /**
         * 组件通信：接收消息的方法
         * @param {
         *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
         * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
         *  message:{发送的时候传输的消息对象数据}
         *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
         *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
         * } messageObject 
         */
        receiveBroadcastMessage(messageObject) {
            console.log("应用组件收到消息", messageObject)
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
                const arr = this.propData.messageRefreshKey || []
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
.idm_applicationcenter {
    font-family: PingFangSC-Regular;
    text-align: center;
    border-radius: 10px;
    .idm_applicationcenter_title{
        padding: 10px 10px 7px 10px;
        .idm_applicationcenter_title_left_icon1{
            margin-right: 5px;
        }
        .idm_applicationcenter_title_left_text{
            margin-right: 5px;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #333333;
            font-weight: 600;
            line-height: 23px;
        }
        .idm_applicationcenter_title_right{
            line-height: 1;
            i{
                font-size: 23px;
            }
        }
    }
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
            padding: 7px 0 7px 0;
            &::-webkit-scrollbar { 
                width: 0 !important;
                height: 0 !important;
            }
            .swiper_block_list{
                width: 20%;
                position: relative;
                text-align: center;
                flex-shrink: 0;
            }
        }
    }
}
</style>
<style lang="scss">
.van-grid-item__content{
    padding: 7px 3px;
}
.van-popup{
    background-color: inherit;
}

.idm_filed_svg_icon {
    font-size: 14px;
    width: 14px;
    height: 14px;
    fill: currentColor;
    vertical-align: -0.15em;
    outline: none;
}
.idm_applicationcenter{
    .van-popup--center{
        width: 95% !important;
        height: 90vh !important;
        overflow-y: auto;
        padding: 40px 0 20px 0;
    }
    .application_search_pop{
        z-index: 10000;
    }
    .loading_box{
        padding: 20px 0;
        text-align: center;
    }
    .empty_block{
        padding: 10px 0;
        text-align: center;
        .van-empty__image{
            display: none;
        }
    }
}

</style>