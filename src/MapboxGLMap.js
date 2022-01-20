import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'
import ReactMapboxGl, { ZoomControl, Layer, Feature, Popup } from 'react-mapbox-gl'
import { circle } from "./Circle_icon"
import { loader } from "./Loader_icon"

const mapinfo = {
  token: "pk.eyJ1Ijoia2xlMSIsImEiOiJjank0b2dmd2swMm02M2NvMGNnY3c4aWNnIn0.GfryAbDLVsqX9Ir24eWlGQ",
  mapstyle: "mapbox://styles/mapbox/streets-v11",
}
const Map = ReactMapboxGl({
  accessToken: mapinfo.token
})

const markerImage = new Image();
markerImage.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(circle);
const markerImages = ['circleIcon', markerImage];
const markerLayout = { 
  "icon-image": "circleIcon", 
  "icon-size": 1,
  "icon-padding": 1,
  "icon-allow-overlap": true, 
}
const loaderImage = new Image();
loaderImage.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(loader);
const loaderImages = ['loaderIcon', loaderImage]
const loaderLayout = {
//  "icon-image": "loaderIcon", //removed because icon isn't animated
  "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
  "text-size": 24,
  "text-offset": [0, 0],  //if icon-image is added, change to [0, 2.5]
  //"text-field" will be added when rendered
}
const rectanglePaint = {
  "fill-color": "rgba(255,255,255, 0.0)", 
  "fill-outline-color": "blue", 
  "fill-opacity": 0.5
}

export default class MapboxMap2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bounds: null,
      center: [null, null],
      searchRec: null,
      popupInfo: null,
      entriesSupport: true,
    } 
  }

  setup = () => {
    const bbox = this.props.requestBbox
    const centerlon = (bbox[0] + bbox[2])/2.0
    const centerlat = (bbox[1] + bbox[3])/2.0
    const center = [centerlon, centerlat]
    const bounds = [
      [bbox[0], bbox[1]], 
      [bbox[2], bbox[3]]
    ]
    const searchRec = [[
      [bbox[0], bbox[1]], 
      [bbox[2], bbox[1]], 
      [bbox[2], bbox[3]], 
      [bbox[0], bbox[3]],
      [bbox[0], bbox[1]], 
    ]]
    this.setState({center, bounds, searchRec})
  }

  componentWillMount = () => {
    this.setup()
    // IE does not support Object.entries, which causes app to crash when plotting staions on map
    this.setState({entriesSupport: !Object.entries ? false : true})
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.requestBbox !== this.props.requestBbox) {
      this.setup()
    }
  }

  onMouseEnter = (event, m) => {
    this.setState({popupInfo: m})
    const map = event.map
    map.getCanvas().style.cursor = 'pointer'
  }
  
  onMouseLeave = (event) => {
    this.setState({popupInfo: null})
    const map = event.map
    map.getCanvas().style.cursor = null  
  }

  render() {
    return (
      <div>
        {this.state.entriesSupport &&
          <Map 
            style={mapinfo.mapstyle}
            fitBounds={this.state.bounds}
            center={this.state.center}
            containerStyle={{
              height:this.props.mapsize,
              width:this.props.mapsize,
              border:"1pt solid gray"
            }}
          >
            
            <ZoomControl
              position="top-left"
              />

            {this.state.searchRec && 
              <Layer 
                type="fill" 
                paint={rectanglePaint}
                >
                <Feature 
                  coordinates={this.state.searchRec} 
                />
              </Layer>
            }

            {this.props.progress && 
              <Layer
                type="symbol"
                layout={{...loaderLayout, ...{"text-field": this.props.progress}}}
                images={loaderImages}
                >
                <Feature 
                  coordinates={this.state.center} 
                />
              </Layer>
            }
            
            {this.props.markers && 
              <Layer 
                type="symbol" 
                layout={markerLayout} 
                images={markerImages}
                >
                {this.props.markers.map((m, i) => (
                  <Feature
                    key={i} 
                    coordinates={[m.position[1], m.position[0]]} 
                    onClick={() => this.props.onClick(m)}
                    onMouseEnter={(event) => this.onMouseEnter(event, m)}
                    onMouseLeave={(event) => this.onMouseLeave(event)}
                    />
                ))}
              </Layer>
            }

            {this.state.popupInfo && 
              <Popup 
                key={this.state.popupInfo.id}
                coordinates={[this.state.popupInfo.position[1], this.state.popupInfo.position[0]]}
                onClick={() => this.props.onClick(this.state.popInfo)}
              >
                <div style={{fontSize:"110%", textAlign:"center"}}>
                  {ReactHtmlParser(this.state.popupInfo.tooltip)}
                </div>
              </Popup>
            }
          </Map>
        }
        {!this.state.entriesSupport &&
          <p>This browser does not support map display of search results.</p>
        }
      </div>
    )
  }
}