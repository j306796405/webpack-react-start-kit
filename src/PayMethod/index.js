import { Component } from 'react'
// import './css/pay-method.less'
import util from './../util'
import bankLimit from './../bankLimit'
import selectMethod from './selectMethod'
import selectOutMethod from './selectOutMethod'

/**
 * method为out转出时，卡列表参数如下
 * title 卡标题
 * desc 子描述
 * value accountType 卡类型 3：银行卡，10：飞凡宝
 * imgUrl: 卡图标
 * isSafeCard: false,(是否是安全卡)
 * isOpened: 是否开通(快利来/飞凡宝)
 * viewUpdateCallback 接口刷新回调
 * */

export default class PayMethod extends Component {
  constructor (props) {
    super(props)

    const {props: {bankCardList, safeCard, method}} = this
    let tempSafeCard = null

    // 转入且没有安全卡时，从绑定的卡列表中选择出安全卡
    if (method === 'into') {
      tempSafeCard = safeCard ? null : bankCardList[0]
    }

    this.state = {
      tempSafeCard
    }
  }

  componentDidMount () {

  }

  // 左侧点击事件监听
  onClickBefore = () => {
    const {props: {beforeClick, statCateGory, beforeClickStat}} = this

    if (beforeClick) {
      beforeClick()
      app.stat.send(statCateGory, beforeClickStat)
    }
  }

  // 右侧点击事件监听
  onClickAfter = () => {
    const {props: {viewUpdateCallback, afterClick, statCateGory, afterClickStat}} = this
    app.stat.send(statCateGory, afterClickStat)

    // 如果未定义点击事件，默认为更换安全卡事件
    if (afterClick) {
      return afterClick()
    }

    if (KQB.Env.KQ) {
      KQB.native('setSecurityCard', {
        businessType: '1', success: () => {
          viewUpdateCallback && viewUpdateCallback(true)
        },
      })
    } else {
      util.openPage(
        `https://www.99bill.com/seashell/webapp/safe-card-external/${app.var.linkSuffix}/index.html`,
        location.href)
    }
  }

  onClickBankLimit = () => {
    bankLimit()
  }

  // 添加安全卡
  onClickAddCard = () => {
    util.openPage('https://www.99bill.com/seashell/webapp/billtrunk2/bindcard.html?safe=1', null, false)
  }

  // FAQ
  onClickCardFAQ = () => {
    mainView.router.load({content: '<div class="page" data-page="card-faq" data-title="银行限额表"><div class="page-content"><iframe src="https://www.99bill.com/seashell/html/website/app/aqk/aqkMobile.html"></iframe></div></div>'})
  }

  // 选择支付方式
  onClickSelectTempCardsList = () => {
    const {props: {bankCardList, safeCard}, state: {tempSafeCard}, onClickSelectTempSafeCard} = this

    selectMethod({
      'title': '选择支付方式',
      bankCardList,
      safeCard,
      tempSafeCard,
      onClickSelectTempSafeCard
    })
  }

  // 有多张银行卡，但为设置安全卡
  onClickSelectTempSafeCard = (tempSafeCard) => {
    this.setState({
      tempSafeCard
    })
  }

  onClickSelectOutCardsList = () => {
    const {props: {outCardsList, outCard, viewUpdateCallback}, onClickSelectOutCard} = this

    selectOutMethod({
      'title': '选择转出方式',
      outCardsList,
      outCard,
      onClickSelectOutCard,
      viewUpdateCallback
    })
  }

  onClickSelectOutCard = (outCard) => {
    const {props: {selectOutCardCallback}} = this

    selectOutCardCallback(outCard)
  }

  // 去开通
  onClickOutCardOpen = () => {
    const {props: {viewUpdateCallback, outCard}} = this
    const baseUrl = location.port === '8080'
      ? (`${location.origin}/`)
      : `https://www.99bill.com/seashell/webapp/2016-kll-plus/`
    let url = ''

    switch (outCard.value) {
      case 10: {
        viewUpdateCallback && util.bindViewUpdate(viewUpdateCallback, 'view_isOpenffb')
        url = `${baseUrl}${app.var.linkSuffix}/index.html?isOpenAccount=1&direct=Y`
        break
      }
    }

    util.openPage(url)
  }

