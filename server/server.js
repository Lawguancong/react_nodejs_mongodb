const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const database = require('./database')
const User = database.getModel('user')
const Chat = database.getModel('chat')
const Publish = database.getModel('publish')
const Collect = database.getModel('collect')
const Comment = database.getModel('comment')
const Focus = database.getModel('focus')
const Fans = database.getModel('fans')
const SMSClient = require('@alicloud/sms-sdk')


const $ = require('jquery')
const utils = require('utility')// md5加密
const svgCaptcha = require('svg-captcha');// 验证码 第三方模块
// const formidable = require('formidable')
// const path = require('path')
// const fs = require("fs")

const app = express()
// work with express
const server = require('http').Server(app)
// const server = require('http').createServer();
const io = require('socket.io')(server)

// app.use(express.json({limit: '10mb'}))
app.use(bodyParser.json({limit:'30mb'}));
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}));
app.use(bodyParser.json())
app.use(cookieParser())




// 全局监听聊天
io.on('connection',function (socket) { // 全局监听
    console.log('socket.io-----connection')
    socket.on('sendChatText',function (data) {// 会接收两条信息 一条是用户发送的消息 一条是空消息
        if(data !== undefined){
            const {send,receive,chatText,sendTime} = data
            Chat.find(
                // {'$or':[{send,receive},{send:receive,receive:send}],'sendTime':{$lt:1521114022594}},)
                {'$or':[{send,receive},{send:receive,receive:send}]}).exec(function (err, doc) {
                if(err){
                    // 出错的处理方式??????????
                    console.log(err)
                }
                // console.log(doc[doc.length - 1])
                const messageListId = [send,receive].sort().join('_')

                //首次聊天
                if(doc.length === 0 ){
                    // Chat.create({messageListId,send,receive,chatText,sendTime,showDate:true},function (err, doc) {// 把消息存入数据库 显示时间
                    //     io.emit('receiveChatText',Object.assign({},doc._doc))
                    // })
                    const chatModel = new Chat({messageListId,send,receive,chatText,sendTime,showDate:true})
                    chatModel.save(function (err, doc) {// 把消息存入数据库 显示时间
                        // console.log(doc)
                        io.emit('receiveChatText',Object.assign({},doc._doc))
                    })
                }else{
                    let lastChatTimestamp = doc[doc.length - 1].sendTime// 上一条聊天的时间戳
                    // console.log(sendTime - lastChatTimestamp)
                    if(sendTime - lastChatTimestamp > 60000){// 大于 60s
                        // Chat.create({messageListId,send,receive,chatText,sendTime,showDate:true},function (err, doc) {// 把消息存入数据库 显示时间
                        //     io.emit('receiveChatText',Object.assign({},doc._doc))
                        // })
                        const chatModel = new Chat({messageListId,send,receive,chatText,sendTime,showDate:true})
                        chatModel.save(function (err, doc) {// 把消息存入数据库 显示时间
                            // console.log(doc)

                            io.emit('receiveChatText',Object.assign({},doc._doc))

                        })
                    }else{
                        // Chat.create({messageListId,send,receive,chatText,sendTime},function (err, doc) {// 把消息存入数据库 不显示时间
                        //     io.emit('receiveChatText',Object.assign({},doc._doc))
                        // })
                        const chatModel = new Chat({messageListId,send,receive,chatText,sendTime})
                        chatModel.save(function (err, doc) {// 把消息存入数据库 显示时间
                            // console.log(doc)

                            io.emit('receiveChatText',Object.assign({},doc._doc))

                        })
                    }
                }
            })
        }
    })
})

app.post('/save',function (req, res) {
    const {send,receive,chatText,sendTime} = req.body
    Chat.find(
        {'$or':[{send,receive},{send:receive,receive:send}]}).exec(function (err, doc) {
        if(err){
            console.log(err)
        }
        const messageListId = [send,receive].sort().join('_')
        if(doc.length === 0 ){
            // Chat.create({messageListId,send,receive,chatText,sendTime,showDate:true},function (err, doc) {// 把消息存入数据库 显示时间
            //     io.emit('receiveChatText',Object.assign({},doc._doc))
            // })
            const chatModel = new Chat({messageListId,send,receive,chatText,sendTime,showDate:true})
            chatModel.save(function (err, doc) {// 把消息存入数据库 显示时间
                console.log(doc)
                io.emit('receiveChatText',Object.assign({},doc._doc))

            })
        }else{
            let lastChatTimestamp = doc[doc.length - 1].sendTime// 上一条聊天的时间戳
            // console.log(sendTime - lastChatTimestamp)
            if(sendTime - lastChatTimestamp > 60000){// 大于 60s
                // Chat.create({messageListId,send,receive,chatText,sendTime,showDate:true},function (err, doc) {// 把消息存入数据库 显示时间
                //     io.emit('receiveChatText',Object.assign({},doc._doc))
                // })
                const chatModel = new Chat({messageListId,send,receive,chatText,sendTime,showDate:true})
                chatModel.save(function (err, doc) {// 把消息存入数据库 显示时间
                    io.emit('receiveChatText',Object.assign({},doc._doc))

                })
            }else{
                // Chat.create({messageListId,send,receive,chatText,sendTime},function (err, doc) {// 把消息存入数据库 不显示时间
                //     io.emit('receiveChatText',Object.assign({},doc._doc))
                // })
                const chatModel = new Chat({messageListId,send,receive,chatText,sendTime})
                chatModel.save(function (err, doc) {// 把消息存入数据库 显示时间
                    io.emit('receiveChatText',Object.assign({},doc._doc))

                })
            }
        }
    })
})

// 是否有用户登录信息
app.post('/authData',function (req, res) {
    // console.log(req)
    // console.log(req.cookies)
    const {_id,phone,pwd} = req.cookies
    // console.log(_id,phone,pwd)
    console.log('执行authData(用户信息校验)')
    if( !phone || !pwd ){
        return res.json({code:0,msg:'没有用户登录信息'})
    }
    User.findOne({phone,pwd}, function(err,doc){
        if (err) {
            return res.json({code:0, msg:'后端数据库出错'})
        }
        if (doc) {
            return res.json({code:1,msg:'有用户登录信息',data:doc})
        }
        return res.json({code:0,msg:'没有用户登录信息'})
    })

})

// 自增浏览量
app.post('/addClickNum',function (req, res) {
    const {publishDetailsId} = req.body
    Publish.findByIdAndUpdate({_id:publishDetailsId},{$inc:{clickNum:1}},function (err, doc) {
        return res.json({code:1,msg:'自增浏览量成功'})
    })
})

// 验证发送方聊天用户是否存在
app.post('/authChat',function (req, res) {
    const {send} = req.body
    User.findOne({_id:send},function (err, doc) {
        if(doc){
            // console.log(doc)
            return res.json({code:1,msg:'对方聊天用户存在'})
        }
        return res.json({code:0,msg:'对方聊天用户不存在'})

    })
})

// 检查手机是否已经被注册
app.post('/checkPhoneRegister',function (req, res) {
    // console.log(req.body.phone)
    const {phone} = req.body
    User.findOne({phone},function(err,doc){
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        if(doc) {
            return res.json({code:0,msg:'该手机号码已经被注册'})
        }
        return res.json({code:1,msg:'该手机号码没有被注册'})

    })
})

