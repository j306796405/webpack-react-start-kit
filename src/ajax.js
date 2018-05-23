let ajax = function (params) {
  // let mockdata = require("./mockdata");
  // if (mockdata[params.url]) {
  // 	console.log(mockdata[params.url]);
  // 	return params.callback(mockdata[params.url]);
  // }
  //params: url, method, headers, postJSON, data, callback, timeout, invalidation
  let ajaxOpt = {
    url: params.url,
    method: params.method,
    success: function (data) {
      app.session.set("indicatorCount", app.session.get("indicatorCount") - 1);
      app.session.get("indicatorCount") || app.hideIndicator();
      data = JSON.parse(data);
      console.log(params.url, data);
      if ((data.errCode === "00" || data.errCode === "0000") && params.callback) {
        return params.callback(data);
      } else if ((data.errCode === "03" || data.errCode === "0013") && params.invalidation) {
        app.session.del("loginToken");
        app.session.del("payToken");
        return params.invalidation();
      } else if (params.error) {
        return params.error(data);
      } else if (data.errMsg) {
        return app.toast(data.errMsg);
      }
    },
    error: function (xhr, status) {
      app.session.set("indicatorCount", app.session.get("indicatorCount") - 1);
      app.session.get("indicatorCount") || app.hideIndicator();
      if (params.timeout) {
        return params.timeout();
      } else {
        return app.toast("网络连接超时，请稍后再试");
      }
    }
  };
  if (typeof params.postJSON === "undefined") {
    params.postJSON = true;
  }
  if (params.postJSON) {
    ajaxOpt.contentType = "application/json;charset=UTF-8";
  }
  if (params.headers) {
    ajaxOpt.headers = params.headers;
  }
  if (!params.invalidation) {
    params.invalidation = app.login;
  }
  params.data = params.data || {};
  ajaxOpt.data = params.postJSON ? JSON.stringify(params.data) : params.data;
  app.session.set("indicatorCount", app.session.get("indicatorCount") + 1);
  app.showIndicator();
  return setTimeout(function () {
    $$.ajax(ajaxOpt);
  }, 10);
};
module.exports = {
  get: function (params) {
    params = params || {};
    params.method = "GET";
    return ajax(params);
  },
  post: function (params) {
    params = params || {};
    params.method = "POST";
    return ajax(params);
  }
};