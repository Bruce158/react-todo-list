import React, { Component } from 'react';
import './TodoItem.css'

export default class TodoItem extends Component {
  render() {
    let completed = (this.props.todo.status === 'completed')
    let str = `title ${completed?'completed':''}`
    return (
      <div className="TodoItem">
        <input type='checkbox' id='checkbox' checked={completed}
          onChange={this.toggle.bind(this)}/> 
        <label htmlFor ="checkbox"></label>
        <span className={str} >{this.props.todo.title}</span>
        <span>{this.props.todo.date}</span>
        <i className="del-btn iconfont icon-delete" onClick={this.delete.bind(this)}></i>
      </div>
    )
  }

  toggle(e) {
    this.props.onToggle(e, this.props.todo)
  }

  delete(e){
    this.props.onDelete(e,this.props.todo)
  }
}