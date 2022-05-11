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
        <div class="idm_applicationmanage">
            <div class="idm_applicationmanage_block">
                <div class="idm_applicationcenter_title flex_between">
                    <div class="idm_applicationcenter_title_left">
                        <div class="idm_applicationcenter_title_left_text">我的应用</div>
                    </div>
                    <div @click="manageApplication" class="idm_applicationcenter_title_right">管理</div>
                </div>
                <div class="idm_applicationcenter_main">
                    <van-grid :border="false" :column-num="5">
                        <van-grid-item v-for="(item,index) in my_application_data" :key="index">
                            <div @click="deleteApplication(item,index)" class="idm_applicationcenter_main_list">
                                <img :src="item.img">
                                <div class="idm_applicationcenter_main_list_name">{{ item.name }}</div>
                                <van-icon v-if="is_edit" class="icon" name="minus" color="#fff" />
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
                 <div class="idm_applicationcenter_main">
                    <van-tabs>
                        <van-tab v-for="(item,index) in application_data" :key="index" :title="item.type">
                            <van-grid :border="false" :column-num="5">
                                <van-grid-item v-for="(item,index) in item.data" :key="index">
                                    <div class="idm_applicationcenter_main_list">
                                        <img :src="item.img">
                                        <div class="idm_applicationcenter_main_list_name">{{ item.name }}</div>
                                        <div v-if="is_edit">
                                            <van-icon v-if="isHaveInMyApplication(item)" class="icon icon_disabled" name="plus" color="#fff" />
                                            <van-icon @click="addApplication(item)" v-else class="icon" name="plus" color="#fff" />
                                        </div>
                                    </div>
                                </van-grid-item>
                            </van-grid>
                        </van-tab>
                    </van-tabs>
                </div>
            </div>
            <div class="idm_applicationmanage_footer flex_between">
                <van-button @click="cancel" class="button" block type="default">取消</van-button>
                <van-button @save="save" class="button" block type="info">完成</van-button>
            </div>
            <div @click="search" class="idm_applicationmanage_search">
                <van-icon name="search" color="#fff"/>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid,GridItem,Tab,Tabs,Icon,Button } from 'vant';

