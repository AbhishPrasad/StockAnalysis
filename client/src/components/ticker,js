import React, {useEffect, useState} from 'react'
import protobuf from 'protobufjs'
import './App.css'

const  { Buffer } = require('buffer/')

function formatPrice(price) {
  return `$${price.toFixed(2)}`
}
const emojis = {
  '' : '👊',
  'up' : '👆',
  'down' : '👇'
}

function App(){

const [current, setCurrent] = useState(null)
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
          subscribe: ['GME', 'AMC']
        }));
      }
      ws.onclose = function close() {
        console.log('disconnected')
      };
      ws.onmessage = function incoming(message) {
        
      const next =Yaticker.decode(new Buffer(message
          .data, 'base64'))
      console.log(next)    
      setCurrent((cur)=>{ 
        if(current){
          const nextDirection  = current.price < next.price ? 'up' : current.price > next.price ? 'down' : ''
         if(nextDirection){
          setDirection(nextDirection)
         }
        }
        return next
      })

      }
    })

  },[])

return (
  <div className='stockTicker'>

    {current &&  <h2 className={direction}>{current.id} {formatPrice(current.price)} {emojis[direction]}</h2>}
  </div>
)
}


export default App;
