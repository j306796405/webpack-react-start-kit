/* 更换安全卡 */

import { Component } from 'react'
import util from './../util'

module.exports = ({title, bankCardList, safeCard, onClickSelectTempSafeCard, tempSafeCard}) => {
  const $$pageCont = $$(`<div class="page" data-page="select-pay-method" data-title="${title}"></div>`)

  ReactDOM.render(<SelectPayMethod tempSafeCard={tempSafeCard} safeCard={safeCard} bankCardList={bankCardList}
                                   onClickSelectTempSafeCard={onClickSelectTempSafeCard}/>, $$pageCont[0])

  mainView.router.load({content: $$pageCont})
}

class SelectPayMethod extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {

  }

  onHandleSelectCard = (safeCard) => {
    const {props: {onClickSelectTempSafeCard}} = this

    onClickSelectTempSafeCard(safeCard)
    setTimeout(() => {
      mainView.back()
    }, 200)
  }

  render () {
    const {onHandleSelectCard, props: {bankCardList, safeCard, tempSafeCard}} = this

    return (
      <div className="pay-method-module">
        <div className="select-safe-card-method-module">
          <div className="list-select-clearing-title">选择本息发放方式</div>
          <div className="list-block">
            <div className="list-block list-full">
              <ul>
                {
                  bankCardList && bankCardList.map((card) => {
                    const safeCardMemberBankAcctID = safeCard ? safeCard.memberBankAcctID : tempSafeCard.memberBankAcctID

                    return (
                      <li>
                        <label className="label-radio item-content" onClick={onHandleSelectCard.bind(this, card)}>
                          <input type="radio" name="allocate-method"
                                 defaultChecked={card.memberBankAcctID === safeCardMemberBankAcctID}/>
                          <div className="item-media">
                            <i className="micon micon-pay-aqk"
                               style={{backgroundImage: `url('https://img.99bill.com/mobsup/banktip/img/bank_${card.bankId.toLowerCase()}.png')`}}/>
                          </div>
                          <div className="item-inner">
                            <div className="item-title">
                              <div className="name">安全卡({card.bankName}{card.bankAcctID})</div>
                              <div
                                className="desc">单笔{util.tenMillion(card.singleAmount)}，单日{util.tenMillion(card.dayAmount)}</div>
                            </div>
                          </div>
                        </label>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