// 将聊天标识为已读 isRead:true
app.post('/clearChatUnRead',function (req, res) {
    const send = req.body.send
    const receive = req.cookies._id
    // console.log(send+'-------'+receive)
    Chat.update({send,receive},{'$set':{isRead:true}},{'multi':true},function (err, doc) {
        if(err){
            return res.json({code:0,msg:'修改聊天为已读失败'})
        }
        if(doc){
            // console.log(doc)
        }
        return res.json({code:1,msg:'修改聊天为已读成功',data:doc})

    })
})

// 收藏宝贝
app.post('/doCollect',function (req, res) {
    const {publishDetailsId} = req.body
    const {collectTime} = req.body
    const collector = req.cookies._id
    // console.log(publishDetailsId)
    // console.log(collector)
    Collect.find({collector,publishDetailsId},function (err, doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        if(doc.length !== 0){
            return res.json({code:0,msg:'已收藏'})
        }else{
            const collectModel = new Collect({collector,publishDetailsId,collectTime})
            collectModel.save(function (errSave, docSave) {
                if(errSave){
                    return res.json({code:0,msg:'后端数据库出错'})
                }
                User.findByIdAndUpdate({_id:collector},{$inc:{collect:1}},function (errUser,docUser) {
                    if(errUser){
                        return res.json({code:0,msg:'后端数据库出错'})
                    }
                    return res.json({code:1,msg:'收藏成功'})
                })
            })
        }
    })

})

// 取消收藏宝贝
app.post('/cancelCollect',function (req,res) {
    const {publishDetailsId} = req.body
    const collector = req.cookies._id
    Collect.deleteOne({collector,publishDetailsId},function (err, doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        User.findByIdAndUpdate({_id:collector},{$inc:{collect:-1}},function (errUser,docUser) {
            if(errUser){
                return res.json({code:0,msg:'后端数据库出错'})
            }
            return res.json({code:1,msg:'取消收藏成功',collect:docUser.collect})
        })
    })

})

// 获取我所有的收藏
app.post('/getMyCollectList',function (req, res) {
    const collector = req.cookies._id
    Collect.find({collector}).sort({collectTime:'-1'}).limit(15).exec(function (err, doc){
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        // console.log(doc)
        let myCollectList = []
        orderMyCollectList(res,doc,doc.length,0,myCollectList)
    })
})
function orderMyCollectList(res,doc,length,k,myCollectList) {
    if( k < length ){
        Publish.findOne({_id:doc[k].publishDetailsId},function (errPublish, docPublish) {
            console.log(doc[k].publishDetailsId)
            // console.log(docPublish)
            if(docPublish){
                let data = Object.assign({},{
                    isDeleted:false,
                    publishDetailsId:doc[k].publishDetailsId,
                    title:docPublish.title,
                    description:docPublish.description,
                    price:docPublish.price,
                    classification:docPublish.classification,
                    mainImg:docPublish.compressImgList[0],
                    clickNum:docPublish.clickNum,
                })
                myCollectList[k] = data
                k++
                orderMyCollectList(res,doc,length,k,myCollectList)
            }else{
                let data = Object.assign({},{
                    isDeleted:true,
                    publishDetailsId:doc[k].publishDetailsId,
                })
                myCollectList[k] = data
                k++
                orderMyCollectList(res,doc,length,k,myCollectList)
            }
        })
    }else{
        return res.json({code:1,msg:'获取我所有的收藏成功',myCollectList:myCollectList})
    }
}

// 获取对方用户的收藏
app.post('/getUserCollect',function (req, res) {
    const collector = req.body._id
    Collect.find({collector}).sort({collectTime:'-1'}).limit(15).exec(function (err, doc){
        if(err){
            return res.json({code:0,msg:'数据库出错'})
        }
        let userCollectList = []
        orderUserCollectList(res,doc,doc.length,0,userCollectList)
    })
})
function orderUserCollectList(res,doc,length,k,userCollectList) {
    if( k < length ){
        Publish.findOne({_id:doc[k].publishDetailsId},function (errPublish, docPublish) {
            console.log(doc[k].publishDetailsId)
            // console.log(docPublish)
            if(docPublish){
                let data = Object.assign({},{
                    isDeleted:false,
                    publishDetailsId:doc[k].publishDetailsId,
                    title:docPublish.title,
                    description:docPublish.description,
                    price:docPublish.price,
                    classification:docPublish.classification,
                    mainImg:docPublish.compressImgList[0],
                    clickNum:docPublish.clickNum,
                })
                userCollectList[k] = data
                k++
                orderUserCollectList(res,doc,length,k,userCollectList)
            }else{
                let data = Object.assign({},{
                    isDeleted:true,
                })
                userCollectList[k] = data
                k++
                orderUserCollectList(res,doc,length,k,userCollectList)
            }
        })
    }else{
        return res.json({code:1,msg:'获取对方用户收藏的宝贝成功',userCollectList:userCollectList})
    }

}


// 获取我所有的关注
app.post('/getMyFocusList',function (req, res) {
    const focusId = req.cookies._id
    Focus.find({focusId}).sort({focusTime:'-1'}).limit(15).exec(function (err, doc){
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        // console.log(doc)
        let myFocusList = []
        orderMyFocusList(res,doc,doc.length,0,myFocusList)
    })
})
function orderMyFocusList(res,doc,length,k,myFocusList){
    if( k < length ){
        User.findOne({_id:doc[k].focusObjectId},function (errUser, docUser) {
            if(docUser){
                let data = Object.assign({},{
                    _id:docUser._id,
                    avatarName:docUser.avatarName,
                    nickName:docUser.nickName,
                    gender:docUser.gender,
                    signature:docUser.signature,
                    fans:docUser.fans,
                })
                myFocusList[k] = data
                k++
                orderMyFocusList(res,doc,length,k,myFocusList)
            }
        })
    }else{
        return res.json({code:1,msg:'获取我所有的关注成功',myFocusList:myFocusList})
    }
}

// 获取对方用户的所有关注
app.post('/getUserFocusList',function (req, res) {
    const {focusId} = req.body
    Focus.find({focusId}).sort({focusTime:'-1'}).limit(15).exec(function (err, doc){
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        // console.log(doc)
        let userFocusList = []
        orderUserFocusList(res,doc,doc.length,0,userFocusList)
    })
})
function orderUserFocusList(res,doc,length,k,userFocusList) {
    if( k < length ){
        User.findOne({_id:doc[k].focusObjectId},function (errUser, docUser) {
            if(docUser){
                let data = Object.assign({},{
                    _id:docUser._id,
                    avatarName:docUser.avatarName,
                    nickName:docUser.nickName,
                    gender:docUser.gender,
                    signature:docUser.signature,
                    fans:docUser.fans,
                })
                userFocusList[k] = data
                k++
                orderUserFocusList(res,doc,length,k,userFocusList)
            }
        })
    }else{
        return res.json({code:1,msg:'获取对方用户的所有关注成功',userFocusList:userFocusList})
    }
}

