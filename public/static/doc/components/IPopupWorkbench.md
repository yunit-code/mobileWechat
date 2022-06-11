# 工作台切换
此组件为手机端工作台切换组件，固定悬浮于屏幕侧边，点击按钮可展开侧边栏。支持多种样式修改。
## 组件类名（className）
IPopupWorkbench
## 组件类ID（classId）
idm.componet.mobileWechat.popupWorkbench
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
mobileWechat@1.0.8
## 组件属性
此章节主要介绍该组件的每个属性的含义以及如何使用说明
### 唯一标识【ctrlId】
只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
<font color="#CCCCCC">此章节主要用于存放设置组件所需要的一些基本信息的属性，以达到组件具备使用的基础条件</font>
#### 弹出位置【position】
可选择侧边栏所在位置，悬浮按钮也会随此项固定在相同一侧
#### 悬浮高度【btnTop】
设定悬浮按钮距body顶部的距离
#### 蒙层关闭【overlayClose】
设定点击蒙层时是否关闭侧边栏
#### 跳转方式【jumpStyle】
设置切换成功后打开新页面的方式
1) _replace:当前页替换成新页面
2) _self:在当前页打开新页面
3) _blank:在新窗口打开新页面
- 标识：`jumpStyle`
- 默认值：`_self`
### 样式设置
<font color="#CCCCCC">用于设置组件的整体基础样式外观的组件属性的分组。</font>
#### 主题颜色【themeColor】
用于设置按钮中字体图标的颜色，以及选中时的文字颜色
#### 边界阴影【bdShadow】
用于设置侧边栏菜单和按钮的阴影
#### 字体设置【fontStyle】
用于设置侧边栏菜单中选择项的字体
#### 菜单行高【lineHeight】
侧边栏菜单中选择项的高度，一般设置为auto
#### 菜单宽度【menuWidth】
侧边栏菜单的宽度
#### 菜单内外边距【box】
侧边栏菜单的内外边距
#### 菜单边框【border】
侧边栏菜单的边框
#### 按钮宽高
<font color="#CCCCCC">用于对容器的宽高进行行内分组，此处建议都设置为auto。</font>
##### 按钮宽【width】
按钮的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`width`

- 默认值：`auto`
##### 按钮高【height】
按钮的高度，填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`height`

- 默认值：`auto`
#### 图标大小【iconSize】
按钮中的图标大小，请配合按钮宽高进行更改
#### 按钮内外边距【btnbox】
按钮内外边距
#### 按钮边框【btnborder】
按钮边框
### 高级
#### 数据接口【dataSourceUrl】
用于获取当前用户的工作台列表
#### 显示字段【dataFiled】
需要展示到页面上的字段，比如展示工作台名称，则设置名称对应的字段名
#### 切换接口【changeUrl】
调取切换工作台接口，完成相应的后端逻辑