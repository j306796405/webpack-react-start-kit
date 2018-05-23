var ajax = require("./ajax"),
    util = require("./util");
/**
 * JrPlat应用接口
 */
var baseUrlJrPlat, apiUrlJrPlat, apiJrPlat;
baseUrlJrPlat = "https://jr.99bill.com/fpd-platform";
if (location.port == "8080") {
  baseUrlJrPlat = "/fpd-platform"
}
apiUrlJrPlat = {
  "queryIsFistSub": "/platform/queryIsFistSub.htm",//查询用户是否已开户
  "queryAutoFinanceSet": "/platform/queryAutoFinanceSet.htm",//查询自动转入配置项
  "queryNotices": "/common/queryNotices.htm",//查询公告信息
  "queryCurrProfitRate": "/common/queryCurrProfitRate.htm",//查询快利来收益率
  "queryFpdBalInfo": "/platform/queryFpdBalInfo.htm",//查询快利来收益和余额
  "queryOffsetDate": "/platform/qrueryOffsetDate.htm",//查询轧差日期和起投金额
  "queryRealTimeRedeemRule": "/platform/queryRealTimeRedeemRule.htm",//查询快利来转出规则
  "queryTradeOtpPassword": "/platform/queryTradeOtpPassword.htm",//是否验证支付密码
  "commitRedemption": "/platform/commitRedemption.htm",//快利来转出确认
  "queryInterestHis": "/platform/queryInterestHis.htm",//查询快利来收益历史
  "queryFinaOrderRecord": "/platform/queryFinaOrderRecord.htm",//查询快利来的活期流水账单
  "queryFinaOrder": "/platform/queryFinaOrder.htm",//查询快利来账单
  "queryRemitSupport": "/platform/queryTransferRemittSupportBank.htm",//是否可以使用转账汇款认购方式
  "subscribeRemit": "/platform/subscribeByTransferRemitt.htm",//转账汇款方式认购快利来确认
  "queryRemitDetail": "/platform/queryTransferRemitt.htm",//查询转账汇款收款方信息
  "subscribeByAte": "/platform/subscribeByAte.htm", //快利来转入确认
  "querySubscribeLimitRule": "/common/querySubscribeLimitRule.htm", //快利来转入确认
  "isNewFpdMemeber": "/common/isNewFpdMemeber.htm", //快利来转入确认
};
apiJrPlat = util.joinUrl(baseUrlJrPlat, apiUrlJrPlat);
/**
 * Ebd应用接口
 */
var baseUrlEbd, apiUrlEbd, apiEbd;
baseUrlEbd = "https://ebd.99bill.com/coc-bill-api";
if (location.port == "8080") {
  baseUrlEbd = "/coc-bill-api"
}
apiUrlEbd = {
  "personInfo": "/1.1/members/person/info",//查询用户信息
  "bindCards": "/1.3/members/bindCards",//查询绑定银行卡列表
  "banksLimitAmount": "/1.0/members/banksLimitAmount"//查询银行渠道限额列表
};
apiEbd = util.joinUrl(baseUrlEbd, apiUrlEbd);
/**
 * Ebd应用接口
 */
var baseUrlJrSale, apiUrlJrSale, apiJrSale;
baseUrlJrSale = "https://jr.99bill.com/fpd-sale";
if (location.port == "8080") {
  baseUrlJrSale = "/fpd-sale"
}
apiUrlJrSale = {
  "queryKqbFundsAcctFlag": "/fpdLink/queryKqbFundsAcctFlag.htm",//06.查询是否开通快钱宝账户
  "queryKqbFundsInfo": "/common/queryKqbFundsInfo.htm",//05查询快钱宝基金详情
};
apiJrSale = util.joinUrl(baseUrlJrSale, apiUrlJrSale);
/**
 * Exports
 */
