/* App.js */
import React, { Component } from "react";
import CanvasJSReact from './canvasjs.stock.react';
import './Graph.css'
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import {Link} from 'react-router-dom';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
 
 
class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = { dataPoints1: [], dataPoints2: [], dataPoints3: [], dataPoints4: [], isLoaded: false,
    values : ["Candle Stick","Line",], selected :"Candle Stick", minDate:'', maxdate:''  };
    
  }
    handleChange=(event)=> {
   this.setState( {selected : event.target.value})
  }
 
  componentDidMount() {
   
    //Reference: https://reactjs.org/docs/faq-ajax.html#example-using-ajax-results-to-set-local-state
    fetch(this.props.url)
      .then(res => res.json())
      .then(
        (data) => {
          var dps1 = [], dps2 = [], dps3 = [], dps4 = [];
          var lastdate=''
          this.setState({minDate:data[0].date
              
          });
          for (var i = 0; i < data.length; i++) {
            
            dps1.push({
              x: new Date(data[i].date),
              y: [
                Number(data[i].open),
                Number(data[i].high),
                Number(data[i].low),
                Number(data[i].close)
              ]
            });
            dps4.push({x:new Date(data[i].date), y:Number(data[i].close) })
            dps2.push({x: new Date(data[i].date), y: Number(data[i].volume_usd)});
            dps3.push({x: new Date(data[i].date), y: Number(data[i].close)});
            lastdate=data[i].date
          }
          this.setState({
            isLoaded: true,
            dataPoints1: dps1,
            dataPoints2: dps2,
            dataPoints3: dps3,
            dataPoints4 : dps4,
            maxdate :lastdate
          });
        }
      )
  }
 
  render() {
    const options1 = {
      
      animationEnabled: true,
      exportEnabled: true,
      charts: [{
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        axisY: {
          crosshair: {
            enabled: true,
            //snapToDataPoint: true
          }
        },
        data: [{
          type: "spline",
          dataPoints: this.state.dataPoints4
        }]
      }],    
      rangeSelector: {
        inputFields: {
         
          valueFormatString: "###0"
        },
        
        
      }
    };
    const options = {
      theme: "ligh2",
      animationEnabled: true,
			exportEnabled: true,
      charts: [{
        axisX: {
          lineThickness: 5,
          tickLength: 0,
          labelFormatter: function(e) {
            return "";
          },
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            labelFormatter: function(e) {
              return "";
            }
          }
        },
        axisY: {
          title: "Stock Price",
          prefix: "",
          tickLength: 0
        },
        toolTip: {
          shared: true
        },
        data: [{
          name: "Price",
          yValueFormatString: "$#,###.##",
          type: "candlestick",
          dataPoints : this.state.dataPoints1
        }]
      },{
        height: 80,
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        axisY: {
          title: "Volume",
          prefix: "$",
          tickLength: 0
        },
        toolTip: {
          shared: true
        },
        data: [{
          name: "Volume",
          yValueFormatString: "$#,###.##",
          type: "column",
          dataPoints : this.state.dataPoints2
        }]
      }],
      navigator: {
        data: [{
          dataPoints: this.state.dataPoints3
        }],
        slider: {
          minimum: new Date(this.state.minDate),
          maximum: new Date(this.state.maxdate)
        }
      }
    };
    const containerProps = {
      width: "100%",
      height: "410px",
      margin: "auto"
    };
    return (
      <div className="graphMain"> 
      <div className="mainNav">
                <div className="mainNav1">
            <FormControl >
      
      <Select
        value={this.state.selected}
        onChange={this.handleChange}
        inputProps={{
          name: "Graph Type",
          id: "grapType"
        }}
      >
        {this.state.values.map((value, index) => {
        
          return <MenuItem value={value} key={index}>{value}</MenuItem>;
        })}
      </Select>
    </FormControl>
    </div>
    {/* <div className="mainNav2">
    <Link className="navBack" to="/"><CloseIcon className="closeGraph" /></Link> 
        </div> */}
            </div>
        <div>
          {
            // Reference: https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator
            this.state.isLoaded && this.state.selected=="Candle Stick" &&
            <CanvasJSStockChart containerProps={containerProps} options = {options}
              /* onRef = {ref => this.chart = ref} */
            /> ||
            this.state.isLoaded && this.state.selected=="Line" &&
            <CanvasJSStockChart containerProps={containerProps} options = {options1}
              /* onRef = {ref => this.chart = ref} */
          />
          }
        </div>
      </div>
    );
  }
}
export default Graph;  