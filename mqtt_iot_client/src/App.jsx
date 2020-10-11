import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import c3 from 'c3';
import 'c3/c3.css';


export default class homeScreen extends Component {
   constructor(props) {
      super(props);
      this.state = {
        view: 'table',
        sensors: [],
        tempInput: '',

      }
      this.changeView = this.changeView.bind(this);
      // this.changeTempInput = this.changeTempInput.bind(this);
      this.getSensorData = this.getSensorData.bind(this);
    }
    
    componentDidMount () {
      this.getSensorData();

    }

    componentDidUpdate() {
      if(this.state.view === 'plot') {
        this.renderChart();
      }
    }

    getSensorData() {
      axios.get(`https://us-central1-cmpeiot.cloudfunctions.net/httpApi`)
      .then(response => {
        console.log(response.data);
        if(response.data) {
          this.setState({
            sensors: response.data,
            view: 'table'
          })
        }
      })
      .catch(error => {
        console.log(error);
      });
    }

    changeView(inputView) {
      console.log("inputView", inputView);
      this.setState({
        view: inputView
      })
    }

    // changeTempInput(e) {
    //   this.setState({
    //     tempInput: e.target.value
    //   })
    // }

    // changeTemp = event => {
    //   let sensors = this.state.sensors;
    //   console.log("inside tempChange", event);
    //   let tempChange = {
    //     // id: sensors[sensors.length-1].id,
    //     temperature: this.state.tempInput
    //   }

    //   console.log(tempChange)
    //   axios.put(`https://us-central1-cmpeiot.cloudfunctions.net/httpApi?id=`+sensors[sensors.length-1].id)
    //   .then(response => {
    //     console.log(response.data);
    //     if(response.data) {
    //       window.alert("Latest temperature updated successfully!");
    //       this.getSensorData();
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // }
    renderChart(){
      console.log("state sensors", this.state.sensors);
var temp = ["temp"];
var humidity =["humidity"]
{this.state.sensors.map(sensorData => {
 temp.push(sensorData.data.temperature ? sensorData.data.temperature : "16")
})}
{this.state.sensors.map(sensorData => {
  humidity.push(sensorData.data.humidity ? sensorData.data.humidity : "50")
 })}
// console.log("temp",temp)

      this.chart = c3.generate({  
        bindto:"#chart1",
        data: {
          columns: [
            temp,humidity
        ],
        type:"bar"
        },
        bar: {
          width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
          }
      },
      axis: {
        x: {
            label: 'No.of times changed'
        },
        y: {
            label: 'Temperature and humidity'
        },
    }
    });  
    }
     
  render(){
    this.renderChart()
  return (
    <div className="App">
      <div>
      <header className="App-header">
        <h1>
          IOT Sensor data
        </h1>
      </header>
      <nav className="App-navbar">
        <ul className="navbar-ul">
        <li className="navbar-li navbar-li-a" onClick={() => this.changeView('table')}>Sensor data</li>
        {/* <li className="navbar-li navbar-li-a" onClick={() => this.changeView('setTemp')}>Set Temperature</li> */}
        <li className="navbar-li navbar-li-a" onClick={() => this.changeView('plot')}>Plot graphs</li>
        </ul>
      </nav>
      {this.state.view === 'table' && 
     
        <div>
      <h2>The sensor data details sent from iot device is:</h2><br></br>
      <table className="App-table">
      <thead>
        <tr>
          <th className="App-table">id</th>
          <th className="App-table">Sensor Data</th>
        </tr>
      </thead>
      <tbody>
      {this.state.sensors.map(sensorData => {
        var temp=[sensorData.data.temperature ? sensorData.data.temperature : "16"]
        var m = new Date();
        var dateString =
        m.getUTCFullYear() + "-" +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);

        console.log(dateString);
        var timing = [sensorData.data.timecollected ? sensorData.data.timecollected :dateString ]
        console.log(temp,timing)
        
        return (
          <tr><td className="App-table">{sensorData.id}</td> 
        <td className="App-table"><span>Device ID: {sensorData.data.device_id ? sensorData.data.device_id : " "}</span><br></br>
        <span> Humidity: {sensorData.data.humidity ? sensorData.data.humidity : "N/A"} </span><br></br>
        <span> Temperature: {sensorData.data.temperature ? sensorData.data.temperature : "N/A"} </span><br></br>
        <span> Latitude: {sensorData.data.latitude ? sensorData.data.latitude : "N/A"} </span><br></br>
        <span> Longitude: {sensorData.data.longitude ? sensorData.data.longitude : "N/A"} </span><br></br>
        <span> TimeCollected: {sensorData.data.timecollected ? sensorData.data.timecollected : "N/A"} </span><br></br>
        <span> Zipcode: {sensorData.data.zipcode ? sensorData.data.zipcode : "N/A"} </span>  
        </td>
        </tr>
        )

      })}
      </tbody>
      </table>   
      </div>}

      {/* {this.state.view === 'setTemp' &&
        <div>
        <label className="inputBox" for="temp">Temperature:</label>
        <input className="inputBox" type="number" id="temp" name="temp" onChange={this.changeTempInput} value={this.state.tempInput}></input><br></br>
        <input className="submitbutton" value="Submit" onClick={this.changeTemp}></input>
        </div>
      } */}

{this.state.view === 'plot' &&
        <div>
          <h1>The graphs represents temperature and humidity changes at different intervals</h1>
          <br></br>
          <br></br>
          <br></br>
          <div className= "charts" id="chart1"></div> 
        </div>
      }
    </div>
    </div>
  );
}
}


