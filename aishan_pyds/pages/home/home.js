//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        userInfo: {},
        isTrue: false,
        answer_number:"",//答题次数
        surplus_number:"",//剩余挑战次数
        clearance_number:"",//通关次数
        record:"",//最高分
        Clearance_num:0,
        isflag:null,
        canGet:""
    },

    onLoad: function () {
        
        wx.setNavigationBarTitle({
            title: app.globalData.name
        })
    },
    //遮罩显示
    indexShare: function (e) {
        this.setData({
            isTrue: true
        })
    },
    //遮罩隐藏
    indexHide: function (e) {
        this.setData({
            isTrue: false
        })
    },
    //分享
    onShareAppMessage: function (res) {
        var share_text = wx.getStorageSync('share_text');
        let that = this
        return {
            title: share_text,
            path: '/aishang_jzmaster/pages/index/index?url=',
            success: function (res) {
                //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android
                //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets
                //获取用户设备信息
                wx.getSystemInfo({
                    success: function (d) {
                        console.log(d);
                        //判断用户手机是IOS还是Android
                        if (d.platform == 'android') {
                            console.log(1)
                            wx.getShareInfo({
                                shareTicket: res.shareTickets,
                                success: function (res) {
                                    console.log(res);
                                    var openId = wx.getStorageSync('openId');
                                    var session3rd = wx.getStorageSync('session3rd');
                                    app.util.request({
                                        url: 'entry/wxapp/Increase',
                                        data: {
                                            openId: openId,
                                            session3rd: session3rd,
                                            iv: res.iv,
                                            encryptedData: res.encryptedData
                                        },
                                        success: function (res) {
                                            console.log(res);
                                            var surplus_number = wx.getStorageSync('surplus_number');
                                            console.log(surplus_number);
                                            console.log(res.data.data.share_group);
                                            wx.setStorageSync('surplus_number', (parseInt(surplus_number) + parseInt(res.data.data.share_group)));
                                            wx.showModal({
                                                title: '提示',
                                                content: res.data.message,
                                                showCancel: false,
                                                success: function (res) {
                                                    if (res.confirm) {
                                                        console.log('用户点击确定')
                                                    } else if (res.cancel) {
                                                        console.log('用户点击取消')
                                                    }
                                                }
                                            })

                                        }
                                    })
                                },
                                fail: function (res) {
                                    wx.showModal({
                                        title: '提示',
                                        content: '分享好友无效，请分享群',
                                        success: function (res) {
                                            if (res.confirm) {
                                                console.log('用户点击确定')
                                            } else if (res.cancel) {
                                                console.log('用户点击取消')
                                            }
                                        }
                                    })
                                }
                            })
                        }
                        if (d.platform == 'ios') {
                            console.log(2);
                            if (res.shareTickets != undefined) {
                                console.log("分享的是群");
                                console.log(res);
                                wx.getShareInfo({
                                    shareTicket: res.shareTickets,
                                    success: function (res) {
                                        var openId = wx.getStorageSync('openId');
                                        var session3rd = wx.getStorageSync('session3rd');
                                        app.util.request({
                                            url: 'entry/wxapp/Increase',
                                            data: {
                                                openId: openId,
                                                session3rd: session3rd,
                                                iv: res.iv,
                                                encryptedData: res.encryptedData
                                            },
                                            success: function (res) {
                                                console.log(res);
                                                var surplus_number = wx.getStorageSync('surplus_number');
                                                wx.setStorageSync('surplus_number', (parseInt(surplus_number) + parseInt(res.data.data.share_group)));
                                                wx.showModal({
                                                    title: '提示',
                                                    content: res.data.message,
                                                    showCancel: false,
                                                    success: function (res) {
                                                        if (res.confirm) {
                                                            console.log('用户点击确定')
                                                        } else if (res.cancel) {
                                                            console.log('用户点击取消')
                                                        }
                                                    }
                                                })

                                            }
                                        })
                                    }
                                })

                            } else {
                                console.log(res);
                                console.log("分享的是个人");
                                wx.showModal({
                                    title: '提示',
                                    content: '分享好友无效，请分享群',
                                    success: function (res) {
                                        if (res.confirm) {
                                            console.log('用户点击确定')
                                        } else if (res.cancel) {
                                            console.log('用户点击取消')
                                        }
                                    }
                                })
                            }
                        }

                    },
                    fail: function (res) {

                    }
                })
            }

        }
    },
    onShow: function () {
        app.getInfo();
        //获得用户权限
        if (app.globalData.userInfo != null) {
            this.setData({
                userInfo: app.globalData.userInfo
            })
        }
        //分享获得ShareTicket
        wx.showShareMenu({
            withShareTicket: true
        })
        //可分享的次数
        var share_number = wx.getStorageSync('share_number');
        if (share_number == 0) {
            this.setData({
                isflag: true
            })
        } else {
            this.setData({
                isflag: false
            })
        }
        var _this = this;
        
        var answer_number = wx.getStorageSync('answer_number');
        var clearance_number = wx.getStorageSync('clearance_number');//可领取奖品数量
        var surplue_number = wx.getStorageSync('surplus_number');//可挑战次数
        var prize_number = wx.getStorageSync('prize_number');
        var record = wx.getStorageSync('record');
        var canGet = wx.getStorageSync('canGet');
        
        _this.setData({
            answer_number: answer_number,
            clearance_num: clearance_number,
            surplus_number: surplue_number,
            num: prize_number,
            record:record,
            canGet:canGet
        })
        
    }
})
