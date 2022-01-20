import React, { Component } from 'react'
import InputText from './InputText'
import SrchResults from './SrchResults'
import { doLocationSearch, getMetaData } from './SearchRoutines'

const fieldInputs = {
	anyId: {label: 'Station id:', placeholder: "coop, wban, etc."},
	srchName: {label: 'Location:', placeholder: "City,state or zip code"}
}
let requestBbox = null
const srchRadius = 30.0 //miles
const idPriority = [6]

export default class StationSearch extends Component {
	constructor(props) {
		super(props)
		this.state = {
			srchProgress: "",
			srchError: "",
			stationList: [],
			anyId: "",
			srchName: "",
		}
	}
	
	onChange = (event) => {
		if (event.target.name === "anyId") {
			this.setState({anyId:event.target.value, srchName:"", srchError: "", srchProgress: "", stationList: []});
		} else {
			this.setState({srchName:event.target.value, anyId:"", srchError: "", srchProgress: "", stationList: []});
		}
	}

	onSearch = () => {
		this.setState({stationList: []});
		if (this.state.anyId.length > 0) {
			requestBbox = null
			this.setState({srchProgress: "Searching for station..."});
			getMetaData({sids: this.state.anyId, elems: this.props.selectedElem})
				.then(results => {
					this.setState(results);
				})
				.catch(error => {
					this.setState({srchError: error, srchProgress: ""});
				});
		} else if (this.state.srchName.length > 0) {
			this.setState({srchProgress: "Searching for location..."});
			doLocationSearch(this.state.srchName, srchRadius)
				.then(data => {
					requestBbox = data.requestBbox
					this.setState({srchProgress: "Searching for stations..."});
					getMetaData({bbox: requestBbox, elems: this.props.selectedElem}, idPriority, data.srchCenter)
						.then(results => {
							this.setState(results);
						})
						.catch(error => {
							this.setState({srchError: error, srchProgress: ""});
						})
				})
				.catch(error => {
					this.setState({srchError: 'Search error: '+error, srchProgress: ""});
				});
		} else {
			alert("Must specify an ID or location");
		}
	}
	
	componentDidUpdate = (prevProps) => {
		if (prevProps === this.props) {
			return false
		} else if (prevProps.selectedElem !== this.props.selectedElem) {
			this.setState({stationList: []})
		}
	}

	render() {
		return (
			<div>
				{this.props.showSearch &&
				<div style={{border:'1pt solid gray', display:'inline-block', padding:'6px', margin:'1em 0 0.75em 0', background:'#f1f1f1'}}>
					<div style={{display:'inline-block'}}>
						<p style={{fontWeight:'bold', marginTop:'0'}}>Search by:</p>
						<InputText
							name="anyId"
							size="15"
							value={this.state.anyId} 
							placeholder={fieldInputs.anyId.placeholder} 
							label={fieldInputs.anyId.label} 
							onChange={this.onChange} 
						/>
						<p style={{margin:'0 6px'}}>- or -</p>		
						<InputText 
							name="srchName" 
							size="20" 
							value={this.state.srchName} 
							placeholder={fieldInputs.srchName.placeholder} 
							label={fieldInputs.srchName.label} 
							onChange={this.onChange} 
						/>
						<br />
						{this.state.srchName &&
							<p style={{fontStyle:"italic", marginBottom:"0.3em"}}>
								To filter stations by variable, select a Variable below.
							</p>
						}
						<button id="ssgo" onClick={this.onSearch} style={{marginTop:'1em'}}>
							Search
						</button>
					</div>
					<div style={{display:'inline-block', verticalAlign:'top', marginLeft:'2em'}}>
						<SrchResults 
							requestBbox={requestBbox}
							srchProgress={this.state.srchProgress}
							srchError={this.state.srchError}
							stationList={this.state.stationList} 
							selectedElem={this.props.selectedElem} 
							updateStation={this.props.updateStation}
						/>
					</div>
				</div>
				}
	  		</div>
		)
	}
}
