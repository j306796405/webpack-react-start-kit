var service = require("./service"),
    util = require("./util");
module.exports = function () {
  service.banksLimitAmount(function (data) {
    //生成列表
    var bankCardList = data.bankLimitAmountList, j, len, liHtml = "";
    if (!bankCardList || !bankCardList.length) {
      return false;
    }
    len = bankCardList.length;
    for (j = 0; j < len; j++) {
      liHtml +=
          '<li>' +
          '<div class="item-content">' +
          '<div class="item-media"><img src="https://img.99bill.com/mobsup/banktip/img/bank_' + bankCardList[j].bankId.toLowerCase() + '.png" width="28" height="28"></div>' +
          '<div class="item-inner">' +
          '<div class="item-title">' +
          '<div class="tit">' + bankCardList[j].bankName + '储蓄卡</div>' +
          '<div class="desc">单笔限额' + util.tenMillion(bankCardList[j].singleAmount) + ', 单日限额' + util.tenMillion(bankCardList[j].dayAmount) + '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</li>'
      ;
    }
    //跳转
    mainView.router.load({content: '<div class="page" data-page="bank-limitlist" data-title="银行限额表"><div class="page-content"><div class="list-block list-full bank-limitlist"><ul>' + liHtml + '</ul></div></div></div>'});
  });
};
