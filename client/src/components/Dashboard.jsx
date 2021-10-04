import React from 'react'
import * as bulma from "reactbulma";
import StocksList from "./StocksList.jsx";
import StocksGraph from "./StocksGraph.jsx";
import StocksLoaderStatus from "./StocksLoaderStatus.jsx";
import StockSearch from './StockSearch'
import './Css/Dashboard.css'
import News from './News'

const stocksUrl = 'ws://127.0.0.1:5000';

class Dashboard extends React.Component {

  state = {
  // stocks = {name: {current_value: 12, history: [{time: '2131', value: 45}, ...], is_selected: false}, ...}
   stocks: {},
   market_trend: undefined, // 'up' or 'down'
   connectionError: false
  }

  componentDidMount = () => {
    this.connection = new WebSocket(stocksUrl);
    this.connection.onmessage = this.saveNewStockValues;
    this.connection.onclose = () => { this.setState({connectionError: true}) }
    
  }



  saveNewStockValues = (event) => {
    
    if(event.data === "No records to show."){
       setTimeout(() => {
        this.props.hideSpinner();
      }, 2000); 

      return
    }
    //console.log(event.data)
    this.props.hideSpinner();
    
    let result = JSON.parse(event.data);
    const gme = result.chart.result[0]
    //console.log(gme)
    //console.log(gme.meta.regularMarketPrice)
    let [up_values_count, down_values_count] = [0, 0];

    // time stored in histories should be consisitent across stocks(better for graphs)
    let current_time = Date.now();
    let new_stocks = this.state.stocks
      // stock = ['name', 'value']
      if(this.state.stocks[gme.meta.symbol])
      {
    
        new_stocks[gme.meta.symbol].current_value > gme.meta.regularMarketPrice? up_values_count++ : down_values_count++;

        new_stocks[gme.meta.symbol].current_value = gme.meta.regularMarketPrice
        new_stocks[gme.meta.symbol].history.push({time: current_time, value: gme.meta.regularMarketPrice})
      }
      else
      {
        
        new_stocks[gme.meta.symbol] = { current_value: gme.meta.regularMarketPrice, history: [{time: Date.now(), value: gme.meta.regularMarketPrice}], is_selected: false }
      }
      
    this.setState({stocks: new_stocks, market_trend: this.newMarketTrend(up_values_count, down_values_count)})
    //console.log(this.state.stocks)
    
  }

  // it's about the values that just came in, and not all the stocks
  newMarketTrend = (up_count, down_count) => {
    if(up_count === down_count) return undefined;
    return up_count > down_count ? 'up' : 'down'
  }

  toggleStockSelection = (stock_name) => {
    let new_stocks = this.state.stocks;
    new_stocks[stock_name].is_selected = !new_stocks[stock_name].is_selected
    this.setState({ stocks: new_stocks })
  }
 

  resetData = () => {
    let new_stocks = this.state.stocks;
    Object.keys(this.state.stocks).map((stock_name, index) =>
    {
      new_stocks[stock_name].history = [new_stocks[stock_name].history.pop()];
    });
    this.setState({ stocks: new_stocks });
  }

  areStocksLoaded = () => {
    return Object.keys(this.state.stocks).length > 0;
  }
  getSelectedStock=(stock_name)=>{
    var mesg= '{"newStock" : "'+ stock_name[0].Symbol + '"}' 
    
    var conn = new WebSocket(stocksUrl);
    conn.onopen = () => conn.send(mesg);
    conn.onmessage = this.saveNewStockValues
  }
  render() {
    return (
      <div className='stock_container'>
        <div className='columns'>
          <StocksList
            SelectedStock={this.props.showDeatilPage}
            stocks={this.state.stocks}
            toggleStockSelection={this.toggleStockSelection}
            showDetails = {this.showDetails}
            resetData={this.resetData}
            market_trend={this.state.market_trend}
            areStocksLoaded={this.areStocksLoaded}
          />
          <StocksGraph stocks={this.state.stocks} />
          
          <News />
          
        </div>
        
        <div className={ this.props.showSpinner ? 'modal is-active' : 'modal' }>
          <div className="modal-background"></div>
          <div className="modal-content">
            <StocksLoaderStatus connectionError={this.state.connectionError}  />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
