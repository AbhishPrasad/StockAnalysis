import React, { useEffect, useRef, useState } from "react";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import './Css/Main.css'
const Main = (props) => {
  const tradingRef = useRef(null);
  const [symbol, setSymbol] = useState("AAPL");

  useEffect(() => {
    console.log(tradingRef.current.props.symbol);
  }, []);

  console.log(symbol);

  return (
      <div className="graph_main">
    
    <TradingViewWidget
      symbol={props.searched_Stock}
      theme={Themes.DARK}
      locale="en"
      ref={tradingRef}
    />
    
    <button className="popup_close" onClick={()=> props.hideMod()}> X </button>
    </div>
  );
};
export default Main;