// 获取我所有的粉丝
app.post('/getMyFansList',function (req, res) {
    const focusObjectId = req.cookies._id
    Focus.find({focusObjectId}).sort({focusTime:'-1'}).limit(15).exec(function (err, doc){
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        // console.log(doc)
        let myFansList = []
        orderMyFansList(res,doc,doc.length,0,myFansList)
    })
})
function orderMyFansList(res,doc,length,k,myFansList) {
    if( k < length ){
        User.findOne({_id:doc[k].focusId},function (errUser, docUser) {
            if(docUser){
                let data = Object.assign({},{
                    _id:docUser._id,
                    avatarName:docUser.avatarName,
                    nickName:docUser.nickName,
                    gender:docUser.gender,
                    signature:docUser.signature,
                    fans:docUser.fans,
                })
                myFansList[k] = data
                k++
                orderMyFansList(res,doc,length,k,myFansList)
            }
        })
    }else{
        return res.json({code:1,msg:'获取我所有的粉丝成功',myFansList:myFansList})
    }
}

// 获取对方用户所有的粉丝
app.post('/getUserFansList',function (req, res) {
    const {focusObjectId} = req.body
    Focus.find({focusObjectId}).sort({focusTime:'-1'}).limit(15).exec(function (err, doc){
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        // console.log(doc)
        let userFansList = []
        orderUserFansList(res,doc,doc.length,0,userFansList)
    })
})
function orderUserFansList(res,doc,length,k,userFansList) {
    if( k < length ){
        User.findOne({_id:doc[k].focusId},function (errUser, docUser) {
            if(docUser){
                let data = Object.assign({},{
                    _id:docUser._id,
                    avatarName:docUser.avatarName,
                    nickName:docUser.nickName,
                    gender:docUser.gender,
                    signature:docUser.signature,
                    fans:docUser.fans,
                })
                userFansList[k] = data
                k++
                orderUserFansList(res,doc,length,k,userFansList)
            }
        })
    }else{
        return res.json({code:1,msg:'获取对方用户所有的粉丝成功',userFansList:userFansList})
    }
}



// 删除收藏失效的宝贝
app.post('/deleteMyCollect',function (req, res) {
    const {publishDetailsId} = req.body
    const collector = req.cookies._id
    Collect.deleteOne({publishDetailsId,collector},function (err, doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        User.findByIdAndUpdate({_id:collector},{$inc:{collect:-1}},function (errUser,docUser) {
            if(errUser){
                return res.json({code:0,msg:'后端数据库出错'})
            }
            return res.json({code:1,msg:'删除收藏失效的宝贝成功'})
        })
    })
})

// 手机号登录
app.post('/doLogin', function(req,res){
    const {phone, password} = req.body
    User.findOne({phone,pwd:md5Pwd(password)},function(err,doc){
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        if (!doc) {
            return res.json({code:0,msg:'手机号或者密码错误'})
        }
        res.cookie('_id', doc._id)
        res.cookie('phone', doc.phone)
        res.cookie('pwd', doc.pwd)
        return res.json({code:1,msg:'手机号登录成功',data:doc})
    })
})

// 手机号注册
app.post('/doRegister',function (req, res) {
    const {nickName,phone,password,gender} = req.body
    // console.log(nickName,phone,password,gender)
    const userModel = new User({nickName,phone,pwd:md5Pwd(password),gender})
    User.findOne({phone},function(err,doc) {
        if (doc) {
            return res.json({code: 0, msg: '该手机号码已经被注册'})
        }
        userModel.save(function (err, doc) {
            if(err){
                return res.json({code:0,msg:'后端数据库出错'})
            }
            // console.log(doc)
            res.cookie('_id', doc._id)
            res.cookie('phone', doc.phone)
            res.cookie('pwd', doc.pwd)
            return res.json({code:1,msg:'手机号注册成功',data:doc})
        })
    })
})

// 发布
app.post('/doPublish',function (req, res) {
    const publisher = req.cookies._id
    const {title,description,price,classification,publishTime,imgList,compressImgList} = req.body
    const publishModel = new Publish({publisher,title,description,price,classification,publishTime,imgList,compressImgList})
    publishModel.save(function (err, doc) {
        if(err){
            // console.log(err)
            return res.json({code:0,msg:'后端数据库出错'})
        }
        // console.log(doc)
        return res.json({code:1,msg:'发布成功',doc:doc})
    })

})

// 删除我发布的宝贝
app.post('/doDeletePublish',function (req, res) {
    const {_id} = req.body
    // console.log(_id)
    Publish.deleteOne({_id},function (err, doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        if(doc.n === 1){// n=1 删除一条记录
            return res.json({code:1,msg:'删除我发布的宝贝成功',doc:doc})
        }else{
            return res.json({code:0,msg:'删除我发布的宝贝失败',doc:doc})
        }
    })
})

// 关注
app.post('/doFocus',function (req, res) {
    const focusId = req.cookies._id
    console.log(focusId)
    if(focusId === undefined){
        // console.log('undefined')
        return res.json({code:0,msg:'请您先登录!'})
    }
    const {focusObjectId,focusTime} = req.body
    Focus.findOne({focusId,focusObjectId},function (err,doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        if(doc === null){
            const focusModel = new Focus({focusId,focusObjectId,focusTime})
            focusModel.save(function (errModel, docModel) {
                if(errModel){
                    return res.json({code:0,msg:'后端数据库出错'})
                }
                User.findByIdAndUpdate({_id:focusId},{$inc:{focus:1}},function (errFocusId,docFocusId) {
                    if(errFocusId){
                        return res.json({code:0,msg:'后端数据库出错'})
                    }
                    User.findByIdAndUpdate({_id:focusObjectId},{$inc:{fans:1}},function (errFocusObjectId,docFocusObjectId) {
                        if(errFocusObjectId){
                            return res.json({code:0,msg:'后端数据库出错'})
                        }
                        return res.json({code:1,msg:'关注成功'})
                    })
                })
            })
        }
    })

})

// 取消关注
app.post('/cancelFocus',function (req, res) {
    const focusId = req.cookies._id
    const {focusObjectId} = req.body
    Focus.findOne({focusId,focusObjectId},function (err,doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        if(doc !== null){
            Focus.deleteOne({focusId,focusObjectId},function (errDelete,docDelete) {
              // console.log(docDelete)
                if(docDelete.n === 1){
                    User.findByIdAndUpdate({_id:focusId},{$inc:{focus:-1}},function (errFocusId,docFocusId) {
                        if(errFocusId){
                            return res.json({code:0,msg:'后端数据库出错'})
                        }
                        User.findByIdAndUpdate({_id:focusObjectId},{$inc:{fans:-1}},function (errFocusObjectId,docFocusObjectId) {
                            if(errFocusObjectId){
                                return res.json({code:0,msg:'后端数据库出错'})
                            }
                            return res.json({code:1,msg:'取消关注成功'})
                        })
                    })
                }
            })
        }
    })
})

