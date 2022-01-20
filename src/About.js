import React, { Component } from 'react'
import "./About.css"
import searchIcon from "./icon-search.svg"

class About extends Component {
  render() {
   return (
    <div id="about">
    <p>The ACIS Climate Data Comparison Tool was developed to allow users to compare data contained in the National Centers for Environmental Information's GHCN-Daily database to the corresponding data in the Regional Climate Centers' ACIS database. </p>
    <p>Stations are identified by their 11-character GHCN id. Click <img src={searchIcon} alt="help" height="12" /> above to get assistance finding a station's GHCN id or visit <a href="https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/ghcnd-stations.txt" target="_blank">https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/ghcnd-stations.txt</a> to view a complete list of stations. When a valid id is entered, the station name and period of record for the selected variable will appear next to the station number entry box. A station's entire period of record can be obtained using this tool. However, for best browser performance it is recommended that shorter periods (around 10 years or less) are requested at a time. Progress on a request is displayed in the first line of the output column headers.</p>
    <p>This tool uses the NCEI's Access Data Service to obtain the data from GHCN-Daily. ACIS Web Services are used to obtain data from the ACIS datasets. </p>
    <p>The ACIS database consists of a number of source datasets. The highest priority value, which is what is used in ACIS products, is displayed in the columns under ACIS Results. Data values from all ACIS data sources are displayed under ACIS All. Values that differ  between the primary and other data sources are displayed in red.</p>
    <p>Although values from GHCN-Daily and ACIS should be similar, there are some differences. When these differences occur, they are displayed in a red font in the table. The main reasons for differences include:</p>
    <ul>
    <li>GHCN-Daily retains values that failed quality control along with a flag that indicates the reason for failure. ACIS displays these as missing values,</li>
    <li>ACIS does not include GHCN-Daily's HPRCC real-time data source (H). These values should be available in the ACIS database as part of the SHEF source, and</li>
    <li>ACIS uses CF6 data in preference to GHCN-Daily for the most recent 90 days.</li>
    </ul>
    <p>When requesting precipitation or snowfall data, the appropriate GHCN-Daily elements for multi-day events are also queried. For instance, for precipitation, the GHCN-Daily elements PRCP, MDPR, and DAPR are all queried. The multi-day event total is displayed in the Value column and a comment identifying it as a multi-day event, along with the number of days in the event, is entered in the Notes column.</p>
    </div>
   )
  }
}

export default About
