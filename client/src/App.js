import React, { Component } from 'react';
import './App.css';
import Dashboard from './components/Dashboard.jsx'
import UnsafeScriptsWarning from "./components/UnsafeScriptsWarning";
import NabBar from './components/NabBar'
import Footer from './components/Footer'
import Main from './components/Main'
import Modal from 'react-modal'


class App extends Component {

  state = {
    hasError: false,
    showSpinner: true,
    showModal : false,
    searchedStock:''
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
    this.setState({
      searchedStock: stock_name,
      showModal: true
    })
  }
  hideModal=()=>{
    
    this.setState({
      
      searchedStock:'',
      showModal:false
    })
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
       <Modal className="popUpModal" isOpen={this.state.showModal}>
          <Main hideMod={this.hideModal} searched_Stock={this.state.searchedStock}  />  
        </Modal>
        <Dashboard hideSpinner={this.hideSpinner} showSpinner={this.state.showSpinner} showDeatilPage={this.showDetails} />         
        <div className="Footer">
        <Footer />
        </div>
       </div>
       
    );
  }
}

export default App;