// 获取我发布的所有宝贝
app.post('/getMyPublish',function (req, res) {
    const {_id} = req.cookies
    Publish.find({publisher:_id}).exec(function (err, doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        const arr = []
        for(let i = doc.length-1; i >= 0; i-- ){
            arr.push(doc[i])
        }
        let myPublishListArr = []
        for(let i = 0; i < arr.length; i++){
            const data = Object.assign({},{
                _id:arr[i]._id,
                classification:arr[i].classification,
                clickNum:arr[i].clickNum,
                commentNum:arr[i].commentNum,
                mainImg:arr[i].compressImgList[0],
                price:arr[i].price,
                title:arr[i].title,
            })
            myPublishListArr[i] = data
        }
        return res.json({code:1,msg:'获取我发布的所有宝贝成功',myPublishList:myPublishListArr})
    })
})

// 获取宝贝的详情
app.post('/getPublishDetails',function (req, res) {
    const {publishDetailsId} = req.body
    const collector = req.cookies._id
    Publish.findOne({_id:publishDetailsId},function (err, doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        User.findOne({_id:doc.publisher},function (errUser, docUser) {

            Collect.find({collector,publishDetailsId},function (errCollect,docCollect) {
                // console.log(docCollect)
                if(errCollect){
                    return res.json({code:0,msg:'后端数据库出错'})
                }
                let data
                if(docCollect.length === 0){
                    data = Object.assign({},{
                        _id:docUser._id,
                        nickName:docUser.nickName,
                        avatarName:docUser.avatarName,
                        title:doc.title,
                        description:doc.description,
                        compressImgList :doc.compressImgList,
                        price:doc.price,
                        classification:doc.classification,
                        clickNum:doc.clickNum,
                        commentNum:doc.commentNum,
                        publishTime:doc.publishTime,
                        collect:false
                    })
                }else{
                    data = Object.assign({},{
                        _id:docUser._id,
                        nickName:docUser.nickName,
                        avatarName:docUser.avatarName,
                        title:doc.title,
                        description:doc.description,
                        compressImgList :doc.compressImgList,
                        price:doc.price,
                        classification:doc.classification,
                        clickNum:doc.clickNum,
                        commentNum:doc.commentNum,
                        publishTime:doc.publishTime,
                        collect:true
                    })
                }

                return res.json({code:1,msg:'获取我发布的宝贝详情成功',doc:data})
            })

        })
    })
})

// 手机获取6位验证码
app.post('/getCaptcha_6',function (req, res) {
    console.log(req.body.phone)
    const phoneNumber = req.body.phone
    const Captcha = svgCaptcha.create({
        size: 6,// 验证码长度
        // ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 0, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        // background: '#ffffff', // 验证码图片背景颜色
        width: 300, // width of captcha
        height: 80, // height of captcha
        fontSize: 100, // captcha text size
        charPreset: '1234567890', // 验证码字符中包含 '1234567890'
    });
    // res.type('svg');
    // res.type('html')// 使用ejs等模板时如果报错
    // res.cookie('captcha_6',Captcha.text,{maxAge:600000})// 给浏览器设置cookie 10分钟后没有cookie:captcha（单位/毫秒）
    // // ？？？？？？？？？？？？？？？？？
    // // 手机6位验证码发送 可能 成功 也可能 失败
    // // console.log(Captcha.text)
    // return res.json({code:1,msg:'验证码发送成功',Captcha:Captcha.text});

    //阿里大于
    const _res = res
    const accessKeyId = '*************'
    const secretAccessKey = '*************'
    //初始化sms_client
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    //发送短信
    smsClient.sendSMS({
        PhoneNumbers: phoneNumber,
        SignName: '校园二手淘',
        TemplateCode: 'SMS_121856786',
        TemplateParam: '{"code":"'+ Captcha.text +'"}'
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            //处理返回参数
            // console.log(res)
        }
        _res.type('svg');
        _res.type('html')// 使用ejs等模板时如果报错
        _res.cookie('captcha_6',Captcha.text,{maxAge:600000})// 给浏览器设置cookie 10分钟后没有cookie:captcha（单位/毫秒）
        return _res.json({code:1,msg:'验证码发送成功',Captcha:Captcha.text});

    }, function (err) {
        // console.log(err)
        return _res.json({code:0,msg:'验证码发送失败'});
    })





})

// 获取聊天列表
app.post('/getChatList',function (req, res) {
    const {send,receive} = req.body
    User.findOne({_id:receive},function (err,docUser) {
        if(err){
            return res.json({code:0,msg:'数据库出错'})
        }
        if(docUser){
            // console.log(docUser)
            Chat.find({'$or':[{send,receive},{send:receive,receive:send}]}).sort({sendTime:'-1'}).limit(15).exec(function (err, doc) {
                if(err){
                    return res.json({code:0,msg:'数据库出错'})
                }
                // console.log(doc)
            if(doc.length !== 0){
                    if(doc.length !== 0){
                        let chatList = []
                        let j = 0
                        for(let i=doc.length - 1; i >= 0;i--){
                            chatList[j] = doc[i]
                            j++
                        }
                        let showDateNum = 0// 显示聊天时间的次数
                        // console.log(chatList)
                        for(let i = 0; i < chatList.length; i++){
                            if(chatList[i].showDate === true){
                                showDateNum++
                            }
                        }
                        if(showDateNum < 4){
                            chatList[0].showDate = true
                            Chat.findByIdAndUpdate({_id:chatList[0]._id},{showDate:true},function(err,doc){
                                if(err){
                                    return res.json({code:0,msg:'数据库出错'})
                                }
                                if(doc){
                                    const timestamp = chatList[0].sendTime
                                    return res.json({code:1,chatList:chatList,msg:'获取聊天列表成功',receiveAvatar:docUser.avatarName,receiveNickName:docUser.nickName,timestamp:timestamp})
                                }
                            })
                        }else{
                            let deleteTimes = 0
                            for(let i=0; i<chatList.length; i++){
                                if(chatList[i].showDate === false){
                                    deleteTimes++
                                }else{
                                    break
                                }
                            }
                            for(let k=0;k<deleteTimes;k++){
                                chatList.shift()
                            }
                            const timestamp = chatList[0].sendTime
                            return res.json({code:1,chatList:chatList,msg:'获取聊天列表成功',receiveAvatar:docUser.avatarName,receiveNickName:docUser.nickName,timestamp:timestamp})
                        }
                    }
                }else{
                    return res.json({code:0,msg:'该用户没有聊天列表',receiveAvatar:docUser.avatarName,receiveNickName:docUser.nickName})
                }
            })
        }
    })
})

