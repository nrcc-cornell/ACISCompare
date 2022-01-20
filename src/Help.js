import React, { Component } from 'react'
import "./Help.css"

class Help extends Component {
  render() {
   return (
    <div id="help">
		<p><b>GHCN-Daily Measurement flag (mflag):</b></p>
		<ul>
			<li>Blank = no measurement information applicable</li>
			<li>B     = precipitation total formed from two 12-hour totals</li>
			<li>D     = precipitation total formed from four six-hour totals</li>
			<li>H     = highest or lowest hourly temperature (TMAX or TMIN) or the average of hourly values (TAVG)</li>
			<li>K     = converted from knots </li>
			<li>L     = temperature appears to be lagged with respect to reported hour of observation </li>
			<li>O     = converted from oktas </li>
			<li>P     = identified as "missing presumed zero" in DSI 3200 and 3206</li>
			<li>T     = trace of precipitation, snowfall, or snow depth</li>
			<li>W     = converted from 16-point WBAN code (for wind direction)</li>
		</ul>
		<p><b>GHCN-Daily Quality flag (qflag):</b></p>
		<ul>
			<li>Blank = did not fail any quality assurance check</li>
			<li>D     = failed duplicate check</li>
			<li>G     = failed gap check</li>
			<li>I     = failed internal consistency check</li>
			<li>K     = failed streak/frequent-value check</li>
			<li>L     = failed check on length of multiday period</li> 
			<li>M     = failed megaconsistency check</li>
			<li>N     = failed naught check</li>
			<li>O     = failed climatological outlier check</li>
			<li>R     = failed lagged range check</li>
			<li>S     = failed spatial consistency check</li>
			<li>T     = failed temporal consistency check</li>
			<li>W     = temperature too warm for snow</li>
			<li>X     = failed bounds check</li>
			<li>Z     = flagged as a result of an official Datzilla investigation</li>
		</ul>
		<p><b>GHCN-Daily Source flag (sflag):</b></p>
		<ul>
			<li>Blank = No source (i.e., data value missing)</li>
			<li>0     = U.S. Cooperative Summary of the Day (NCDC DSI-3200)</li>
			<li>6     = CDMP Cooperative Summary of the Day (NCDC DSI-3206)</li>
			<li>7     = U.S. Cooperative Summary of the Day -- Transmitted via WxCoder3</li>
			<li>A     = U.S. Automated Surface Observing System (ASOS) real-time data</li>
			<li>a     = Australian data from the Australian Bureau of Meteorology</li>
			<li>B     = U.S. ASOS data for October 2000-December 2005 (NCDC DSI-3211)</li>
			<li>b     = Belarus update</li>
			<li>C     = Environment Canada</li>
			<li>D     = Short time delay US NWS CF6 daily summaries provided by the HPRCC</li>
			<li>E     = European Climate Assessment and Dataset</li>
			<li>F     = U.S. Fort data </li>
			<li>G     = Official Global Climate Observing System (GCOS) or other govt-supplied data</li>
			<li>H     = High Plains Regional Climate Center real-time data</li>
			<li>I     = International collection (non U.S. data received through personal contacts)</li>
			<li>K     = U.S. Cooperative Summary of the Day data digitized from paper observer forms</li>
			<li>M     = Monthly METAR Extract (additional ASOS data)</li>
			<li>N     = Community Collaborative Rain, Hail,and Snow (CoCoRaHS)</li>
			<li>Q     = Data from several African countries that had been "quarantined"</li>
			<li>R     = NCEI Reference Network Database (CRN and RCRN)</li>
			<li>r     = All-Russian Research Inst of Hydrometeorological Information-World Data Center</li>
			<li>S     = Global Summary of the Day (NCDC DSI-9618)</li>
			<li>s     = China Meteorological Admin/Natl Meteorological Info Center/Climatic Data Center</li>
			<li>T     = SNOwpack TELemtry (SNOTEL) data obtained from the USDA/NRCS</li>
			<li>U     = Remote Automatic Weather Station (RAWS) data obtained from the WRCC</li>
			<li>u     = Ukraine update</li>
			<li>W     = WBAN/ASOS Summary of the Day from NCDC's Integrated Surface Data (ISD)</li>
			<li>X     = U.S. First-Order Summary of the Day (NCDC DSI-3210)</li>
			<li>Z     = Datzilla official additions or replacements </li>
			<li>z     = Uzbekistan update</li>
		</ul>
		<p><b>GHCN-Daily Note:</b></p>
		<ul>
			<li>MDx = Multi-day accumulation over x days</li>
		</ul>
		<p><b>ACIS Source Code:</b></p>
		<ul>
			<li>0 = Unknown</li>
			<li>1 = TD3200</li>
			<li>2 = TD3210</li>
			<li>4 = SHEF</li>
			<li>5 = AWDN</li>
			<li>7 = CLI/CF6</li>
			<li>8 = RCC keyed</li>
			<li>9 = NRCC local</li>
			<li>13 = WRCC local</li>
			<li>14 = SRCC local</li>
			<li>15 = DSM</li>
			<li>16 = TD3206</li>
			<li>17 = GHCN-Daily</li>
			<li>19 = Recent CF6 (overrides GHCN-Daily)</li>
			<li>52 = TD3205</li>
			<li>53 = TD3299</li>
			<li>54 = ThreadEx</li>
			<li>56 = CRB</li>
		</ul>
    </div>
   )
  }
}

export default Help
