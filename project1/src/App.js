import React, { Component } from 'react';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import GroupItem from './GroupItem'
import UserDialog from './UserDialog'
import './App.css';
import 'normalize.css'
import './reset.css'
import Weather from './Weather';
import {getCurrentUser,signOut,TodoModel} from './leanCloud'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user:getCurrentUser()||{},
      newTodo:'',
      newGroup:'',
      curGroup:'',
      groups:['未分组',],
      todos:[],
      showCompleted:true,
      weather:{
        city_name:'',
        text:'',
        temperature:'',
        air_quality:'',
        suggestion:''
      }
    }
    this.initData()
  }

  initData() {
    this.getWeather()
    setInterval(()=>{this.getWeather()},1000*60*5)
    this.getUserData()
  }

  getUserData() {
    let user = getCurrentUser()
    if (user) {
      this.state.user = user
      TodoModel.getByUser(user, (todos) => {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.todos = todos

        todos.filter((item)=>(!item.deleted)).map((item)=>{
          if (stateCopy.groups.indexOf(item.group) === -1) {
            stateCopy.groups.unshift(item.group)
          }
          return item
        })

        if (stateCopy.groups.length)
          stateCopy.curGroup = stateCopy.groups[0]

        this.setState(stateCopy)
      })
    }
  }

  render() {
    let todos = this.state.todos.filter((item)=>{
      if (item.deleted) return false
      if (!this.state.showCompleted && item.status === 'completed') return false
      if (item.group !== this.state.curGroup) return false
      return true
      }).map((item,index)=>{
        return (
          <li key={index}> 
            <TodoItem todo={item} onToggle={this.toggle.bind(this)}
              onDelete={this.deleteTodo.bind(this)}/>
          </li>
        )
      })
    
    let groups = this.state.groups.map((item,index)=>{
      return (
        <li key={index} > 
          <GroupItem title={item} seleted={item === this.state.curGroup} onDelete={this.deleteGroup.bind(this)}/>
        </li>
      )
    })
    
    return (
      <div className="App">
        { this.state.user.id ? 
          <div>
            <header>
              <h1>{(this.state.user.username||'我')+'的待办事项'}</h1>
              {this.state.user.id?<i className="tuichu-btn iconfont icon-tuichu" onClick={this.signOut.bind(this)}></i>:null}
            </header>
            <div className="ct">
              <aside className="sidebar">
                <div className="weather">
                  <Weather weather={this.state.weather}/>
                </div>
                {/* <h3>任务分组</h3> */}
                <div className="inputWrapper">
                  <TodoInput content={this.state.newGroup} 
                    onChange={this.changeGroupTitle.bind(this)}
                    onSubmit={this.addGroup.bind(this)}
                    placeholder='请新建分组'/>
                </div>
                <div className="groups-wrap">
                  <ol className="groups"  onClick={this.selectGroup.bind(this)}>
                    {groups}
                  </ol>
                </div>
              </aside>
              <main>
                {/* <div className="wrap"> */}
                  <h3>{this.state.curGroup}</h3>
                  <div className="inputWrapper">
                    <TodoInput content={this.state.newTodo} 
                      onChange={this.changeTodoTitle.bind(this)}
                      onSubmit={this.addTodo.bind(this)}
                      placeholder='请输入待办事项'/>
                  </div>
                  <div className="todos-wrap">
                    <ol className="todos">
                      {todos}
                    </ol>
                  </div>
                  <a className="show-completed-btn" 
                    onClick={this.showCompleted.bind(this)}>{this.state.showCompleted?'隐藏已完成任务':'显示已完成任务'}</a>
                {/* </div>   */}
              </main>
            </div>
          </div>
          :
            <UserDialog 
              onSignUp={this.onSignUpOrSignIn.bind(this)}
              onSignIn={this.onSignUpOrSignIn.bind(this)}/>
        }
      </div>
    )
  }

  signOut() {
    signOut()
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = {}
    this.setState(stateCopy)
  }

  onSignUpOrSignIn(user) {
    this.initData()
  }

  componentDidUpdate(){
  }

  toggle(e, todo) {
    let oldStatus = todo.status
    todo.status = todo.status === 'completed' ? '' : 'completed'
    TodoModel.update(todo, () => {
      this.setState(this.state)
    }, (error) => {
      todo.status = oldStatus
      this.setState(this.state)
    })
  }

  changeTodoTitle(event){
    this.setState({
      newTodo:event.target.value,
      todos:this.state.todos,
    })
  }
  
  addTodo(event) {
    let newTodo = {
      title:event.target.value,
      status:'',
      deleted:false,
      group:this.state.curGroup,
    }

    TodoModel.create(newTodo,(id)=>{ //success
      newTodo.id = id
      this.state.todos.unshift(newTodo)
   
      this.setState({
        newTodo:'',
        todos:this.state.todos,
      })
      // this.addSuccess = 1
    },(error)=>{ //error
      console.log(error)
    })
  }

  deleteTodo(event, todo){
    TodoModel.destroy(todo.id, () => {
      todo.deleted = true
      this.setState(this.state)
    })
  }

  showCompleted() {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.showCompleted = !stateCopy.showCompleted
    this.setState(stateCopy)
  }

  changeGroupTitle(event) { 
    this.setState({
      newGroup:event.target.value,
    })
  }

  deleteGroup(e, group){
    let node = e.target.previousSibling

    if (node.classList.contains('group-title')) { 
      let stateCopy = JSON.parse(JSON.stringify(this.state))
      let index = stateCopy.groups.indexOf(node.innerText)
      stateCopy.groups.splice(index,1)
      stateCopy.todos.map((item)=>{
        if (item.group === node.innerText) {
          TodoModel.destroy(item.id, () => {
            item.deleted = true
          })  
        }
        return item
      })
      stateCopy.curGroup = stateCopy.groups[0]
      this.setState(stateCopy)
    }
  }

  selectGroup(e) {
    if (e.target.classList.contains('group-title')) {
      this.setState({
        curGroup:e.target.innerText,
      })
    }
  }

  addGroup(event) { 
    let len = this.state.groups.length
    let value = event.target.value.trim()

    for (let i=0; i< len; i++) {
      if (this.state.groups[i] === value) {//已存在
        this.setState({
          curGroup:value,
          newGroup:'',
        })
        return
      }
    }

    this.state.groups.unshift(value)
    this.setState({
      groups:this.state.groups,
      curGroup:value,
      newGroup:'',
    })
    // this.addSuccess = 2
  }

  getWeatherSuccess(data) {
    if (data.status === 'OK') {
      console.log(data)
      console.log(data.weather[0].city_name)
      console.log(data.weather[0].now.text)
      console.log(data.weather[0].now.temperature)
      console.log(data.weather[0].now.air_quality.city.quality)
      console.log(data.weather[0].today.suggestion.dressing.details)
      let newWeather = {
        city_name : data.weather[0].city_name,
        text : data.weather[0].now.text,
        temperature : data.weather[0].now.temperature,
        air_quality : data.weather[0].now.air_quality.city.quality,
        suggestion : data.weather[0].today.suggestion.dressing.details,
      }
    
      this.setState({
        weather:newWeather,
      })
    } else {
      console.log('Weather data error')
    }
  }

  getWeather() {
     var xhr = new XMLHttpRequest()
    
      xhr.onload = ()=>{
        if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status === 304) {
          this.getWeatherSuccess(JSON.parse(xhr.responseText))
        } else {
          console.log('getWeather fail')
        }
      }

      xhr.open('get', 'https://weixin.jirengu.com/weather', true)
      xhr.send()
  }
}

export default App;

