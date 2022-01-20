import React, { Component } from 'react'
import { observable } from 'mobx'
import UserInput from './UserInput'
import Results from './Results'
import About from './About'

let userParams = observable({
  sid: "",
  selectedElem: "pcpn",
  syr: (new Date()).getFullYear(),
  eyr: (new Date()).getFullYear(),
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showResults: false, 
      showAbout: true
    }
  }
  
  updateShowResults = (value) => {
    this.setState({showResults: value, showAbout: !value})
  }

  render() {
    return (
      <div style={{padding:"0 1em", fontSize:"75%", fontFamily:"'Open Sans', sans-serif"}}>
        <h3>Climate Data Comparison Tool</h3>
        <UserInput 
          userParams={userParams} 
          updateShowResults={this.updateShowResults} 
        />
        {this.state.showResults && <Results />}
        {this.state.showAbout && <About />}
      </div>
    )
  }
}

export default App