module.exports = {
  ///jr
  queryIsFistSub: function (callback) {
    return ajax.post({
      url: apiJrPlat.queryIsFistSub,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  queryAutoFinanceSet: function (callback) {
    var data = {};
    data["orderSource"] = app.session.get("orderSource");
    return ajax.post({
      url: apiJrPlat.queryAutoFinanceSet,
      data: data,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  queryNotices: function (callback) {
    var data = {"orderSource": app.session.get("orderSource")};
    return ajax.get({
      url: apiJrPlat.queryNotices,
      data: data,
      postJSON: false,
      callback: callback
    });
  },
  queryCurrProfitRate: function (callback) {
    return ajax.get({
      url: apiJrPlat.queryCurrProfitRate,
      callback: callback
    });
  },
  queryFpdBalInfo: function (callback) {
    return ajax.post({
      url: apiJrPlat.queryFpdBalInfo,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  queryOffsetDate: function (data, callback) {
    return ajax.post({
      url: apiJrPlat.queryOffsetDate,
      data: data,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  queryRealTimeRedeemRule: function (callback) {
    return ajax.post({
      url: apiJrPlat.queryRealTimeRedeemRule,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  queryTradeOtpPassword: function (data, callback) {
    data["orderSource"] = app.session.get("orderSource");
    return ajax.post({
      url: apiJrPlat.queryTradeOtpPassword,
      data: data,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  commitRedemption: function (data, callback) {
    data["orderSource"] = app.session.get("orderSource");
    return ajax.post({
      url: apiJrPlat.commitRedemption,
      postJSON: false,
      data: data,
      headers: {Authorization: app.session.get("payToken") || app.session.get("loginToken")},
      callback: callback
    });
  },
  queryInterestHis: function (data, callback) {
    return ajax.post({
      url: apiJrPlat.queryInterestHis,
      postJSON: false,
      data: data,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  queryFinaOrderRecord: function (data, callback) {
    data["orderSource"] = app.session.get("orderSource");
    return ajax.post({
      url: apiJrPlat.queryFinaOrderRecord,
      postJSON: false,
      data: data,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  queryFinaOrder: function (data, callback) {
    return ajax.post({
      url: apiJrPlat.queryFinaOrder,
      postJSON: false,
      data: data,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  queryRemitSupport: function (callback) {
    var data = {};
    data["orderSource"] = app.session.get("orderSource");
    return ajax.post({
      url: apiJrPlat.queryRemitSupport,
      data: data,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  subscribeRemit: function (data, callback) {
    data["orderSource"] = app.session.get("orderSource");
    return ajax.post({
      url: apiJrPlat.subscribeRemit,
      data: data,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  queryRemitDetail: function (data, callback) {
    data["orderSource"] = app.session.get("orderSource");
    return ajax.post({
      url: apiJrPlat.queryRemitDetail,
      data: data,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback
    });
  },
  subscribeByAte: function (data, callback, errCallback) {
    data["orderSource"] = app.session.get("orderSource");
    return ajax.post({
      url: apiJrPlat.subscribeByAte,
      data: data,
      headers: {Authorization: app.session.get("payToken") || app.session.get("loginToken")},
      callback: callback,
      error: errCallback
    });
  },
  querySubscribeLimitRule: function (callback) {
    const loginToken = app.session.get("loginToken");
    const params = {
      url: apiJrPlat.querySubscribeLimitRule,
      callback
    }

    if(loginToken){
      params.headers = {
        Authorization: loginToken
      }
    }

    // return callback({
    //   "errCode": "0000",
    //   "errMsg": "测试内容ut36",
    //   "personalAmount": 58041,
    //   "productAmount": 500000,
    //   "productShowAmount": 0
    // })

    return ajax.post(params);
  },
  isNewFpdMemeber: function (callback) {
    return ajax.post({
      url: apiJrPlat.isNewFpdMemeber,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback,
    });
  },
  ///ebd
  personInfo: function (data, callback) {
    data = data || {"searchFlag": "realName,bindCard,safeCard"};
    return ajax.get({
      url: apiEbd.personInfo,
      postJSON: false,
      headers: {Authorization: app.session.get("loginToken")},
      data: data,
      callback: callback
    });
  },
  bindCards: function (callback) {
    var data = {"bizCode": "Kqqb_KLL", "cardType": "0002"};
    return ajax.get({
      url: apiEbd.bindCards,
      postJSON: false,
      headers: {Authorization: app.session.get("loginToken")},
      data: data,
      callback: callback
    });
  },
  banksLimitAmount: function (callback) {
    var data = {"bizCode": "Kqqb_KLL", "cardType": "D"};
    return ajax.get({
      url: apiEbd.banksLimitAmount,
      postJSON: false,
      data: data,
      callback: callback
    });
  },
  // jr sale
  queryKqbFundsAcctFlag: function (callback) {
    return ajax.post({
      url: apiJrSale.queryKqbFundsAcctFlag,
      headers: {Authorization: app.session.get("loginToken")},
      callback: callback,
    });
  },
  queryKqbFundsInfo: function (data, callback) {
    return ajax.post({
      url: apiJrSale.queryKqbFundsInfo,
      headers: {Authorization: app.session.get("loginToken")},
      data,
      callback: callback,
    });
  },
};