import 'vant/lib/grid/style';
import 'vant/lib/tabs/style';
import 'vant/lib/icon/style';
import 'vant/lib/button/style';
export default {
    name: 'IApplicationManage',
    components: {
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [Icon.name]: Icon,
        [Button.name]: Button,
    },
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                showRows: 2,
                showColumn: 5,
            },
            is_edit: false,
            my_application_data: [
                {
                    key: '1',
                    img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                    name: '待阅文件',
                    number: 1
                },
                {
                    key: '1',
                    img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                    name: '已办文件',
                    number: 1
                },
                {
                    key: '1',
                    img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                    name: '我的收藏',
                    number: 1
                },
                {
                    key: '1',
                    img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                    name: '公文管理',
                    number: 1
                },
                {
                    key: '1',
                    img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                    name: '待办文件',
                    number: 1
                },
                {
                    key: '1',
                    img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                    name: '待阅文件',
                    number: 1
                },
            ],
            application_data: [
                {
                    type: '公文',
                    data: [
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '公文管理公文管理',
                            number: 1
                        },
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '待办文件',
                            number: 1
                        },
                    ]
                },
                {
                    type: '省委会议',
                    data: [
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '公文管理公文管理',
                            number: 1
                        },
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '待办文件',
                            number: 1
                        },
                    ]
                },
                {
                    type: '测试办公',
                    data: [
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '公文管理公文管理',
                            number: 1
                        },
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '待办文件',
                            number: 1
                        },
                    ]
                },
                {
                    type: '公文1',
                    data: [
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '公文管理公文管理',
                            number: 1
                        },
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '待办文件',
                            number: 1
                        },
                    ]
                },
                {
                    type: '公文2',
                    data: [
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '公文管理公文管理',
                            number: 1
                        },
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '待办文件',
                            number: 1
                        },
                    ]
                },
                 {
                    type: '公文3',
                    data: [
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '公文管理公文管理',
                            number: 1
                        },
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '待办文件',
                            number: 1
                        },
                    ]
                },
                {
                    type: '会议',
                    data: [
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '待阅文件',
                            number: 1
                        },
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '已办文件',
                            number: 1
                        },
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '待阅文件',
                            number: 1
                        },
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '已办文件',
                            number: 1
                        },
                        {
                            key: '1',
                            img: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
                            name: '我的收藏',
                            number: 1
                        }
                    ]
                },

                
                
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
        search() {
            this.is_edit = false;
            let urlObject = window.IDM.url.queryObject();
            let pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
            var clickNewFunction = this.propData.clickSearchFunction;
            clickNewFunction.forEach(item=>{
                window[item.name]&&window[item.name].call(this,{
                    urlData:urlObject,
                    pageId,
                    customParam:item.param,
                    _this:this
                });
            })
        },
        cancel() {
            this.is_edit = false;
            let urlObject = window.IDM.url.queryObject();
            let pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
            var clickNewFunction = this.propData.clickCancelFunction;
            clickNewFunction.forEach(item=>{
                window[item.name]&&window[item.name].call(this,{
                    urlData:urlObject,
                    pageId,
                    customParam:item.param,
                    _this:this
                });
            })
        },
        save() {
            let urlObject = window.IDM.url.queryObject();
            let pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
            var clickNewFunction = this.propData.clickSaveFunction;
            clickNewFunction.forEach(item=>{
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
                return item.name == e.name
            })
            if ( result && result.length ) {
                return true
            } else {
                return false
            }
        },
        changeLines() {
            if ( this.application_data > this.propData.showRows * this.propData.showColumn ) {
                this.application_data = this.application_data_copy.splice(0,this.propData.showRows * this.propData.showColumn)
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
            this.initData();
        },
        /**
         * 加载动态数据
         */
        initData() {
            let that = this;
            //所有地址的url参数转换
            var params = that.commonParam();
            switch (this.propData.dataSourceTypeMy) {
                case "customInterface":
                    this.propData.customInterfaceUrlMy && window.IDM.http.get(this.propData.customInterfaceUrlMy, params)
                        .then((res) => {
                            this.my_application_data = that.getExpressData("resultData", that.propData.dataFiledMy, res.data)
                        }).catch(function (error) {

                        });
                    break;
                case "pageCommonInterface":
                    //使用通用接口直接跳过，在setContextValue执行
                    break;
                case "customFunction":
                    if (this.propData.customFunctionMy && this.propData.customFunctionMy.length > 0) {
                        var resValue = "";
                        try {
                            resValue = window[this.propData.customFunctionMy[0].name] && window[this.propData.customFunctionMy[0].name].call(this, { ...params, ...this.propData.customFunctionMy[0].param, moduleObject: this.moduleObject });
                        } catch (error) {

                        }
                        that.my_application_data = resValue;
                    }
                    break;
            }
            switch (this.propData.dataSourceTypeAll) {
                case "customInterface":
                    this.propData.customInterfaceUrlAll && window.IDM.http.get(this.propData.customInterfaceUrlAll, params)
                        .then((res) => {
                            this.application_data = that.getExpressData("resultData", that.propData.dataFiledAll, res.data)
                        }).catch(function (error) {

                        });
                    break;
                case "pageCommonInterface":
                    //使用通用接口直接跳过，在setContextValue执行
                    break;
                case "customFunction":
                    if (this.propData.customFunctionAll && this.propData.customFunctionAll.length > 0) {
                        var resValue = "";
                        try {
                            resValue = window[this.propData.customFunctionAll[0].name] && window[this.propData.customFunctionAll[0].name].call(this, { ...params, ...this.propData.customFunctionAll[0].param, moduleObject: this.moduleObject });
                        } catch (error) {

                        }
                        that.application_data = resValue;
                    }
                    break;
            }
        },
        /**
         * 通用的获取表达式匹配后的结果
         */
        getExpressData(dataName, dataFiled, resultData) {
            //给defaultValue设置dataFiled的值
            var _defaultVal = undefined;
            if (dataFiled) {
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
            if (this.propData.customFunction && this.propData.customFunction.length > 0) {
                var params = this.commonParam();
                var resValue = "";
                try {
                    resValue = window[this.propData.customFunction[0].name] && window[this.propData.customFunction[0].name].call(this, {
                        ...params,
                        ...this.propData.customFunction[0].param,
                        moduleObject: this.moduleObject,
                        expressData: _defaultVal, interfaceData: resultData
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
            if (object.key == this.propData.dataNameMy) {
                this.my_application_data = this.getExpressData(this.propData.dataNameMy, this.propData.dataFiledMy, object.data)
            }
            if (object.key == this.propData.dataNameAll) {
                this.application_data = this.getExpressData(this.propData.dataNameAll, this.propData.dataFiledAll, object.data)
            }
        }
    }
}
</script>
<style lang="scss">
.idm_applicationmanage {
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
                img{
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
                    right: -7px;
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
        position: fixed;
        bottom: 80px;
        padding: 0 20px;
        background: white;
        .button:nth-child(1){
            margin-right: 20px;
        }
    }
    .idm_applicationmanage_search{
        width: 40px;
        height: 40px;
        line-height: 40px;
        position: fixed;
        bottom: 160px;
        right: 20px;
        text-align: center;
        background: #1989fa;
        border-radius: 50%;
    }
}
</style>