// 获取更多的聊天列表
app.post('/getMoreChatList',function (req, res) {
    const {send,receive,timestamp} = req.body
    Chat.find({'$or':[{send,receive},{send:receive,receive:send}],'sendTime':{$lt:timestamp}},).sort({sendTime:'-1'}).limit(20).exec(function (err, doc) {
        if(err){
            return res.json({code:0,msg:'数据库出错'})
        }
        if(doc){
            if(doc.length !== 0){
                let chatList = []
                let j = 0
                for(let i=doc.length - 1; i >= 0;i--){
                    chatList[j] = doc[i]
                    j++
                }
                let showDateNum = 0// 显示聊天时间的次数
                // console.log(chatList)
                for(let i = 0; i < chatList.length; i++){
                    if(chatList[i].showDate === true){
                        showDateNum++
                    }
                }
                if(showDateNum < 4){
                    chatList[0].showDate = true
                    Chat.findByIdAndUpdate({_id:chatList[0]._id},{showDate:true},function(err,doc){
                        if(err){
                            return res.json({code:0,msg:'数据库出错'})
                        }
                        if(doc){
                            const timestamp = chatList[0].sendTime
                            return res.json({code:1,chatList:chatList,msg:'获取更多聊天列表成功',timestamp:timestamp})
                        }
                    })
                }else{
                    let deleteTimes = 0
                    for(let i=0; i<chatList.length; i++){
                        if(chatList[i].showDate === false){
                            deleteTimes++
                        }else{
                            break
                        }
                    }
                    for(let k=0;k<deleteTimes;k++){
                        chatList.shift()
                    }
                    const timestamp = chatList[0].sendTime
                    return res.json({code:1,chatList:chatList,msg:'获取更多聊天列表成功',timestamp:timestamp})
                }
            }else{
                return res.json({code:0,msg:'没有更多的聊天记录'})
            }
        }else{
            return res.json({code:0,msg:'获取更多聊天列表失败'})
        }
    })
})

// 获取消息列表的未读数
app.post('/getMessageUnReadNum',function (req, res) {
    const {_id} = req.cookies
    // console.log(send)
    // console.log(receive)
    Chat.find({receive:_id,isRead:false},function (err, doc) {
        if(err){
            return res.json({code:0,msg:'获取消息列表未读数失败'})
        }
        if(doc.length !== 0){
            return res.json({code:1,messageList:doc,msg:'获取消息列表未读数成功'})
        }
    })
})

// 获取消息列表
app.post('/getMessageList',function (req, res) {
    const {_id} = req.cookies
    // console.log(_id)
    Chat.find({'$or':[{send:_id},{receive:_id}]}).sort({sendTime:'-1'}).exec(function (err, doc) {
        if(err){
            // console.log(err)
            return res.json({code:0,msg:'数据库出错'})
        }
        // console.log(doc)
        // console.log(doc.length)
        // console.log(typeof doc)
        if(doc.length !== 0){
            let arr = []
            arr.push(doc[0])
            for(let i = 0;i<doc.length;i++){
                let flag = false
                arr.map( value => {
                    if(value.messageListId === doc[i].messageListId){
                        flag = true
                    }
                });
                if(flag === false){
                    arr.push(doc[i])
                }
            }
            // console.log(arr)
            // return res.json({code:1,messageList:arr,msg:'获取消息列表成功'})

            let sendArr = [];// 发送方的_id
            arr.map( arr =>{
                    const send = arr.send === _id ? arr.receive : arr.send
                if(send !== undefined){
                    sendArr.push(send)
                }
            })
            // console.log(sendArr)
            let messageArr = new Array(sendArr.length)
            let nickNameAvatarNameArr = []
            let unReadNumArr = []
            let messageList = new Array(sendArr.length)

            let k = 0;
            sendArr.map( send => {
                User.findOne({_id:send},function (e, userDoc) {
                    if(userDoc){
                        nickNameAvatarNameArr.push({_id:userDoc._id,nickName:userDoc.nickName,avatarName:userDoc.avatarName})
                        k++
                        if(k === sendArr.length){
                            // console.log(nickNameAvatarNameArr)
                            k=0
                            nickNameAvatarNameArr.map(v => {
                                for(let i=0;i<sendArr.length;i++){
                                    if(v._id == sendArr[i]){
                                        // console.log(sendArr[i])
                                        const data = Object.assign({},{
                                            avatarName:v.avatarName,
                                            message:{
                                                chatText:arr[i].chatText,
                                                messageListId:arr[i].messageListId,
                                                receive:arr[i].receive,
                                                send:arr[i].send,
                                                sendTime:arr[i].sendTime,
                                                _id:arr[i]._id,
                                                nickName:v.nickName,
                                            }
                                        })
                                        messageArr[i] = data
                                        k++
                                        if(k === sendArr.length){
                                            // return res.json({code:1,messageList:messageArr,msg:'获取消息列表成功'})
                                            k=0
                                            // console.log(sendArr)
                                            sendArr.map( send => {
                                                Chat.find({send:send,receive:_id,isRead:false},function (e,chatDoc) {
                                                    // console.log(send)
                                                    // console.log(chatDoc)
                                                    // console.log(chatDoc.length)
                                                    if(chatDoc.length === 0){
                                                        k++
                                                        unReadNumArr.push({send,receive:_id,unReadNum:0}) //???????????????????
                                                    }else{
                                                        k++
                                                        // unReadNumArr.push({send:chatDoc[0].send,receive:chatDoc[0].receive,unReadNum:chatDoc.length})
                                                        unReadNumArr.push({send,receive:_id,unReadNum:chatDoc.length})
                                                    }
                                                    if(k === sendArr.length){
                                                        k=0
                                                        // console.log(unReadNumArr)
                                                        // console.log(messageArr)
                                                        unReadNumArr.map( v => {
                                                            for(let i=0;i<sendArr.length;i++){
                                                                if(v.send == sendArr[i]){
                                                                    // console.log(v.send)
                                                                    // console.log(i)
                                                                    // console.log(v.unReadNum)
                                                                    const data = Object.assign({},{
                                                                        avatarName:messageArr[i].avatarName,
                                                                        message:{
                                                                            chatText:messageArr[i].message.chatText,
                                                                            messageListId:messageArr[i].message.messageListId,
                                                                            receive:messageArr[i].message.receive,
                                                                            send:messageArr[i].message.send,
                                                                            sendTime:messageArr[i].message.sendTime,
                                                                            _id:messageArr[i].message._id,
                                                                            nickName:messageArr[i].message.nickName,
                                                                            unReadNum:v.unReadNum
                                                                        }
                                                                    })
                                                                    messageList[i] = data
                                                                    k++
                                                                    if(k === sendArr.length){
                                                                        // console.log(messageList)
                                                                        return res.json({code:1,messageList:messageList,msg:'获取消息列表成功'})

                                                                    }
                                                                }
                                                            }
                                                        })


                                                    }
                                                })
                                            })


                                        }
                                    }
                                }
                            })
                        }
                    }
                })

            })
        }else{
            return res.json({code:0,msg:'没有消息列表'})
        }
    })
})

// 获取消息列表 no-avatar 不传头像 ？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
app.post('/getLatestMessageList',function (req, res){})

// 获取对方用户信息
app.post('/getUserData',function (req, res) {
    const {_id} = req.body
    const focusId = req.cookies._id
    // console.log(_id)
    User.findOne({_id},function (err, doc) {
        if(err){
            return res.json({code:0,msg:'数据库出错'})
        }
        Focus.findOne({focusId,focusObjectId:_id},function (errFocus, docFocus) {
            if(errFocus){
                return res.json({code:0,msg:'数据库出错'})
            }
            // console.log(docFocus)
            if(docFocus){
                return res.json({code:1,msg:'获取对方用户信息成功',userData:doc,isFocus:true})// 未关注
            }else{
                return res.json({code:1,msg:'获取对方用户信息成功',userData:doc,isFocus:false})// 已关注

            }
        })
    })
})

