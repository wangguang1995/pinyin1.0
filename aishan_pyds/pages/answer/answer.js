// pages/answer/answer.js
var timer;
const app = getApp();
//算取每一题递减的时间  
function bili(startTime, endTime,answerNumber) {
    var start_time = startTime * 1000 /100;
    var end_timer = endTime * 1000 /100;
    var djTime = ((start_time - end_timer) / answerNumber).toFixed(2);
    return { "start_time": start_time, "djTime": djTime };
}  
Page({
    /**
     * 页面的初始数据
     */
    data: {
        jindu: 100,//进度条
        now: 50,
        startTime:null,//开始持续时间
        endTime:null,//结束持续时间
        isFlag:null,//遮罩显示或隐藏
        answerNumber:null,//一共多少道题
        isJson:[],
        num:0,
        time: null,//时间戳
        id:1
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (e) {
        
    },
    returnIndex:function(){
        this.setData({
            isFlag:false
        })
        wx.switchTab({
            url: '../index/index',
        })
    },
    //进度条动画
    progress: function (e) {
        var progressNum = 100;
        var _this = this;
        timer = setInterval(function () {
            progressNum--;
            if (progressNum <= 0) {
                clearInterval(timer);
                _this.setData({
                    isFlag:true
                })
            }
            _this.setData({
                jindu: progressNum
            })
        }, _this.data.now)
    },
    //点击事件
    selectAnswer:function(e){
        var startTime = this.data.startTime;//开始时间
        var endTime = this.data.endTime;//结束时间
        var answerNumber = this.data.answerNumber;//答对多少提
        var dj_time = bili(startTime, endTime, answerNumber).djTime;//每一题递减多少时间
        var value = e.currentTarget.dataset.text;//当前点击的value值
        var isJson = this.data.isJson;//数组容器
        var num = this.data.num;//当前下标
        var id = this.data.id;//第几题
        
        console.log(id);
        console.log(value + " " + isJson[num].right_py);
        var number = wx.getStorageSync('number');
        console.log(num+" "+number);
        if(id == number){
            clearInterval(timer);
            var openId = wx.getStorageSync('openId');
            app.util.request({
                'url': 'entry/wxapp/clearance',
                data: {
                    openId: openId
                },
                success(res) {
                    console.log(res);

                }
            })
            app.util.request({
                'url': 'entry/wxapp/record',
                data: {
                    openId: openId,
                    record: id
                },
                success(res) {
                    console.log(res);
                    wx.setStorageSync('record', res.data.record);
                }
            })
            wx.showModal({
                title: '提示',
                content: '恭喜你，挑战成功',
                success: function (res) {
                    if (res.confirm) {
                        wx.switchTab({
                            url: '../index/index',
                        })
                    } else if (res.cancel) {
                        wx.switchTab({
                            url: '../index/index',
                        })
                    }
                }
            })    
        }else{
            if (value == isJson[num].right_py) {
                var time = new Date().getTime();
                this.setData({
                    time: time
                })
                console.log('答对了')
                console.log('答题递减时间：'+this.data.now)
                clearInterval(timer);
                num++;
                id++;
                this.setData({
                    num: num,
                    id:id,
                    now: this.data.now - dj_time
                })
                this.progress();
            }else{
                clearInterval(timer);
                console.log('答错了')
                var openId = wx.getStorageSync('openId');
                var record = wx.getStorageSync('record');
                console.log(openId+" "+record)
                if((id-1) > record){
                    app.util.request({
                        'url': 'entry/wxapp/record',
                        data: {
                            openId: openId,
                            record: id-1
                        },
                        success(res) {
                            console.log(res);
                            wx.setStorageSync('record', res.data.record);
                        }
                    })
                    
                }
                this.setData({
                    isFlag: true
                })
                
            }
        }
        
        
    },
    
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
        var _this = this;
        app.util.request({
            'url': 'entry/wxapp/answer',
            'cachetime': '30',
            success(res) {
                console.log(res);
                if(res.data.data.question[_this.data.num].position == 1){
                    _this.setData({
                        wordIsTrue:true
                    })
                }else{
                    wordIsTrue: false
                }
                _this.setData({
                    isJson:res.data.data.question,//题库
                    startTime: res.data.data.sysInfo.answer_time,//开始时间
                    endTime: res.data.data.sysInfo.end_time,//结束时间
                    answerNumber: res.data.data.sysInfo.answer_number,//题目数
                    now: bili(res.data.data.sysInfo.answer_time, res.data.data.sysInfo.end_time, res.data.data.sysInfo.answer_number).start_time
                })
                
                
            }
            
        })   
    },
    /**
   * 生命周期函数--监听页面隐藏
   */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})