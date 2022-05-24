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
        <div class="idm_iapplicationsearch">
            <div class="search_box">
                <van-sticky>
                    <van-search v-model="search_text" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" />
                </van-sticky>
            </div>
            <div class="idm_iapplicationsearch_main">
                <div v-if="is_loading" class="loading_box">
                    <van-loading vertical>加载中...</van-loading>
                </div>
                <div v-else class="block">
                    <div v-if="application_data && application_data.length" class="block">
                        <div v-for="(item,index) in application_data" :key="index" class="list flex_between">
                            <div class="list_left flex_start">
                                <img v-if="item.imageUrl" :src="item.imageUrl">
                                <svg-icon v-else icon-class="application" />
                                <span>{{ item.title || '应用' }}</span>
                            </div>
                            <div class="list_right">
                                <span v-if="item.is_favorite == '1'" class="add_disabled">已添加</span>
                                <span @click="add(item,index)" v-else class="add">添加</span>
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
        </div>
    </div>
</template>

<script>
import { base_url } from '../api/config.js'

import { Search,Sticky,Toast,Loading } from 'vant';
import 'vant/lib/search/style';
import 'vant/lib/sticky/style';
import 'vant/lib/toast/style';
import 'vant/lib/loading/style';
export default {
    name: 'IApplicationSearch',
    components: {
        [Search.name]: Search,
        [Sticky.name]: Sticky,
        [Toast.name]: Toast,
        [Loading.name]: Loading,
    },
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {

            },
            search_text: '',
            application_data: [ ],
            is_loading: false
        }
    },
    props: {
    },
    created() {
        this.moduleObject = this.$root.moduleObject
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
                    "color": item.mainColor ? item.mainColor.hex8 : "",
                };
                let fontStyleObject = {
                    "color": item.mainColor ? item.mainColor.hex8 : "",
                }
                let borderStyleObject = {
                    "border-bottom": '1px solid ' + (item.mainColor ? item.mainColor.hex8 : ""),
                }
                IDM.setStyleToPageHead(
                    "." +
                        themeNamePrefix +
                        item.key +
                        " #" +
                        (this.moduleObject.packageid || "module_demo") +
                        " .idm_iapplicationsearch",
                    styleObject
                );
                IDM.setStyleToPageHead(
                    "." +
                        themeNamePrefix +
                        item.key +
                        " #" +
                        (this.moduleObject.packageid || "module_demo") +
                        " .idm_iapplicationsearch_main .list",
                    borderStyleObject
                );
            }
        },
        initDevelopData() {
            if ( this.moduleObject.env == 'develop' ) {
                this.application_data = [
                    {
                        title: '应用名称'
                    }
                ]
            }
        },
        getApplicationList() {
            if ( this.moduleObject.env == 'develop' || !this.propData.getAllApplicationUrl ) {
                return
            }
            this.is_loading = true;
            window.IDM.http.post(base_url + this.propData.getAllApplicationUrl,{
                appName: this.search_text
            }).then(result=>{
                this.is_loading = false;
                if(result && result.data && result.data.type == 'success'){
                    this.application_data = result.data.data
                } else {
                    Toast.fail(result.data.message);
                }
            }).catch((err) => {
                console.log(err)
                this.is_loading = false;
            })
        },
        add(item,index) {
            if ( this.moduleObject.env == 'develop' || !this.propData.addApplicationUrl ) {
                return
            }
            window.IDM.http.post(base_url + this.propData.addApplicationUrl,{
                appId: item.value,
                type: '1'
            }).then(result=>{
                if(result && result.data && result.data.type == 'success'){
                    this.$set(item,'is_favorite','1')
                    Toast.success('添加应用成功');
                } else {
                    Toast.fail(result.data.message);
                }
            })
        },
        onSearch() {
            this.getApplicationList()
        },
        onCancel() {
            this.search_text = '';
            this.getApplicationList()
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
            this.convertThemeListAttrToStyleObject()
            var styleObject = {};
            var styleObjectButton = {};
            var styleObjectButtonDisabled = {};
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
                        case "widthButton":
                            styleObjectButton['width'] = element;
                            break;
                        case "heightButton":
                            styleObjectButton['height'] = element;
                            break;
                        case "bgColorButton":
                            if (element && element.hex8) {
                                styleObjectButton["background-color"] = element.hex8;
                            }
                            break;
                        case "fontButton":
                            styleObjectButton["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectButton["color"] = element.fontColors.hex8;
                            }
                            styleObjectButton["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectButton["font-style"] = element.fontStyle;
                            styleObjectButton["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectButton["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectButton["text-align"] = element.fontTextAlign;
                            styleObjectButton["text-decoration"] = element.fontDecoration;
                            break;
                        case "widthButtonDisabled":
                            styleObjectButtonDisabled['width'] = element;
                            break;
                        case "heightButtonDisabled":
                            styleObjectButtonDisabled['height'] = element;
                            break;
                        case "bgColorButtonDisabled":
                            if (element && element.hex8) {
                                styleObjectButtonDisabled["background-color"] = element.hex8;
                            }
                            break;
                        case "fontButtonDisabled":
                            styleObjectButtonDisabled["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectButtonDisabled["color"] = element.fontColors.hex8;
                            }
                            styleObjectButtonDisabled["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectButtonDisabled["font-style"] = element.fontStyle;
                            styleObjectButtonDisabled["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectButtonDisabled["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectButtonDisabled["text-align"] = element.fontTextAlign;
                            styleObjectButtonDisabled["text-decoration"] = element.fontDecoration;
                            break;

                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .add', styleObjectButton);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .add_disabled', styleObjectButtonDisabled);
            this.initData();
        },
        
        /** * 重新加载 */
        reload() {
            this.initData()
        },
        initData() {
            this.getApplicationList()
        },
        
        showThisModuleHandle() {
            this.propData.defaultStatus = "default";
        },
        hideThisModuleHandle() {
            this.propData.defaultStatus = "hidden";
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
        }
    }
}
</script>
<style lang="scss">
.idm_iapplicationsearch {
    width: auto;
    max-height: 100vh;
    position: relative;
    overflow-y: auto;
    .search_box{
        
    }
    .idm_iapplicationsearch_main{
        padding: 0px 10px 20px 10px;
        .list{
            height: 45px;
            border-bottom: 1px solid ghostwhite;
            .list_left{
                img,svg{
                    width: 25px;
                    height: 25px;
                    margin-right: 5px;
                }
            }
            .list_right{
                span{
                    width: 45px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    display: inline-block;
                    font-size: 12px;
                    border-radius: 4px;
                }
                .add{
                    color: #1890ff;
                    background: #e6f7ff;
                }
                .add_disabled{
                    color: #999;
                    background: ghostwhite;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.idm_iapplicationsearch{
    .loading_box{
        margin-top: 150px;
        padding: 20px 0;
        text-align: center;
    }
    
}

</style>