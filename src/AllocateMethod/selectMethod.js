import { Component } from 'react'

module.exports = ({title, allocateList, allocateMethod, allocate, selectAllocateCallback}) => {
  const $$pageContent = $$(`<div class="page" data-page="select-allocated-method" data-title="${title}"></div>`)

  ReactDOM.render(<SelectPayMethod allocateList={allocateList}
                                   selectAllocateCallback={selectAllocateCallback}
                                   allocate={allocate}/>, $$pageContent[0])
  mainView.router.load({content: $$pageContent})

}

class SelectPayMethod extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {

  }

  onHandleSelectCard = (allocate) => {
    const {props: {selectAllocateCallback}} = this

    selectAllocateCallback(allocate)
    setTimeout(() => {
      mainView.back()
    }, 200)
  }

  render () {
    const {props: {allocateList, allocate: allocateMethod}, onHandleSelectCard} = this

    return (
      <div className="select-allocate-method-module" ref="allocateModuleRef">
        <div className="list-select-clearing-title">选择本息发放方式</div>
        <div className="list-block list-select-clearing">
          <div className="title">发放至</div>
          <ul>
            {
              allocateList && allocateList.map((allocate) => {
                const {title, desc, value} = allocate
                const defaultAllocateValue = allocateMethod && allocateMethod.value

                return (
                  <li>
                    <label className="label-radio item-content" onClick={onHandleSelectCard.bind(this, allocate)}>
                      <input type="radio" value={value} name="allocate-method"
                             defaultChecked={value === defaultAllocateValue}/>
                      <div className="item-inner">
                        <div className="item-title">
                          <div className="tit">{title}</div>
                          <div className="desc">{desc}</div>
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
    )
  }
}
