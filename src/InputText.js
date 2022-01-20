import React, {Component} from 'react'

export default class InputText extends Component {
  render () {
    const input = this.props
    return (
      <label htmlFor={input.name} style={{color: input.color || "black"}}>{input.label || input.name}
        <input
          id={input.name}
          type="text"
          name={input.name}
          size={input.size}
          value={input.value}
          placeholder={input.placeholder}
          onChange={input.onChange}
        />
      </label>
    )
  }
 }