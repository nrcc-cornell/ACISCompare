import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import "./UserInput.css"
import InputRadio from "./InputRadio"
import InputText from "./InputText"
import StationName from "./StationName"
import StationSearch from "./StationSearch"
import infoIcon from "./icon-info.svg"
import searchIcon from "./icon-search.svg"
import { getStnMetaData, getAcisData, getCdoData, formatDate} from "./DataAccessRoutines"

const fieldInputs = {
	sidInfo: {label: 'Station GHCN id (e.g. USC00304174):', placeholder: 'click ? for help'},
	yearInfo: {syr: 'Starting date:', eyr: 'Ending date:'},
	elemInfo: {maxt: 'Max temp', mint: 'Min temp', pcpn: 'Precip', snow: 'Snow', snwd: 'Snow depth', obst: 'Obs temp'}
}

@inject('store') @observer class UserInput extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showSearch: false,
			showDateInfo: false,
			showDateError: false,
			disabledElems: []
		} 
	}

	dateCheck = () => {
		const sdate = formatDate(this.props.userParams.syr, "-01-01")
		const edate = formatDate(this.props.userParams.eyr, "-12-31")
		const dates = [sdate, edate]
		let isValidDate = true
		dates.forEach(function(dt) {
			try {
				const ymd = dt.split("-")
				const yyyy = parseInt(ymd[0], 10)
				const mm = parseInt(ymd[1], 10)
				const dd = parseInt(ymd[2], 10)
				const date = new Date(yyyy, (+mm-1), dd)
				isValidDate = isValidDate && (Boolean(+date) && date.getDate() === dd)
			} catch(err) {
				isValidDate = false
			}
		})
		return isValidDate && sdate <= edate
	}

	onChange = (event) => {
		if (event) {
			this.props.userParams[event.target.name] = event.target.value;
		}
	}

	onDateChange = (event) => {
		this.onChange(event);
		if (this.state.showDateError && this.dateCheck()) {
			this.setState({showDateError: false})
		}
	}
	
	onSidChange = (event) => {
		this.onChange(event);
		if (!event || event.target.name !== 'selectedElem') {
			this.hideStationSearch();
		}
		this.props.updateShowResults(false);
		getStnMetaData(this.props.userParams, fieldInputs.elemInfo, this.disableElems)
		.then(res => {
			this.props.store.app.stnName = res
		})
		.catch(err => {
			console.log("getStnMetaData Error: " + err);
			this.props.store.app.stnName = "";
		});
	}

	updateStation = (station) => {
		this.props.userParams.sid = station.id.split(" ")[0];
		const vdr = "vdr" in station ? station.vdr[0].substr(0,4) + " - " + station.vdr[1].substr(0,4) : "";
		this.props.store.app.stnName = station.name + ' ' + vdr;
		this.onSidChange();		
	}

	showStationSearch = () => {
		this.setState({ showSearch: true, disabledElems: [] });
		fieldInputs.sidInfo.placeholder = '';
	}
	
	hideStationSearch = () => {
		this.setState({ showSearch: false });
	}

	disableElems = (disabledElems) => {
		this.setState({disabledElems});
	}

	toggleDateInfo = () => {
		this.setState(prevState => ({
			showDateInfo: !prevState.showDateInfo
		}));
	}

	resetStore = () => {
		this.props.store.app.cdoData = {};
		this.props.store.app.cdoNotes = 'none';
		this.props.store.app.cdoStatus = "... Obtaining data";
		this.props.store.app.acisStatus = "... Processing";
		this.props.store.app.acisData = {};
		this.props.store.app.acisHas = this.props.store.app.acisHas.map(() => 'none');
	}

	getData = (e) => {
		e.preventDefault();
		this.hideStationSearch();
		this.resetStore();
		if (this.dateCheck()) {
			this.setState({showDateError: false});
			this.props.updateShowResults(true);
			getAcisData(this.props.userParams)
				.then(ares => {
					this.props.store.app.acisStatus = ares.acisStatus
					this.props.store.app.acisData = ares.acisData
					this.props.store.app.acisHas = ares.acisHas
				})
				.catch(aerr => {
					this.props.store.app.acisStatus = aerr.acisStatus
				})
			getCdoData(this.props.userParams)
				.then(cres => {
					this.props.store.app.cdoStatus = cres.cdoStatus
					this.props.store.app.cdoNotes = cres.cdoNotes
					this.props.store.app.cdoData = cres.cdoData
				})
				.catch(cerr => {
					this.props.store.app.cdoStatus = cerr.cdoStatus
				})
		} else {
			this.setState({showDateError: true, showDateInfo: false});
			this.props.updateShowResults(false);
		}
	}

	resetInput = (e) => {
		this.resetStore();
		this.hideStationSearch();
		this.props.updateShowResults(false);
		this.props.userParams.sid = "";
		this.props.userParams.syr = (new Date()).getFullYear();
		this.props.userParams.eyr = (new Date()).getFullYear();
		this.props.userParams.selectedElem = "pcpn";
		this.props.store.app.stnName = "";
		this.setState({disabledElems: [], showDateInfo: false, showDateError: false})
	}

	render() {
		return (
			<div>
				<InputText name="sid" size="13" value={this.props.userParams.sid} placeholder={fieldInputs.sidInfo.placeholder} label={fieldInputs.sidInfo.label} onChange={this.onSidChange} />
				<img
					src={searchIcon}
					alt="Click for station search"
					title="Click for station search"
					style={{marginLeft:'0.5em', verticalAlign:"middle"}} 
					onClick={this.showStationSearch}
				/>
				<StationName /><br />

				<StationSearch 
					selectedElem={this.props.userParams.selectedElem} 
					showSearch={this.state.showSearch} 
					updateStation={this.updateStation}
				/>
				
				<div className="yearInput">
					{Object.keys(fieldInputs.yearInfo).map(ky => (
						<InputText key={ky} name={ky} size="11" value={this.props.userParams[ky]} color={this.state.showDateError ? "red" : "black"} label={fieldInputs.yearInfo[ky]} onChange={this.onDateChange} />
					))}
					<img
						src={infoIcon}
						alt="Click for date format info" 
						title="Click for date format info"
						style={{verticalAlign:"middle", marginLeft:"-0.5em"}} 
						onClick={this.toggleDateInfo}
					/>
					{this.state.showDateInfo &&
						<span style={{marginLeft:"0.5em",fontStyle:"italic"}}>Dates can be either a 4-digit year or a date in the form yyyy-mm-dd or yyyy-mm.</span>
					}
					{this.state.showDateError &&
						<span style={{marginLeft:"0.5em",fontStyle:"italic",color:"red"}}>Invalid dates.</span>
					}
				</div>

				<fieldset className="varboxes">
					<legend>Variable:</legend>
					<InputRadio name="selectedElem" values={fieldInputs.elemInfo} disabled={this.state.disabledElems} selected={this.props.userParams.selectedElem} onChange={this.onSidChange} />
				</fieldset>

				<br />
				<button className="inputButtons" onClick={this.getData}>Go</button>
				<button className="inputButtons" onClick={this.resetInput}>Reset</button>

			</div>
		)
	}
}

export default UserInput