  render () {
    const {
      props: {beforeText, afterText, safeCard, bankCardList, method, hasGap, outCard, outCardsList, isShowCardStatus},
      state: {tempSafeCard},
      onClickBefore, onClickAfter, onClickBankLimit, onClickAddCard, onClickCardFAQ, onClickSelectTempCardsList, onClickSelectOutCardsList, onClickOutCardOpen
    } = this
    const hasMoreOutCards = outCardsList ? outCardsList.length > 1 : false

    return (
      <div className={`pay-method-module ${hasGap ? 'pay-method-module-gap' : ''}`}>
        {
          (() => {
            // 转入有安全卡时
            if (safeCard && method === 'into') {
              return (
                <div className="pay-method-module-card">
                  <div className="hd">
                    <div className="tit" onClick={onClickBefore}>{beforeText}</div>
                    <a href="#" className="hd-after" onClick={onClickAfter}>{afterText}</a>
                  </div>
                  <div className="list-block list-full">
                    <ul>
                      <li className="item-content">
                        <div className="item-media">
                          <i className="micon micon-pay-aqk"
                             style={{backgroundImage: `url('https://img.99bill.com/mobsup/banktip/img/bank_${safeCard.bankId.toLowerCase()}.png')`}}/>
                        </div>
                        <div className="item-inner">
                          <div className="item-title">
                            <div className="name">安全卡({safeCard.bankName}{safeCard.bankAcctID})</div>
                            <div
                              className="desc">单笔{util.tenMillion(safeCard.singleAmount)}，单日{util.tenMillion(safeCard.dayAmount)}</div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )
            }
            // 转入 无安全卡时，但有绑定过银行卡
            else if (bankCardList && bankCardList.length > 0 && method === 'into') {
              return (
                <div className="pay-method-module-card">
                  <div className="list-block pay-method-module-no-card">
                    <div className="card-desc">
                      <div className="aqk-link" onClick={onClickCardFAQ}>了解详情</div>
                      <div className="tit">安全卡说明</div>
                      <div className="desc">安全卡是您购买理财时唯一可用于支付的银行卡，理财本息仅能取出至安全卡，保障您的资金安全。</div>
                    </div>
                    <div className="card-support">
                      <div className="setcard-desc">此卡将自动设为安全卡</div>
                      <div className="supportcard-link card-limit" onClick={onClickBankLimit}>银行限额表</div>
                    </div>
                    <div className="list-block list-full">
                      <ul>
                        <li className="item-content item-link" onClick={onClickSelectTempCardsList}>
                          <div className="item-media">
                            <i className="micon micon-pay-aqk"
                               style={{backgroundImage: `url('https://img.99bill.com/mobsup/banktip/img/bank_${tempSafeCard.bankId.toLowerCase()}.png')`}}/>
                          </div>
                          <div className="item-inner">
                            <div className="item-title">
                              <div className="name">安全卡({tempSafeCard.bankName}{tempSafeCard.bankAcctID})</div>
                              <div
                                className="desc">单笔{util.tenMillion(tempSafeCard.singleAmount)}，单日{util.tenMillion(tempSafeCard.dayAmount)}</div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            }
            // 转入，没有安全卡，也没绑定过银行卡
            else if (method === 'into') {
              return (
                <div className="pay-method-module-card">
                  <div className="list-block pay-method-module-no-card">
                    <div className="card-desc">
                      <div className="aqk-link" onClick={onClickCardFAQ}>了解详情</div>
                      <div className="tit">安全卡说明</div>
                      <div className="desc">安全卡是您购买理财时唯一可用于支付的银行卡，理财本息仅能取出至安全卡，保障您的资金安全。</div>
                    </div>
                    <div className="card-support">
                      <div className="setcard-desc">此卡将自动设为安全卡</div>
                      <div className="supportcard-link card-limit" onClick={onClickBankLimit}>银行限额表</div>
                    </div>
                    <ul>
                      <li>
                        <div className="item-content item-link" onClick={onClickAddCard}>
                          <div className="item-inner">
                            <div className="item-title">请添加一张储蓄卡进行理财</div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )
            }
            // 转出
            else if (method === 'out') {
              let {title, desc, value, imgUrl, isSafeCard, isOpened} = outCard
              const isInactive = !isSafeCard && !isOpened

              return (
                <div className="pay-method-module">
                  <div className="pay-method-module-card">
                    <div className="list-block pay-method-module-no-card">
                      <div className="hd">
                        <div className="tit" onClick={onClickBefore}>{beforeText}</div>
                        <a href="#" className="hd-after" onClick={onClickAfter}>{afterText}</a>
                      </div>
                      <div className="list-block list-full">
                        <ul>
                          <li
                            className={`item-content ${hasMoreOutCards && 'item-link'} ${isInactive ? 'inactive' : ''}`}
                            onClick={hasMoreOutCards && onClickSelectOutCardsList}>
                            <div className="item-media">
                              <i className="micon micon-pay-aqk"
                                 style={{backgroundImage: `url(${imgUrl})`}}/>
                            </div>
                            <div className="item-inner">
                              <div className="item-title">
                                <div className="name">{title}</div>
                                {desc && <div className="desc">{desc}</div>}
                              </div>
                            </div>
                          </li>
                          {
                            isInactive && isShowCardStatus && (
                              <li className="item-content card-status-item-content">
                                <div className="item-title">
                                  <p>您的飞凡宝账户尚未开通，请转入1元<a href="#" onClick={onClickOutCardOpen}>立即开通></a></p>
                                  <p>或更改转出方式</p>
                                </div>
                              </li>
                            )
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          })()
        }
      </div>
    )
  }
}

PayMethod.defaultProps = {
  hasGap: true,
  statCateGory: null,
  beforeText: '支付方式',
  beforeClickStat: null,
  afterText: '更换安全卡',
  afterClickStat: null,
  bankCardList: [],
  safeCard: null,
  method: 'into',
  outCard: null,
  isShowCardStatus: true,
  viewUpdateCallback: () => {}
}
