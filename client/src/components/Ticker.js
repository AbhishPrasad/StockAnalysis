import React, {useEffect, useState} from 'react'
import protobuf from 'protobufjs'
import './App.css'

const  { Buffer } = require('buffer/')

function formatPrice(price) {
  return `$${price.toFixed(2)}`
}
const emojis = {
  'same' : '-',
  'up' : '⇧',
  'down' : '⇩'
}

function Ticker(){

const [current, setCurrent] = useState({})
const [direction, setDirection] = useState('')
  useEffect(()=>{
    const ws = new WebSocket('wss://streamer.finance.yahoo.com');
    protobuf.load('./YPricingData.proto',(error, root)=>{
      if(error){
        return console.log(error)
      }
      const Yaticker= root.lookupType('yaticker');

      ws.onopen = function open() {
        console.log('connected');
        ws.send(JSON.stringify({
          subscribe: ['GME', 'AMC','AAPL']
        }));
      }
      ws.onclose = function close() {
        console.log('disconnected')
      };
      ws.onmessage = function incoming(message) {
        
      const next =Yaticker.decode(new Buffer(message
          .data, 'base64'))
      //s  console.log(next)    
      // console.log(next)
      let new_stock= current
      if(current[next.id])
      {
        new_stock[next.id].id = next.id
        new_stock[next.id].direction = current[next.id].price < next.price ? 'up' : current[next.id].price > next.price ? 'down' : 'same' 
        new_stock[next.id].price = next.price
          
          
      } 
      else{
        new_stock[next.id] = {id:next.id, price : next.price, direction: 'up'}
      }
      setCurrent({new_stock})

     
      }
    })
   
    
  },[])
 
return (
  <div className='stockTicker'>
  
   <marquee> <ul >{Object.keys(current).length ==0 ?'':  Object.keys(current.new_stock).map((id)=>{
     
      return (<li key={id} className={current.new_stock[id].direction}>{id} - {formatPrice(current.new_stock[id].price)} {emojis[current.new_stock[id].direction]}  </li>)
    })} 
    </ul>
    </marquee>
  </div>
)
}


export default Ticker;
