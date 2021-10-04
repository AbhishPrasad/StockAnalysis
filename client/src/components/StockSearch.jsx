import React, {useEffect, useState} from 'react'
import './Css/StockSearch.css'

class StockSearch extends React.Component {

  state={
    stockName:[{}],
  text:'',
  suggestions:[]
  }
  componentDidMount(){
    var response= require('../stockList.json')
   
  this.setState({
    stockName : response.stocks
  })
    
  }
 
   onChangeHandler=(text)=>{
   //  console.log(this.state.stockName)
   var letters = /^[A-Za-z]+$/;
   if(text.match(letters) || text == "")
   {
    
   
     let matches=[]
    
     if(text.length > 0){
       
      matches = this.state.stockName.filter((d)=>{
        const regex = new RegExp(`${text}`,"gi")
        return d.Stock.match(regex)
      })
    }

   this.setState({
    suggestions: matches,
     text
   })
  
  }
}
  onSuggestHandler =(text)=>{
  
    
    console.log(this.state.stockName)
    this.props.Selected(this.state.stockName.filter((o)=>{
      return o.Stock.match(text)
    }))
    this.setState({
      text:"",
      suggestions:[]
    })
  }
  
  render(){
  return(
 
    <div className="stockSearchDiv">
      <input type="text"
      placeholder="Add Stock"
      className="suggestionTextBox col-md-3 input"
      onChange={e=>this.onChangeHandler(e.target.value)}  
     value={this.state.text}
     
       onFocus={e=>this.onChangeHandler(e.target.value)}
      onBlur={()=>{
        setTimeout(() => {
          this.setState({
            suggestions:[]
          })
        }, 1000);
      }

      }
     />
     <div className="divider"></div>
     {
       this.state.suggestions && this.state.suggestions.map((sug, i)=>
         <div key={i} className="suggestion col-md-3 justify-content-md-center"
         onClick={()=>this.onSuggestHandler(sug.Stock)}>{sug.Stock}</div>
       
       )}
    </div>
  
  )
  }
}

export default StockSearch
