const webSocket = require('ws')
const axios = require('axios');
var fs = require('fs');
const Port = 5000 
const wsServer = new webSocket.Server({
    port : Port
})

wsServer.on('connection', function(socket) {
  
    var stockList=[]
    fs.readFile('stockList.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        obj.stocks.map((o)=>{
           stockList.push({
            "stock" : o["stock"]
           })
        })
        sendStockData();
    }
    })
          
    
    
    console.log("New user connedcted")

    
    socket.addEventListener('message', function(msg){
        
        var jsonData = JSON.parse(msg.data)
        if(jsonData["newStock"]){
            stockList.push({
                "stock" : jsonData["newStock"]
               // lastUpdated : new Date(Date.now())
            })
            axios.get('https://query1.finance.yahoo.com/v8/finance/chart/' + jsonData["newStock"])
                 .then(data => {
                    socket.send(JSON.stringify(data.data))
                     })
                     .catch(error => {
                        console.log(JSON.stringify(error));
                        });
        }
        addStocktoFile(jsonData["newStock"])
       
    })
    
    function sendStockData() {
       //  var stockList = JSON.parse(fs.readFileSync('C:\\StockAnalysis\\client\\src\\stockList.json', 'utf8'));
 
            stockList.map((o)=>{
               
                axios.get('https://query1.finance.yahoo.com/v8/finance/chart/'+ o.stock )
                 .then(data => {
                    socket.send(JSON.stringify(data.data))
                    
                     })
                     .catch(error => {
                        console.log(JSON.stringify(error));
                        });
            })
            
        setTimeout(sendStockData, 5000); 
        if(stockList.length == 0){
            socket.send("No records to show.")
        }
      
    }
    function addStocktoFile(stock){
        var i=0;
        fs.readFile('stockList.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data); //now it an object
            obj.stocks.map((o)=>{
                if(o["stock"]===stock){
                    i++;
                }
            })
            if(i == 0){
            obj.stocks.push({stock}); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('stockList.json', json, 'utf8', err => {
                if (err) {
                    console.log('Error writing file', err)
                } else {
                    console.log('Successfully wrote file')
                }
            }); // write it back
        } 
        }});  
    }
});
console.log((new Date())+ 'server listining on '+ Port)