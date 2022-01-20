import React, { Component } from 'react'
import './ScrollButton.css'

class ScrollButton extends Component {
  scrollToTop = () => {
    window.scrollTo(0,0)
  }

  render() {
    return (
      <div>
        <button className="scrollTop" onClick={this.scrollToTop}>Go to top</button>
      </div>
    )
  }
}

export default ScrollButton
