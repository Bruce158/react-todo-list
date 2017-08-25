import React, { Component } from 'react';
import './UserDialog.css'
import {signUp,signIn,sendPasswordResetEmail} from './leanCloud'

import ForgotPasswordForm from './ForgotPasswordForm'
import SignInOrSignUp from './SignInOrSignUp'

export default class UserDialog extends Component{
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'signInOrSignUp', // 'forgotPassword'
      formData: {
        email:'',
        username:'',
        password:'',
      }
    }
  }

  checkInput(email, username, password) {
    if (/^[\w\.]+@[\w\.]+$/.test(email) === false) {
      alert('请输入有效的邮箱格式')
      return false
    }

    //检查用户名
    if (username.length < 3 || username.length > 15) {
      alert('用户名长度不符合要求')
      return false 
    }

    if (/\W/.test(username)) {
      alert('用户名含有非法字符')
      return false
    }
    
    //检查密码
    if (password.length < 6) {
      alert('密码长度不符合要求')
      return false
    }

    let cnt = 0
    if (/[0-9]/.test(password)) cnt++;
    if (/[a-zA-Z]/.test(password)) cnt++;
    if (cnt < 2) {
      alert('密码过于简单')
      return false
    }
    
    return true
  }

  signUp(e){
    e.preventDefault()
    let {email, username, password} = this.state.formData

    if (!this.checkInput(email, username, password)) {
      return
    }

    let success = (user)=>{
      this.props.onSignUp.call(null, user)
    }

    let error = (error)=>{
     switch(error.code){
        case 202:
          alert('用户名已被占用')
          break
        case 125:
          alert('无效的邮箱')
          break
        default:
          alert(error)
          break
      }
    }
    signUp(email, username, password, success, error)
  }

  signIn(e) {
    e.preventDefault()
    let {username, password} = this.state.formData
    let success = (user)=>{
      this.props.onSignIn.call(null,user) 
    }

    let error = (error)=>{
      switch(error.code){
        case 210:
          alert('用户名与密码不匹配')
          break
        default:
          alert(error)
          break
      }
    }
    signIn(username,password,success,error)
  }

  changeFormData(key,e) {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.formData[key] = e.target.value
    this.setState(stateCopy)
  }

  showForgotPassword() {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.selectedTab = 'forgotPassword'
    this.setState(stateCopy)
  }

  resetPassword(e){
    e.preventDefault()
    console.log(this.state.formData.email)
    sendPasswordResetEmail(this.state.formData.email,()=>{alert('重置邮件发送成功')},
    ()=>{alert('邮箱不正确')},)
  }
  
  returnToSignIn() {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.selectedTab = 'signInOrSignUp'
    this.setState(stateCopy)
  }

  render(){
    return (
        <div className="UserDialog-Wrapper">
          <div className="UserDialog">
            {this.state.selectedTab === 'signInOrSignUp' ? 
              <SignInOrSignUp
                formData={this.state.formData}
                onSignIn={this.signIn.bind(this)}
                onSignUp={this.signUp.bind(this)}
                onChange={this.changeFormData.bind(this)}
                onForgotPassword={this.showForgotPassword.bind(this)}
              />  : 
              <ForgotPasswordForm
                formData={this.state.formData}
                onSubmit={this.resetPassword.bind(this)}
                onChange={this.changeFormData.bind(this)}
                onSignIn={this.returnToSignIn.bind(this)}
              />}
          </div>
        </div>
      )
  }
  
}