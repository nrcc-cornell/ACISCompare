import axios from "axios";

const cdoDatatypes = {
  "maxt": "TMAX", "mint": "TMIN", "pcpn": "PRCP,MDPR,DAPR", "snow": "SNOW,MDSF,DASF", "snwd": "SNWD", "obst": "TOBS"
};

export function formatDate(d, send) {
  if (typeof d === 'string' && d.includes("-")) {
      let ymd = d.split("-")
      if (ymd.length > 3) {
          ymd = ymd.slice(0,3)
      } else if (ymd.length === 2) {
          ymd.push(send.includes("12-31") ? new Date(parseInt(ymd[0], 10), parseInt(ymd[1], 10), 0).getDate() : 1);
      }
      const symd = ymd.map(x => (parseInt(x, 10) < 10 ? "0" : "") + parseInt(x, 10))
      return symd.join('-')
  } else {
      return d + send
  }        
}

const formatAcis = (res) => {
  const newdays = {};
  var acisHas = new Array(13).fill('none');
  for (let i = 0; i < res.data.data.length; i += 1) {
    const results = res.data.data[i];
    newdays[results[0]] = {
      acisValue: results[1][0],
      acisFlag: results[1][1], 
      acisSource: results[1][2],
      acisOtime: results[1][3],
      acisOther: []
    };
    for (let j = 2; j <= 14; j += 1) {
      if (results[j] !== "M") {
        acisHas[j - 2] = 'table-cell';
        newdays[results[0]].acisOther.push(results[j]);
      } else {
        newdays[results[0]].acisOther.push("-");
      }
    }
  }
  return {acisData: newdays, acisHas: acisHas}
}

export function buildAcisParams(userParams) {
  const minors = {
    /* GHCN, CF6, DSM, Shef, TD3210, TD3200, TD3206, NWS, CRB, TD3205, NRCC, AWDN, SRCC */
    "maxt": [2, 13, 9, 4, 14, 1, 10, 16, 18, 15, 8, 6, 11],
    "mint": [2, 13, 9, 4, 14, 1, 10, 16, 18, 15, 8, 6, 11],
    "obst": [3, 99, 99, 4, 99, 1, 2, 99, 99, 99, 99, 99, 11],
    "pcpn": [2, 12, 8, 4, 13, 1, 9, 15, 17, 14, 7, 6, 10],
    "snow": [2, 11, 8, 4, 12, 1, 9, 14, 16, 13, 7, 6, 10],
    "snwd": [2, 10, 7, 4, 11, 1, 8, 13, 99, 12, 6, 99, 9]
  }
  const params = {
    sid: userParams.sid || "USC00304174",
    sdate: formatDate(userParams.syr, "-01-01"),
    edate: formatDate(userParams.eyr, "-12-31"),
    elems: [{
      name: userParams.selectedElem,
      vN: 0,
      interval: "dly",
      duration: "dly",
      add: "f,n,t"
    }],
    meta: ""
  }
  minors[userParams.selectedElem].map(vn => (
    params.elems.push({
      name: userParams.selectedElem,
      vN: vn,
      interval: "dly",
      duration: "dly"
    })
  ))
  return params 
}

export function getAcisData(userParams) {
  return new Promise((resolve, reject) => {
    const acisParams = buildAcisParams(userParams)
    var acisStatus = ""
    axios
      .get("https://data.rcc-acis.org/StnData", { params: {params: acisParams} })
      .then(res => {
        if (res.data.error) {
          acisStatus = "Error - " + res.data.error;
          reject({acisStatus})	
        } else {
          acisStatus = null;
          resolve({...formatAcis(res), ...{acisStatus}})
        }
      })
      .catch(err => {
        console.log("ACIS Request Error: " + (err.response.data || err.response.statusText));
        acisStatus = err;
        reject({acisStatus})
      });
  })
}