// 检查用户手机号是否存在
app.post('/checkUserExist',function (req, res) {
    const {phone} = req.body
    User.findOne({phone}).exec(function (err, doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        if(!doc){
            return res.json({code:0,msg:'该用户手机号码不存在'})
        }else{
            return res.json({code:1,msg:'该用户手机号码存在'})

        }
    })
})

// 重置密码 -> 忘记密码
app.post('/resetPassword',function (req,res) {
    // console.log(req.body.phone)
    // console.log(req.body.password)
    User.update({phone:req.body.phone},{'$set':{pwd:md5Pwd(req.body.password)}}, function(err,doc){
        // console.log(err)
        // console.log(doc)
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        return res.json({code:1,num:doc.nModified,msg:'密码重置成功'})
    })
})

// 修改密码
app.post('/updatePassword',function(req,res){
    const {exPassword,updatePassword} = req.body
    // console.log(req.cookies._id)
    // console.log(exPassword)
    // console.log(updatePassword)
    User.findOne({_id:req.cookies._id,pwd:md5Pwd(req.body.exPassword)}).exec(function (err, doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        if(!doc){
            return res.json({code:0,msg:'原密码错误'})

        }else{
            if(exPassword === updatePassword){
                return res.json({code:0,msg:'新密码与原密码一样'})
            }else{
                User.update({_id:req.cookies._id},{'$set':{pwd:md5Pwd(updatePassword)}}, function(errUpdate,docUpdate){
                    if(errUpdate){
                        return res.json({code:0,msg:'后端数据库出错'})
                    }
                    res.cookie('pwd', md5Pwd(updatePassword))
                    return res.json({code:1,num:docUpdate.nModified,msg:'密码修改成功'})
                })
            }
        }
    })
})

// 获取对方用户发布的所有宝贝
app.post('/getUserPublish',function (req, res) {
    const {publisher} = req.body
    Publish.find({publisher}).exec(function (err, doc) {
        if(err){
            return res.json({code:0,msg:'后端数据库出错'})
        }
        const arr = []
        for(let i = doc.length-1; i >= 0; i-- ){
            arr.push(doc[i])
        }
        let userPublishListArr = []
        for(let i = 0; i < arr.length; i++){
            const data = Object.assign({},{
                _id:arr[i]._id,
                classification:arr[i].classification,
                clickNum:arr[i].clickNum,
                commentNum:arr[i].commentNum,
                mainImg:arr[i].compressImgList[0],
                price:arr[i].price,
                title:arr[i].title,
            })
            userPublishListArr[i] = data
        }
        return res.json({code:1,msg:'获取对方用户发布的所有宝贝成功',userPublishList:userPublishListArr})
    })


})

// 发布评论
app.post('/sendComment',function (req, res) {
    const {publishDetailsId,commentText,commentObject,commentObjectId,commentTime} = req.body
    const commenterId = req.cookies._id
    // if(commentObject === 'notPeople'){
        // console.log(1)

        const commentModel = new Comment({publishDetailsId,commentText,commenterId,commentObject,commentObjectId,commentTime})
        commentModel.save(function (errSave, docSave) {
            if (errSave) {
                return res.json({code: 0, msg: '后端数据库出错'})
            }
            return res.json({code: 1, msg: '发表评论成功',doc:docSave})
        })
    // }else{
        // console.log(2)
    // }
})

// 获取评论列表
app.post('/getCommentList',function (req, res) {
    const {publishDetailsId} = req.body
    // console.log(publishDetailsId)
    Comment.find({publishDetailsId},function (err, doc) {
        if (err) {
            return res.json({code: 0, msg: '后端数据库出错'})
        }
        if(doc.length !== 0 ){
            let orderArr = []
            orderCommentList(res,orderArr,doc,doc.length,0)
        }else{
            return res.json({code: 0 , msg: '评论列表为空'})

        }

    })
})

function orderCommentList(res,orderArr,doc,length,k) {// 评论列表正确排序
    User.findOne({_id:doc[k].commenterId},function (errUser, docUser) {
        // if (errUser) {
        //     return res.json({code: 0, msg: '后端数据库出错'})
        // }
        if(k<length){
            if(doc[k].commentObject === 'isPeople'){
                User.findOne({_id:doc[k].commentObjectId},function (errObjUser, docObjUser) {
                    if(k<length){
                        let data = Object.assign({},{
                            commentObject:doc[k].commentObject,
                            commentObjectId:doc[k].commentObjectId,
                            commentText:doc[k].commentText,
                            commentTime:doc[k].commentTime,
                            commenterId:doc[k].commenterId,
                            publishDetailsId:doc[k].publishDetailsId,
                            _id:doc[k]._id,
                            commenterNickName:docUser.nickName,
                            commenterAvatar:docUser.avatarName,
                            commentObjectNickName:docObjUser.nickName
                        })
                        orderArr[k] = data
                        k++
                        // console.log(k)
                        orderCommentList(res,orderArr,doc,length,k)
                    }else{
                        return res.json({code: 1, msg: '获取评论列表成功',commentList:orderArr})
                    }
                })
            }else{
                let data = Object.assign({},{
                    commentObject:doc[k].commentObject,
                    commentObjectId:doc[k].commentObjectId,
                    commentText:doc[k].commentText,
                    commentTime:doc[k].commentTime,
                    commenterId:doc[k].commenterId,
                    publishDetailsId:doc[k].publishDetailsId,
                    _id:doc[k]._id,
                    commenterNickName:docUser.nickName,
                    commenterAvatar:docUser.avatarName,
                })
                orderArr[k] = data
                k++
                orderCommentList(res,orderArr,doc,length,k)
            }


        }else{
            return res.json({code: 1, msg: '获取评论列表成功',commentList:orderArr})
        }
    })
}

// 上传头像avatar
app.post('/uploadAvatar',function (req,res) {
    const {phone} = req.cookies
    const {avatarName} = req.body
    if(avatarName === undefined){
        return res.json({code:0,msg:'上传头像失败'})
    }else{
        User.update({phone}, {'$set':{avatarName}}, function(err,doc){
            // console.log(doc)
            if (!err) {
                // console.log('上传成功')
                return res.json({code:1,msg:'上传头像成功'})
            }
            return res.json({code:0,msg:'上传头像失败'})
        })
    }
})

// 更新昵称
app.post('/updateNickName',function (req, res) {
    const {phone} = req.cookies
    const {nickName} = req.body
    // return res.json({code:0,msg:'保存昵称失败'})
    User.update({phone}, {'$set':{nickName}}, function(err,doc){
        // console.log(doc)
        if (!err) {
            return res.json({code:1,msg:'保存昵称成功'})
        }
        return res.json({code:0,msg:'保存昵称失败'})
    })
})

// 更新个性签名
app.post('/updateSignature',function (req, res) {
    const {phone} = req.cookies
    const {signature} = req.body
    // return res.json({code:0,msg:'保存个性签名失败'})
    User.update({phone}, {'$set':{signature}}, function(err,doc){
        // console.log(doc)
        if (!err) {
            return res.json({code:1,msg:'保存个性签名成功'})
        }
        return res.json({code:0,msg:'保存个性签名失败'})
    })
})

