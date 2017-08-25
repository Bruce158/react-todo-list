import React, {Component} from 'react';
import './ForgotPasswordForm.css';
export default class ForgotPasswordForm extends Component {
  render () {
    return (
      <div className="forgotPassword">
        <h3>
          重置密码
        </h3>
        <form className="forgotPassword" onSubmit={this.props.onSubmit}> {/* 登录*/}
          <div className="row">
            <input type="text" value={this.props.formData.email}
              onChange={this.props.onChange.bind(null, 'email')}
              placeholder="邮箱"/>
          </div>
          <button type="submit">发送重置邮件</button>
          <div>
            <a onClick={this.props.onSignIn}>返回登录</a>
          </div>
        </form>
      </div>
    )
  }
}
