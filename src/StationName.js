import React, { Component } from 'react'
import { inject, observer } from "mobx-react"

@inject('store') @observer class StationName extends Component {
  render() {
    return (
      <span style={{marginLeft:"6px", fontStyle:"italic"}}>{this.props.store.app.stnName}</span>
    )
  }
}

export default StationName
