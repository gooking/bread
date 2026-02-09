# 面包店小程序

面包店风格小程序，小程序界面详见截图

# 小程序界面截图

| 首页 | 点单 | 订单
| :------: | :------: | :------: |
| <img src="https://dcdn.it120.cc/2024/05/11/4d555bd5-34c8-4040-810a-912e08999ee1.png" width="250px"> | <img src="https://dcdn.it120.cc/2024/05/11/39a50df6-1f98-4640-be2d-896d8c62e433.png" width="250px"> | <img src="https://dcdn.it120.cc/2024/05/11/f256802b-ef87-4df5-a5e0-4221d50607c2.png" width="250px"> |

| 门店列表 | 商品详情 | 会员中心
| :------: | :------: | :------: |
| <img src="https://dcdn.it120.cc/2024/05/11/0ca4940b-dc94-408c-b936-08c06ad21efb.png" width="250px"> | <img src="https://dcdn.it120.cc/2024/05/11/9238feb5-a817-41e3-94e9-47df0cadb3ba.png" width="250px"> | <img src="https://dcdn.it120.cc/2024/05/11/93671550-a429-4d8d-aa3b-04c7b77760a0.png" width="250px"> |

| 结算 | 选择自取时间 | 下单备注
| :------: | :------: | :------: |
| <img src="https://dcdn.it120.cc/2024/05/11/666435e2-5fec-4633-b9c8-2a2ef7754563.png" width="250px"> | <img src="https://dcdn.it120.cc/2024/05/11/4ac042f5-095d-482f-9f12-0132fba0bfa6.png" width="250px"> | <img src="https://dcdn.it120.cc/2024/05/11/b765ca9c-24fd-4135-9d4f-9b3781d8d4a2.png" width="250px"> |


| 会员卡 | 关于我们 | 订单详情
| :------: | :------: | :------: |
| <img src="https://dcdn.it120.cc/2024/05/11/3fd7895a-4f07-4029-b248-c263b2b6b1cc.png" width="250px"> | <img src="https://dcdn.it120.cc/2024/05/11/89fa41d5-1d9c-4dc2-8e27-0fc2ef296cf5.png" width="250px"> | <img src="https://dcdn.it120.cc/2024/05/11/a8ef755d-a1b0-4ab8-b7dd-476a8e3a8144.png" width="250px"> |


| 编辑资料 | 积分记录 | 常见问题
| :------: | :------: | :------: |
| <img src="https://dcdn.it120.cc/2024/05/11/b771673a-4e8e-4da8-91be-fc1542007c06.png" width="250px"> | <img src="https://dcdn.it120.cc/2024/05/11/efd71f66-9c81-4cd3-a5d2-9b3c3b69d653.png" width="250px"> | <img src="https://dcdn.it120.cc/2024/05/11/9a50fd98-a7c8-45a0-88b8-abc1998da09b.png" width="250px"> |

# 详细配置/使用教程

## 设置小程序的AppID和AppSecret