//  /updateUserDataRedux????????????????????????????????

// app.post('/updateUserDataRedux',function (req, res) {
//     const phone = req.cookies.phone
//     User.findOne({phone},function(err,doc){
//         if(err){
//             return res.json({code:0,msg:'后端数据库出错'})
//         }
//
//         return res.json({code:1,msg:'更新user redux成功',data:doc})
//     })
// })

// 查找物品 publish
app.post('/searchPublish',function (req, res) {
    const {_id} = req.cookies// 用户搜素记录存入数据库 -> 在发送里推荐喜欢的物品
    const keyword = req.body.publishTitle
    console.log(_id)
    // console.log(keyword)
    if(_id === undefined){
        Publish.find({
            $or: [  // 多字段同时匹配
                {title: {$regex: keyword, $options: '$i'}}, //  $options: '$i' 忽略大小写
            ]
        }).sort({publishTime: '-1'}).limit(15).exec(function (err, doc) {
            // console.log(doc.length)
            let publishList = []
            if(doc.length !== 0){
                for(let i = 0; i < doc.length; i++){
                    const data = Object.assign({},{
                        _id:doc[i]._id,
                        title:doc[i].title,
                        price:doc[i].price,
                        mainImg:doc[i].compressImgList[0],
                        clickNum:doc[i].clickNum
                    })
                    publishList[i] = data
                }
                return res.json({code:1,msg:'搜索物品成功!',publishList:publishList})
            }else{
                return res.json({code:0,msg:'没有搜索到您要找的物品!'})
            }

        })
    }else{
        Publish.find({
            $or: [  // 多字段同时匹配
                {title: {$regex: keyword, $options: '$i'}}, //  $options: '$i' 忽略大小写
            ]
        }).sort({sendTime: '-1'}).limit(5).exec(function (err, doc) {
            // console.log(doc.length)
            let publishList = []
            if(doc.length !== 0){
                for(let i = 0; i < doc.length; i++){
                    const data = Object.assign({},{
                        _id:doc[i]._id,
                        title:doc[i].title,
                        price:doc[i].price,
                        mainImg:doc[i].compressImgList[0],
                        clickNum:doc[i].clickNum
                    })
                    publishList[i] = data
                }
                return res.json({code:1,msg:'搜索物品成功!',publishList:publishList.filter( value => value.publisher != _id)})
            }else{
                return res.json({code:0,msg:'没有搜索到您要找的物品!'})
            }

        })
    }

})

// 查找用户 user
app.post('/searchUser',function (req, res) {
    const {_id} = req.cookies
    const {nickName} = req.body
    User.find({nickName},function (err, doc) {
        if (err) {
            return res.json({code: 0, msg: '后端数据库出错'})
        }
        // console.log(doc)
        if(doc.length !== 0){
            if(doc.filter( value => value._id != _id).length !== 0){
                return res.json({code:1,msg:'搜索到该用户成功!',userList:doc.filter( value => value._id != _id)})
            }else{
                return res.json({code:0,msg:'没有搜索到您要找的用户!'})
            }
        }else{
            return res.json({code:0,msg:'没有搜索到您要找的用户!'})
        }
    })
})

// 获取横条
app.post('/getBannerData',function (req, res) {

})

// 获取 新鲜的
app.post('/getFreshPublish',function (req, res) {
    Publish.find({"compressImgList.2" : {$exists:1} }).sort({publishTime: '-1'}).limit(4).exec(function (err, doc) {
        if (err) {
            return res.json({code: 0, msg: '后端数据库出错'})
        }
        if(doc.length !== 0 ){
            let freshPublishList = []
            if(doc.length !== 0) {
                for (let i = 0; i < doc.length; i++) {
                    const data = Object.assign({}, {
                        _id: doc[i]._id,
                        publisher:doc[i].publisher,
                        title: doc[i].title,
                        price: doc[i].price,
                        description:doc[i].description,
                        mainImg_3: [doc[i].compressImgList[0],doc[i].compressImgList[1],doc[i].compressImgList[2]],
                        clickNum: doc[i].clickNum,
                        publishTime:doc[i].publishTime,
                    })
                    freshPublishList[i] = data
                }
            }
            let freshPublishListArr = []
            orderFreshPublishList(res,freshPublishList,freshPublishList.length,0,freshPublishListArr)
        }
    })
})
function orderFreshPublishList(res,freshPublishList,length,k,freshPublishListArr) {
    if( k < length ){
        User.findOne({_id:freshPublishList[k].publisher},function (errUser, docUser) {
            // console.log(doc[k].publishDetailsId)
                let data = Object.assign({},{
                    _id: freshPublishList[k]._id,
                    publisher:freshPublishList[k].publisher,
                    avatarName:docUser.avatarName,
                    nickName:docUser.nickName,
                    title: freshPublishList[k].title,
                    price:freshPublishList[k].price,
                    description:freshPublishList[k].description,
                    mainImg_3: freshPublishList[k].mainImg_3,
                    clickNum: freshPublishList[k].clickNum,
                    publishTime: freshPublishList[k].publishTime

                })
                freshPublishListArr.push(data)
                k++
            orderFreshPublishList(res,freshPublishList,length,k,freshPublishListArr)
        })
    }else{
        return res.json({code:1,msg:'获取新鲜的成功!',freshPublishList:freshPublishListArr})
    }
}

// 获取 更多 新鲜的
app.post('/getMoreFreshPublish',function (req, res) {
    // console.log(req.body.freshPublishList_Timestamp)
    Publish.find({
        '$and': [
            { "compressImgList.2" : {$exists:1} },
            { publishTime: { $lt: req.body.freshPublishList_Timestamp }}]
        // $lt 小于
        // $lte 小于等于

    }).sort({publishTime: '-1'}).limit(2).exec(function (err, doc) {
        if (err) {
            return res.json({code: 0, msg: '后端数据库出错'})
        }
        if(doc.length !== 0 ){
            let freshPublishList = []
            if(doc.length !== 0) {
                for (let i = 0; i < doc.length; i++) {
                    const data = Object.assign({}, {
                        _id: doc[i]._id,
                        publisher:doc[i].publisher,
                        title: doc[i].title,
                        price: doc[i].price,
                        description:doc[i].description,
                        mainImg_3: [doc[i].compressImgList[0],doc[i].compressImgList[1],doc[i].compressImgList[2]],
                        clickNum: doc[i].clickNum,
                        publishTime:doc[i].publishTime,
                    })
                    freshPublishList[i] = data
                }
            }
            let freshPublishListArr = []
            orderMoreFreshPublishList(res,freshPublishList,freshPublishList.length,0,freshPublishListArr)
        }else{
            return res.json({code: 0, msg: '没有更多新鲜的!'})
        }
    })
})
function orderMoreFreshPublishList(res,freshPublishList,length,k,freshPublishListArr) {
    if( k < length ){
        User.findOne({_id:freshPublishList[k].publisher},function (errUser, docUser) {
            // console.log(doc[k].publishDetailsId)
            let data = Object.assign({},{
                _id: freshPublishList[k]._id,
                publisher:freshPublishList[k].publisher,
                avatarName:docUser.avatarName,
                nickName:docUser.nickName,
                title: freshPublishList[k].title,
                price:freshPublishList[k].price,
                description:freshPublishList[k].description,
                mainImg_3: freshPublishList[k].mainImg_3,
                clickNum: freshPublishList[k].clickNum,
                publishTime: freshPublishList[k].publishTime

            })
            freshPublishListArr.push(data)
            k++
            orderMoreFreshPublishList(res,freshPublishList,length,k,freshPublishListArr)
        })
    }else{
        return res.json({code:1,msg:'获取更多新鲜的成功!',freshPublishList:freshPublishListArr})
    }
}

