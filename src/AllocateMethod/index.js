import { Component } from 'react'
// import './css/allocate-method.less'
import selectMethod from './selectMethod'

export default class AllocateMethod extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {

  }

  onClickSelectMethod = () => {
    const {props: {allocateList, selectAllocateCallback, allocate}} = this
    selectMethod({
      title: '产品到期后',
      allocateList,
      allocate,
      selectAllocateCallback
    })
  }

  render () {
    const {props: {allocate}, onClickSelectMethod} = this

    return (
      <div className="allocate-method-module">
        <div className="allocate-method">
          <div className="list-block">
            <ul>
              <li>
                <div className="item-content item-link item-link-clearing" onClick={onClickSelectMethod}>
                  <div className="item-inner">
                    <div className="item-title">产品到期后</div>
                    <div className="item-after">{allocate && allocate.selectTitle}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

AllocateMethod.defaultProps = {
  allocateList: []
}