[《如何查看我的小程序的 APPID，在哪里看我的小程序的 APPID？》](https://jingyan.baidu.com/article/642c9d340305e3644a46f795.html)

[《设置小程序合法服务器域名》](https://www.it120.cc/help/tvpou9.html)

登录 [api工厂](https://admin.s2m.cc) ，左侧菜单，微信设置，小程序设置，将上面的AppID和AppSecret填进去

## 把当前小程序测试数据克隆到你自己后台，方便测试

登录 [api工厂](https://admin.s2m.cc),左侧菜单 “工厂设置” --> “数据克隆” --> “将别人的数据克隆给我”

对方商户ID填写 `24340`

点击 “立即克隆”，克隆成功后，F5 刷新一下后台

## 小程序连接到你自己的后台

打开目录的配置文件 `config.js` ,将里面的 `subDomain` 修改为你自己的专属域名、`merchantId` 修改为你自己的商户ID 。

专属域名和商户ID，可在后台工厂设置-->商户信息查看，直接复制即可

## 配置微信支付

登录 [api工厂](https://admin.s2m.cc),左侧菜单，系统设置 -->  在线支付配置，填写您自己的微信支付的信息

# 其他优秀开源模板推荐
- [天使童装](https://github.com/EastWorld/wechat-app-mall)   /  [码云镜像](https://gitee.com/javazj/wechat-app-mall)  /  [GitCode镜像](https://gitcode.com/gooking2/wechat-app-mall)
- [天使童装（uni-app版本）](https://github.com/gooking/uni-app-mall)  /   [码云镜像](https://gitee.com/javazj/uni-app-mall)  /  [GitCode镜像](https://gitcode.com/gooking2/uni-app-mall)
- [简约精品商城（uni-app版本）](https://github.com/gooking/uni-app--mini-mall)  /   [码云镜像](https://gitee.com/javazj/uni-app--mini-mall)  /   [GitCode镜像](https://gitcode.com/gooking2/uni-app--mini-mall)
- [舔果果小铺（升级版）](https://github.com/gooking/TianguoguoXiaopu)
- [面馆风格小程序](https://gitee.com/javazj/noodle_shop_procedures)
- [AI名片](https://github.com/gooking/visitingCard)  /   [码云镜像](https://gitee.com/javazj/visitingCard)  /   [GitCode镜像](https://gitcode.com/gooking2/visitingCard)
- [仿海底捞订座排队 (uni-app)](https://github.com/gooking/dingzuopaidui)  /   [码云镜像](https://gitee.com/javazj/dingzuopaidui)  /   [GitCode镜像](https://gitcode.com/gooking2/dingzuopaidui)
- [H5版本商城/餐饮](https://github.com/gooking/vueMinishop)  /  [码云镜像](https://gitee.com/javazj/vueMinishop) /  [GitCode镜像](https://gitcode.com/gooking2/vueMinishop)
- [餐饮点餐](https://github.com/woniudiancang/bee)  / [码云镜像](https://gitee.com/woniudiancang/bee) / [GitCode镜像](https://gitcode.com/gooking2/bee)
- [企业微展](https://github.com/gooking/qiyeweizan)  / [码云镜像](https://gitee.com/javazj/qiyeweizan) / [GitCode镜像](https://gitcode.com/gooking2/qiyeweizan)
- [无人棋牌室](https://github.com/gooking/wurenqipai)  / [码云镜像](https://gitee.com/javazj/wurenqipai) / [GitCode镜像](https://gitcode.com/gooking2/wurenqipai)
- [酒店客房服务小程序](https://github.com/gooking/hotelRoomService)  / [码云镜像](https://gitee.com/javazj/hotelRoomService) / [GitCode镜像](https://gitcode.com/gooking2/hotelRoomService)
- [面包店风格小程序](https://github.com/gooking/bread)  / [码云镜像](https://gitee.com/javazj/bread) / [GitCode镜像](https://gitcode.com/gooking2/bread)
- [朋友圈发圈素材小程序](https://github.com/gooking/moments)  / [码云镜像](https://gitee.com/javazj/moments) / [GitCode镜像](https://gitcode.com/gooking2/moments)
- [小红书企业微展](https://github.com/gooking/xhs-qiyeweizan)  / [码云镜像](https://gitee.com/javazj/xhs-qiyeweizan) / [GitCode镜像](https://gitcode.com/gooking2/xhs-qiyeweizan)
- [旧物回收、废品回收](https://github.com/gooking/recycle)  / [码云镜像](https://gitee.com/javazj/recycle) / [GitCode镜像](https://gitcode.com/gooking2/recycle)

# 联系作者

| 微信好友 |
| :------: |
| <img src="https://dcdn.it120.cc/2021/09/13/61a80363-9085-4a10-9447-e276a3d40ab3.jpeg" width="200px"> |
