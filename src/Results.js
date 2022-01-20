import React, { Component } from 'react'
import { observer, inject } from "mobx-react"
import styles from './Results.css'
import Help from "./Help"
import ScrollButton from "./ScrollButton"
import loader from "./icon-loader.gif"

@inject('store') @observer class Results extends Component{
  render() {
    function buildDataRows (app) {
      const datekeys = Object.keys(app.acisData).length > 1 ? Object.keys(app.acisData) : Object.keys(app.cdoData);
      return datekeys ? datekeys.sort().map(ky => {
          const diff = app.cdoData.hasOwnProperty(ky) && app.acisData.hasOwnProperty(ky) && 
          ((parseFloat(app.cdoData[ky].cdoValue) !== parseFloat(app.acisData[ky].acisValue) && !(app.cdoData[ky].cdoValue === "-" && app.acisData[ky].acisValue === "M")) || 
           (parseFloat(app.cdoData[ky].cdoValue) === 0 && parseFloat(app.acisData[ky].acisValue) === 0 && app.cdoData[ky].cdoMflag.replace(/P/, "") !== app.acisData[ky].acisFlag.replace(/A|\s/g, "")))
        const acisOtime = (!Object.keys(app.acisData).length || app.acisData[ky].acisOtime === -1) ? "M" : app.acisData[ky].acisOtime;
        let acisAll = [...Array(12).keys()].map(i => {
          const acisdiff = app.acisData.hasOwnProperty(ky) && 
            ((app.acisData[ky].acisOther[i] === "S" && app.acisData[ky].acisFlag !== "S") || 
             (app.acisData[ky].acisOther[i] === "T" && app.acisData[ky].acisFlag !== "T") || 
             (app.acisData[ky].acisOther[i] === "-" && app.acisData[ky].acisFlag !== "M") || 
             (!isNaN(parseFloat(app.acisData[ky].acisOther[i])) && parseFloat(app.acisData[ky].acisOther[i]) !== parseFloat(app.acisData[ky].acisValue)));
          return <td className={acisdiff ? styles.acisdiff : styles.same} style={{display:app.acisHas[i]}} key={i}> {app.acisData.hasOwnProperty(ky) ? app.acisData[ky].acisOther[i] : "-"} </td>;
        })
        return <tr key={ky} className={diff ? styles.diff : styles.same}>
          <td>{ky}</td>
          <td className={styles.lb}> {app.cdoData.hasOwnProperty(ky) ? app.cdoData[ky].cdoValue : "-"} </td>
          <td> {app.cdoData.hasOwnProperty(ky) ? app.cdoData[ky].cdoMflag : "-"} </td>
          <td> {app.cdoData.hasOwnProperty(ky) ? app.cdoData[ky].cdoQflag : "-"} </td>
          <td> {app.cdoData.hasOwnProperty(ky) ? app.cdoData[ky].cdoSflag : "-"} </td>
          <td> {app.cdoData.hasOwnProperty(ky) ? app.cdoData[ky].cdoOtime : "-"} </td>
          <td style={{display:app.cdoNotes}}> {app.cdoData.hasOwnProperty(ky) ? app.cdoData[ky].cdoNote : "-"} </td>
          <td className={styles.lb}> {app.acisData.hasOwnProperty(ky) ? app.acisData[ky].acisValue : "-"} </td>
          <td> {app.acisData.hasOwnProperty(ky) ? app.acisData[ky].acisFlag : "-"} </td>
          <td> {app.acisData.hasOwnProperty(ky) ? app.acisData[ky].acisSource : "-"} </td>
          <td className={styles.rb}> {app.acisData.hasOwnProperty(ky) ? acisOtime : "-"} </td>
          { acisAll }
        </tr>
      }) : <tr><td colSpan="9">No data returned</td></tr>
    }
  
    const acisAllHeads = ['GHCN','CF6','DSM','Shef','3210','3200','3206','NWS','CRB','3205','NRCC','AWDN','SRCC'].map((val, i) => {
      return <th key={val} style={{display:this.props.store.app.acisHas[i]}}>{val}</th>;
    })
  
    return (
     <div id="results">
      <table>
        <thead>
          <tr>
            <th rowSpan="2">Date</th>
            <th colSpan={this.props.store.app.cdoNotes === "none" ? "5" : "6"} className={styles.lb}>
              {this.props.store.app.cdoStatus && this.props.store.app.cdoStatus.indexOf("...") >= 0 ? <img src={loader} alt=""/> : ""} 
              {" "}GHCN-Daily{" "}
              {this.props.store.app.cdoStatus ? this.props.store.app.cdoStatus : "Results"}
            </th>
            <th colSpan="4" className={styles.lb}>
              {this.props.store.app.acisStatus && this.props.store.app.acisStatus.indexOf("...") >= 0 ? <img src={loader} alt=""/> : ""}
              {" "}ACIS{" "}
              {this.props.store.app.acisStatus ? this.props.store.app.acisStatus : "Results"}</th>
            <th colSpan="2" style={{textAlign:"left"}} className={styles.lb}>ACIS All</th>
          </tr>
          <tr>
            <th className={styles.lb}>Value</th>
            <th>mflag</th>
            <th>qflag</th>
            <th>sflag</th>
            <th>ObsTime</th>
            <th style={{display:this.props.store.app.cdoNotes}}>Note</th>
            <th className={styles.lb}>Value</th>
            <th>Flag</th>
            <th>Source</th>
            <th className={styles.rb}>ObsTime</th>
            { acisAllHeads }
          </tr>
        </thead>
        <tbody>
          {buildDataRows(this.props.store.app)}
        </tbody>
      </table>
      <Help />      
      <ScrollButton />
     </div>
    )
  }
}

export default Results
