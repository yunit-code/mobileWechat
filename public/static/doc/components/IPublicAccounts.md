# 公共账号
这里用来描述组件的具体作用说明，描述内容建议简明扼要。
## 组件类名（className）
IPublicAccounts
## 组件类ID（classId）
idm.componet.mobileWechat.publicaccounts
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
mobileWechat@1.0.7
## 组件属性
### 唯一标识【ctrlId】
只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
#### 图标【accountUrl】
用于设置组件的拖拽图标
- 标识：`图标【accountUrl】`
- 默认值：`展示请上传或选择图标文本`
#### 固定位置【fixed】
用于设置组件的拖拽图标是否固定定位
- 标识：`固定位置【fixed】`
- 默认值：`否`
#### 放置坐标【coordinates】
用于设置组件的拖拽图标设置固定定位的坐标点
- 标识：`放置坐标【coordinates】`
- 默认值：`左上角`
#### 偏移(X)【offsetX】
用于设置组件的拖拽图标基于坐标点的X轴偏移量
- 标识：`【offsetX】`
- 默认值：`20px`
#### 偏移(Y)【offsetY】
用于设置组件的拖拽图标基于坐标点的Y轴偏移量
- 标识：`【offsetY】`
- 默认值：`20px`
### 高级
#### 虚拟账号接口地址【customInterfaceUrl】
设置组件获取动态数据的接口路径。
接口返回格式
``` json
{
  "code": "200",
  "type": "success",
  "message": "操作成功",
  "metadata": null,
  "token": "",
  "data": [
    {
    "orgName": "部门01",
    "photoPath": "upload/photo/220514144443yYMi7Lpxy29zqFjnomd.jpeg",
    "isVirtual": "1",
    "userName": "幻体",
    "userId": "2009241700406GangTMvhEkT0bnEQBi",
    "orgId": "200817150158KpfXFWUcxxRv8Qpw4yi"
    }
  ]
}
```

- 标识：`接口地址【customInterfaceUrl】`

- 默认值：`/ctrl/virtualAccount/getVirtualAccountList`
#### 切换账号接口地址【changeInterfaceUrl】
设置组件获取动态数据的接口路径。
接口返回格式
``` json
{
  "code": "200",
  "type": "success",
  "message": "操作成功",
  "metadata": null,
  "token": "",
  "data": null
}
```

- 标识：`接口地址【changeInterfaceUrl】`

- 默认值：`/ctrl/virtualAccount/switchAccount`