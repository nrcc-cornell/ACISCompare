import React, {Component} from 'react'

export default class InputRadio extends Component {
  render () {
    const input = this.props;
    let getStyle = (elem) => {
      return {color: input.disabled.indexOf(elem) < 0 ? "black" : "lightgray"};
    }
    
    return (
      <div>
        {Object.keys(input.values).map(elem => (
          <label key={elem} style={getStyle(elem)}>
            <input
              type="radio"
              name={input.name}
              value={elem}
              disabled={input.disabled.indexOf(elem) >= 0}
              checked={input.selected === elem} 
              onChange={input.onChange}
            />
          {input.values[elem]}
          </label>
        ))}      
    </div>
    )
  }
 }