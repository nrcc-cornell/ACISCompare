import axios from 'axios'

const defaultRadius = 30.0  //miles
const defaultIdPriority = [6, 1, 2, 3, 5, 7, 4, 17, 19, 26, 31, 27, 13, 22, 28, 11, 10, 14]
	
const sortByDistance = (a, b) => {
	const x = a.distance, y = b.distance;
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

const geoDistance = (pt1, pt2) => {
	const lat1 = pt1.lat, lng1 = pt1.lng, lat2 = pt2.lat, lng2 = pt2.lng;
	if ((lat1 === lat2) && (lng1 === lng2)) {
		return 0;
	} else {
		const radlat1 = Math.PI * lat1/180;
		const radlat2 = Math.PI * lat2/180;
		const theta = lng1-lng2;
		const radtheta = Math.PI * theta/180;
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist;
	}
}

const selectId = (sids, priority) => {
	var bestPriority = 999, bestId = null;
	sids.forEach(function(id) {
		let split_id = id.split(" ");
		let network = parseInt(split_id[1], 10);
		let priority_index = priority.findIndex(function(p) {
			return p === network
		});
		if (priority_index >= 0 && priority_index < bestPriority) {
			bestPriority = priority_index;
			bestId = id;
		}
	})
	return bestId;
}

const getInfoFromMeta = (metaResults, idPriority, srchCenter) => {
	const whichVdr = metaResults.hasOwnProperty("valid_daterange") ? metaResults.valid_daterange.findIndex(m => { return m.length > 0 }) : -1;
	if (whichVdr >= 0) {
		const sid = selectId(metaResults.sids, idPriority);
		if (sid) {
			return {
				id: sid,
				whichVdr: whichVdr,
				name: metaResults.name + ', ' + metaResults.state,
				distance: srchCenter ? geoDistance(srchCenter, {lat: metaResults.ll[1], lng: metaResults.ll[0]}) : null,
				position: [metaResults.ll[1], metaResults.ll[0]],
				vdr: metaResults.valid_daterange[whichVdr],
				tooltip: metaResults.name + "<br/>" + metaResults.valid_daterange[whichVdr][0] + " to " + metaResults.valid_daterange[whichVdr][1],
			};
		};
	}
	return null;
}

export function processMetaResults(res, idPriority=defaultIdPriority, srchCenter=null) {
	let nearbyStns = [];
	for (let j = 0; j < res.data.meta.length; j += 1) {
		const metaObj = getInfoFromMeta(res.data.meta[j], idPriority, srchCenter);
		if (metaObj) {
			nearbyStns.push(metaObj);
		}
	}
	nearbyStns.sort(sortByDistance);
	return nearbyStns;
}

const determineBbox = (srchCenter, srchRadius) => {
	const lat = srchCenter.lat;
	const lon = srchCenter.lng;
	const lat_offset = srchRadius / 69.047;
	const lon_offset = srchRadius / (69.17 * Math.cos(lat * 0.01745));
	const requestBbox = [lon - lon_offset, lat - lat_offset, lon + lon_offset, lat + lat_offset];
	return requestBbox
  }
  
  export function doLocationSearch(srchName, srchRadius=defaultRadius) {
	return new Promise((resolve, reject) => {
		const url = "https://www.mapquestapi.com/geocoding/v1/address?location=" + srchName + 
				"&inFormat=kvp&outFormat=json&thumbMaps=false&key=vmdb56NGYcTBa45baRjZtjxrTY8GWHKi"
		axios
			.get(url, {responseType: "json"})
			.then(data => {
				const res = data.data
				if (res.info.statuscode !== "0") {
					const srchCenter = res.results[0].locations[0].latLng;
					const requestBbox = determineBbox(srchCenter, srchRadius);
					resolve({requestBbox, srchCenter});
				} else {
					reject(res.info.statuscode);
				}
			})
			.catch(error => {
				reject(error.message)
			})
	})
}

export function getMetaData(addParam, idPriority=defaultIdPriority, srchCenter=null) {
	return new Promise((resolve, reject) => {
		const cparams = {
			meta: "name,state,sids,valid_daterange,ll",
			...addParam
		};
		var results = {srchError: "", srchProgress: "", stationList: []};
		axios
			.get("https://data.rcc-acis.org/StnMeta", { params: {params: cparams }})
			.then(res => {
				const stationList = processMetaResults(res, idPriority, srchCenter);
				if (stationList.length) {
					results.stationList = stationList;
					resolve(results);
				} else {
					results.srchError = "No matches";
					resolve(results);
				}
			})
			.catch(err => {
				console.log("ACIS Request Error: " + err);
				reject("Meta search error");
			});
	});
}