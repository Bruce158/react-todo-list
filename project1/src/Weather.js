import React, { Component } from 'react';
import './weather.css'
export default class Weather extends Component {
  render() {
    return (
      <div>
        {/* <h3>今日天气</h3> */}
        <span>{'城市：'+this.props.weather.city_name}</span><br/>
        <span>{'天气：'+this.props.weather.text}</span><br/>
        <span>{'温度：'+this.props.weather.temperature}</span><br/>
        <span>{'空气质量：'+this.props.weather.air_quality}</span><br/>
       
      </div>
    )
  }
}
