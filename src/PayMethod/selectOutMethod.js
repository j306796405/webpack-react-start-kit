/* 更换转出方式 银行卡，快利来，飞凡宝*/

import { Component } from 'react'
import util from '../util'

module.exports = ({title, outCardsList, onClickSelectOutCard, outCard, viewUpdateCallback}) => {
  const $$pageCont = $$(`<div class="page" data-page="select-pay-method" data-title="${title}"></div>`)

  ReactDOM.render(<SelectPayMethod outCard={outCard} outCardsList={outCardsList}
                                   onClickSelectOutCard={onClickSelectOutCard}
                                   viewUpdateCallback={viewUpdateCallback}
  />, $$pageCont[0])

  mainView.router.load({content: $$pageCont})
}

class SelectPayMethod extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {

  }

  onHandleSelectCard = (card) => {
    const {props: {onClickSelectOutCard}} = this

    onClickSelectOutCard(card)
    this.routeBack()
  }

  // 去开通
  onHandleOpenMethod = (accountType) => {
    // 开通的回调
    const {props: {viewUpdateCallback}} = this
    // 3：银行卡，10：飞凡宝
    let url = ''

    if (accountType === 10) {
      const baseUrl = location.port === '8080'
        ? (`${location.origin}/`)
        : `https://www.99bill.com/seashell/webapp/2016-kll-plus/`
      url = `${baseUrl}${app.var.linkSuffix}/index.html?isOpenAccount=1&direct=Y`

      viewUpdateCallback && util.bindViewUpdate(viewUpdateCallback, 'view_isOpenffb')
    }

    this.routeBack(() => {
      util.openPage(url)
    })
  }

  routeBack = (callback) => {
    setTimeout(() => {
      mainView.back()
      setTimeout(() => {
        callback && callback()
      }, 200)
    }, 200)
  }

  render () {
    const {onHandleSelectCard, onHandleOpenMethod, props: {outCardsList, outCard}} = this

    return (
      <div className="pay-method-module">
        <div className="select-safe-card-method-module">
          <div className="hd">
            <div className="tit">转出至</div>
          </div>
          <div className="list-block">
            <div className="list-block list-full">
              <ul>
                {
                  outCardsList && outCardsList.map((card) => {
                    const {title, desc, value, imgUrl, isSafeCard, isOpened} = card
                    const isInactive = !isSafeCard && !isOpened

                    return (
                      <li>
                        <label className={`label-radio item-content ${isInactive ? 'inactive' : ''}`}
                               onClick={!isInactive && onHandleSelectCard.bind(this, card)}>
                          {!isInactive &&
                          <input type="radio" name="allocate-method" defaultChecked={outCard.value === value}/>}
                          <div className="item-media">
                            <i className="micon micon-pay-aqk" style={{backgroundImage: `url(${imgUrl})`}}/>
                          </div>
                          <div className="item-inner">
                            <div className="item-title">
                              <div className="name">{title}</div>
                              {desc && <div className="desc">${desc}</div>}
                            </div>
                            {
                              isInactive &&
                              <div className="item-after"><a href="#" className="button button-fill open-btn"
                                                             onClick={isInactive && onHandleOpenMethod.bind(this, value)}>去开通</a>
                              </div>}
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
