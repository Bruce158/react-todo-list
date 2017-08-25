import './SignInOrSignUp.css';
import React from 'react';
export default function (props) {
  return (
    <form className="signIn" onSubmit={props.onSubmit}> {/* 登录*/}
      <div className="row">
        <input type="text" value={props.formData.username}
          onChange={props.onChange.bind(null, 'username')}
          placeholder="用户名"/>
      </div>
      <div className="row">
        <input type="password" value={props.formData.password}
          onChange={props.onChange.bind(null, 'password')}
          placeholder="密码"/>
      </div>
      <button type="submit">登录</button>
      <div> 
      <a className="forgot-link" onClick={props.onForgotPassword}>忘记密码了？</a>
      </div>
    </form>
  )
}