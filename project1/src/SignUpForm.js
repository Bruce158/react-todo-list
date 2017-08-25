import './SignInOrSignUp.css';
import React from 'react';
export default function (props) {
  return (
    <form className="signUp" onSubmit={props.onSubmit.bind(this)}>
      <div className="row">
        <input type="text" value={props.formData.email}
          onChange={props.onChange.bind(null, 'email')}
          placeholder="邮箱"/>
      </div>
      <div className="row">
        <input type="text" value={props.formData.username }
          onChange={props.onChange.bind(null, 'username')}
          placeholder="用户名"/>
        {/* bind 不仅可以绑定 this，还可以绑定第一个参数 */}
      </div>
      <div className="row">
        <input type="password" value={props.formData.password}
          onChange={props.onChange.bind(null, 'password')}
          placeholder="密码"/>
      </div>
      <button type="submit">注册</button>
    </form>
  )
}