export function formatCdo(results, userParams) {
  const elem = cdoDatatypes[userParams.selectedElem].slice(0,4),
      elemattr = elem + "_ATTRIBUTES",
      missrec = {[elem]: "-", [elem+"_ATTRIBUTES"]: ",,,"},
//      lastDay = new Date(userParams.eyr, 11, 31);
      lastDay = new Date(formatDate(userParams.eyr,"-12-31") + " 00:00")
//    var expectcrnt = new Date(results[0]["DATE"].substr(0,4), 0, 1),
    var expectcrnt = new Date(results[0]["DATE"] + "00:00"),
      newdays = {},
    cdoNotes = 'none',
    addDay = (date, data) => {
      var value=null, attrs=[], cdoNote=null;
      date = date.substr(0, 10);
      if (data.hasOwnProperty(elem)) {
        value = data[elem];
        attrs = data[elemattr].split(",");
        cdoNote = "";
      } else if (data.hasOwnProperty("MDPR") || data.hasOwnProperty("MDSF")) {
        const mdelem = data.hasOwnProperty("MDPR") ? "MDPR" : "MDSF";
        const daelem = data.hasOwnProperty("MDPR") ? "DAPR" : "DASF";
        const mdelemattr = mdelem + "_ATTRIBUTES";
        value = data[mdelem];
        attrs = data[mdelemattr].split(",");
        cdoNote = "MD" + (data.hasOwnProperty(daelem) ? data[daelem] : "?");
        if (data.hasOwnProperty(daelem)) {
          cdoNotes = 'table-cell';
        }
      // added following block 2019-8-13
      } else {
        value = "-"
        attrs = ",,,"
        cdoNote = ""
      }
      if (value) {
        newdays[date] = {
          cdoValue: value, 
          cdoMflag: attrs[0], 
          cdoQflag: attrs[1], 
          cdoSflag: attrs[2], 
          cdoOtime: attrs.length === 4 ? attrs[3] : "-",
          cdoNote: cdoNote
        };
      }
      expectcrnt.setDate(expectcrnt.getDate() + 1);
    };
  for (let i = 0; i < results.length; i += 1) {
    const rec = results[i];
    const ymd = rec["DATE"].substr(0,10).split("-");
    const crntday = new Date(ymd[0], ymd[1] - 1, ymd[2]);
//			if (crntday.getMonth() === 0 && crntday.getDate() === 1) {
//				store.cdoStatus = "... Processing " + ymd[0];
//			}
    while (expectcrnt < crntday) {
      addDay(expectcrnt.toISOString(), missrec);
    } 
    addDay(rec["DATE"], rec);
  }
  while (expectcrnt <= lastDay) {
    addDay(expectcrnt.toISOString(), missrec);
  }
  return {cdoData: newdays, cdoNotes: cdoNotes}
}

export function buildCdoUrl(userParams) {
    let cdourl = "https://www.ncei.noaa.gov/access/services/data/v1?dataset=daily-summaries";
    const data_specs = {
      units: "standard",
      stations: (userParams.sid.toUpperCase() || "USC00304174"),
      startDate: formatDate(userParams.syr, "-01-01"),
      endDate: formatDate(userParams.eyr, "-12-31"),
      dataTypes: cdoDatatypes[userParams.selectedElem],
      includeAttributes: true,
      format: "json"
    };
    for (let i in data_specs) {
      if (data_specs.hasOwnProperty(i)) {
        cdourl += "&" + i + "=" + data_specs[i]
      }
    }
    return cdourl
}

export function getCdoData(userParams) {
  return new Promise((resolve, reject) => {
    const cdoUrl = buildCdoUrl(userParams)
    var cdoStatus = ""
    axios
      .get(cdoUrl)
      .then(res => {
        if (res.data.length > 0) {
          cdoStatus = "Results"
          resolve({...formatCdo(res.data, userParams), ...{cdoStatus}})
        } else {
          cdoStatus = "- no data available";
          reject({cdoStatus})
        }
      })
      .catch(err => {
        console.log("CDO Request Error: " + err.errorMessage);
        cdoStatus = "* Error *";
        reject({cdoStatus})
      });
    })
}


export function getStnMetaData(userParams, elemInfo, disableElems) {
    return new Promise((resolve, reject) => {
        let stnName = ""
        if (userParams.sid.length === 11) {
            const cparams = {
                sids: userParams.sid,
                elems: Object.keys(elemInfo).join(),
                meta: "name,state,valid_daterange",
            };	
            axios
                .get("https://data.rcc-acis.org/StnMeta", { params: cparams })
                .then(res => {
                    const meta = res.data.meta;
                    let disabledElems = [];
                    Object.keys(elemInfo).forEach ((elem, cnt) => {
                        if (meta[0].valid_daterange[cnt].length) {
                            if (elem === userParams.selectedElem) {
                                const vdr = meta[0].valid_daterange[cnt][0].substr(0,4) + " - " + meta[0].valid_daterange[cnt][1].substr(0,4);
                                stnName = meta.length > 0 ? meta[0].name + ", " + meta[0].state + ' ' + vdr : "Unknown GHCN id";
                            }
                        } else {
                            disabledElems.push(elem);
                        }
                    });
                    disableElems(disabledElems);
                    resolve(stnName);
                })
                .catch(err => {
                    reject(err);
                });
        } else {
            resolve("");
        }
    });
}


//	getCdoAnother = () => {
//		this.props.userParams.cdoProcessYear += 1;
//		if (this.props.userParams.cdoProcessYear <= parseInt(this.props.userParams.eyr, 10)) {
//			this.getCdoData();
//		} else if (this.inprogress <= 0 && this.props.store.app.cdoStatus.indexOf("rror") === -1) {
//			this.props.store.app.cdoStatus = null;
//		}
 // }
