import React, { Component } from 'react'
import MapboxGLMap from './MapboxGLMap.js'

const elemInfo = {maxt: 'Max temp', mint: 'Min temp', pcpn: 'Precip', snow: 'Snow', snwd: 'Snow depth', obst: 'Obs temp', wind: 'Wind'}

export default class SrchResults extends Component {
  
	componentDidUpdate = (prevProps) => {
		if (prevProps === this.props) {
			return false
		}
  }
  
  render() {
    return (
      <div>
        <div style={{textAlign:"center"}}>
          <span style={{fontWeight:"bold"}}>{this.props.srchProgress}</span>
          <span style={{fontWeight:"bold"}}>{this.props.srchError}</span>
        </div>
        {this.props.stationList.length === 1 &&
          <div style={{textAlign:"center"}}>
            <span style={{fontWeight:"bold"}}>Matches:</span>
            <p style={{marginTop:"3px"}}>{this.props.stationList[0].name}</p>
            <p><button onClick={() => this.props.updateStation(this.props.stationList[0])}>Use this station</button></p>
          </div>
        }
        {(this.props.stationList.length > 1 || this.props.requestBbox) &&
          <div>
            {this.props.stationList.length > 0 &&
              <div style={{textAlign:"center"}}>
                <span style={{fontWeight:"bold"}}>Nearby stations reporting {elemInfo[this.props.selectedElem]}:</span><br/>
                <select style={{"marginBottom":"1em"}} onChange={event => this.props.updateStation(this.props.stationList[event.target.value])}>
                  <option key="0">Select here or click station on map ...</option>
                  {this.props.stationList.map((sta, index) => (
                    <option key={index} value={index}>{sta.name}</option>
                  ))}
                </select>
              </div>
            }

            <MapboxGLMap
              markers={this.props.stationList}
              requestBbox={this.props.requestBbox}
              onClick={this.props.updateStation}
              progress={this.props.srchProgress}
              mapsize={450}
            />
          </div>
        }
      </div>
    )
  }
}

/* removed

import MapGLMap from './MapGLMap.js'

            <MapGLMap
              markers={this.props.stationList}
              requestBbox={this.props.requestBbox}
              onClick={this.props.updateStation}
              mapsize={450}
            />

*/
