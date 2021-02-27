# 技术栈 
1. React
2. Redux
3. React-Router
4. Webpack
5. Socket.io
6. Ant Desgin Mobile
7. Express
8. Eslint
9. MongoDB mongoose nodemon
10. @alicloud/sms-sdk 阿里云通信服务
11. Axios
12. Babel
13. loader

# 功能

1. 用户注册：用户填写昵称、手机号、短信验证码发送、密码、性别进行注册。
2. 用户登录：用户输入手机号和密码进行登录。
3. 用户注销：清除个人信息和登陆状态。
4. 修改密码：输入原密码和新密码进行修改密码。
5. 找回密码：输入用户手机号、短信验证码、新密码进行密码重置。
6. 上传头像：上传用户头像。
7. 修改昵称：对用户原昵称进行修改。
8. 修改个性签名：对用户原个性签名进行修改。
9. 发布物品：用户可以发布物品信息，例如物品的标题、描述、图片、分类和价格。
10. 查看“我发布的”：展示用户发布的所有物品。
11. 收藏物品：用户可以收藏自己发布的物品和其它用户发布的物品。
12. 私聊：用户可以与其他用户进行实时在线聊天。
13. 关注用户：关注其他用户。
14. 取消用户关注：取消用户关注。
15. 查看粉丝：查看用户的粉丝。
16. 浏览物品：用户可以浏览自己发布的物品和他人发布的物品。
17. 随便看看：在平台发现功能模块随机展示物品。
18. 新鲜的：在平台首页展示最新发布的物品。
19. 最热的：在平台首页展示最近3天点击量最高的物品。
20. 查看他人资料：用户可以查看他人用户个人资料，包括昵称、性别、头像、个性签名、收藏、关注、粉丝、发布的宝贝。



# 配置
1. server/config/config.js
2. server/config/message.js
3. server/config/socket.js


# 本地run
1. yarn install
2. yarn server (服务器端口: 9001)
3. yarn start
4. visit localhost:9002

# 线上run
1. yarn install
2. yarn build
3. yarn server
4. visit localhost:9001