// 获取 最热的
app.post('/getHotPublish',function (req, res) {
    const {timeStamp_3Days} = req.body
    Publish.find({
        '$and': [
            { "compressImgList.2" : {$exists:1} },
            { publishTime: { $gte: timeStamp_3Days }}]
        // $gte 大于等于
    }).limit(4).sort({clickNum: '-1'}).exec(function (err, doc) {
        if (err) {
            return res.json({code: 0, msg: '后端数据库出错'})
        }
        // console.log(doc.length)
        if(doc.length !== 0 ){
            let hotPublishList = []
            if(doc.length !== 0) {
                for (let i = 0; i < doc.length; i++) {
                    const data = Object.assign({}, {
                        _id: doc[i]._id,
                        publisher:doc[i].publisher,
                        title: doc[i].title,
                        price: doc[i].price,
                        description:doc[i].description,
                        mainImg_3: [doc[i].compressImgList[0],doc[i].compressImgList[1],doc[i].compressImgList[2]],
                        clickNum: doc[i].clickNum,
                        publishTime:doc[i].publishTime,
                    })
                    hotPublishList[i] = data
                }
            }
            let hotPublishListArr = []
            orderHotPublishList(res,hotPublishList,hotPublishList.length,0,hotPublishListArr)
        }else{
            return res.json({code:0,msg:'没有最近3天的最热!'})

        }
    })
})
function orderHotPublishList(res,hotPublishList,length,k,hotPublishListArr) {
    if( k < length ){
        User.findOne({_id:hotPublishList[k].publisher},function (errUser, docUser) {
            // console.log(doc[k].publishDetailsId)
            let data = Object.assign({},{
                _id: hotPublishList[k]._id,
                publisher:hotPublishList[k].publisher,
                avatarName:docUser.avatarName,
                nickName:docUser.nickName,
                title: hotPublishList[k].title,
                price:hotPublishList[k].price,
                description:hotPublishList[k].description,
                mainImg_3: hotPublishList[k].mainImg_3,
                clickNum: hotPublishList[k].clickNum,
                publishTime: hotPublishList[k].publishTime
            })
            hotPublishListArr.push(data)
            k++
            orderHotPublishList(res,hotPublishList,length,k,hotPublishListArr)
        })
    }else{
        return res.json({code:1,msg:'获取最热的成功!',hotPublishList:hotPublishListArr})
    }
}

// 获取 更多 最热的
app.post('/getMoreHotPublish',function (req, res) {
    // console.log(req.body.hotPublishList_Length)
    // console.log(req.body.hotPublishList_Timestamp)
    let dataNum =  2 // 每次获取更多hot 的数据量
    const {timeStamp_3Days} = req.body
    Publish.find({
        '$and': [
            { "compressImgList.2" : {$exists:1} },
            { publishTime: { $gte: timeStamp_3Days }}]
        // $gte 大于等于
    }).limit(req.body.hotPublishList_Length + dataNum).sort({clickNum: '-1'}).exec(function (err, doc) {
        // console.log(doc)
        const arr = doc.splice(-dataNum)
        if(doc.length !== 0 ){
            let hotPublishList = []
            if(doc.length !== 0) {
                for (let i = 0; i < arr.length; i++) {
                    const data = Object.assign({}, {
                        _id: arr[i]._id,
                        publisher:arr[i].publisher,
                        title: arr[i].title,
                        price: arr[i].price,
                        description:arr[i].description,
                        mainImg_3: [arr[i].compressImgList[0],arr[i].compressImgList[1],arr[i].compressImgList[2]],
                        clickNum: arr[i].clickNum,
                        publishTime:arr[i].publishTime,
                    })
                    hotPublishList[i] = data
                }
            }
            let hotPublishListArr = []
            orderMoreHotPublishList(res,hotPublishList,hotPublishList.length,0,hotPublishListArr)
        }else{
            return res.json({code:0,msg:'没有更多的最近3天的最热!'})
        }
    })
})
function orderMoreHotPublishList(res,hotPublishList,length,k,hotPublishListArr) {
    if( k < length ){
        User.findOne({_id:hotPublishList[k].publisher},function (errUser, docUser) {
            // console.log(doc[k].publishDetailsId)
            let data = Object.assign({},{
                _id: hotPublishList[k]._id,
                publisher:hotPublishList[k].publisher,
                avatarName:docUser.avatarName,
                nickName:docUser.nickName,
                title: hotPublishList[k].title,
                price:hotPublishList[k].price,
                description:hotPublishList[k].description,
                mainImg_3: hotPublishList[k].mainImg_3,
                clickNum: hotPublishList[k].clickNum,
                publishTime: hotPublishList[k].publishTime
            })
            hotPublishListArr.push(data)
            k++
            orderMoreHotPublishList(res,hotPublishList,length,k,hotPublishListArr)
        })
    }else{
        return res.json({code:1,msg:'获取更多最热的成功!',hotPublishList:hotPublishListArr})
    }
}


// 获取 猜你喜欢
app.post('/guessYouLike',function (req, res) {

})

// 获取 随便看看
app.post('/haveALook',function (req, res) {
    Publish.find({
        '$and': [
            { "compressImgList.2" : {$exists:1} }
         ]
    }).limit(30).sort({publishTime: '-1'}).exec(function (err, doc) {
        if (err) {
            console.log(err)
            return res.json({code:0, msg:'后端数据库出错'})
        }
        // console.log( Math.ceil(Math.random()*doc.length) - 1)
        const random = Math.ceil(Math.random()*doc.length) - 1
        User.findOne({_id:doc[random].publisher},function (errUser, docUser) {
            let data = Object.assign({},{
                _id: doc[random]._id,
                publisher:doc[random].publisher,
                avatarName:docUser.avatarName,
                nickName:docUser.nickName,
                title: doc[random].title,
                price:doc[random].price,
                description:doc[random].description,
                mainImg_3: [doc[random].compressImgList[0],doc[random].compressImgList[1],doc[random].compressImgList[2]],
                clickNum: doc[random].clickNum
            })
            return res.json({code:1,msg:'获取随便看看成功!',haveALookData:data})
        })
    })
})

server.listen(9093,function(){
    console.log('Node app:"server" start at port 9093')
})


// (md5+salt)*2 双层md5加密
function md5Pwd(pwd){
    const salt = 'a!#$%^&*(a;{}%……&*（——P}{'
    return utils.md5(utils.md5(pwd+salt))
}




