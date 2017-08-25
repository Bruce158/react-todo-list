import React, { Component } from 'react';
import './GroupItem.css'
export default class GroupItem extends Component {
  render() {
    let button = null
    if (this.props.title !== '未分组')
      button = <i className="del-btn iconfont icon-delete" onClick={this.props.onDelete}></i>
      
    return (
      <div className={'GroupItem ' + (this.props.seleted?'selected':'')}>
        <span className={'group-title'}>{this.props.title}</span>
        {button}
      </div>
    )
  }
}