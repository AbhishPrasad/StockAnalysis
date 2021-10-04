import React, { Component } from 'react';
import './App.css';
import Dashboard from './components/Dashboard.jsx'
import UnsafeScriptsWarning from "./components/UnsafeScriptsWarning";
import NabBar from './components/NabBar'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Main from './components/DetailsCompoenent/Main'
class App extends Component {

  state = {
    hasError: false,
    showSpinner: true
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log('some error has occured');
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  hideSpinner = () => {
    this.setState({showSpinner: false});
  }
  showDetails = (stock_name) => {
    window.location.replace('/details/:'+stock_name)
  }
  render() {
    if (this.state.hasError) {
      return <UnsafeScriptsWarning />;
    }
    return (
      <div className="App">
         <div className="header">
       <NabBar />
       </div>
        

        <Router>
      <Switch>
      
        <Route path="/details/:stocks">
        <Main />
        </Route>
        <Route path="/">
        <Dashboard hideSpinner={this.hideSpinner} showSpinner={this.state.showSpinner} showDeatilPage={this.showDetails} /> 
        </Route>
      
      </Switch>
      </Router>

        <div className="Footer">
        <Footer />
        </div>
       </div>
       
    );
  }
}

export default App;
