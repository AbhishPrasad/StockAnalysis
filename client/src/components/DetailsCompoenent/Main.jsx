import React, {useState,useEffect} from 'react'
import {Link} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Graph from './Graph'
import './Main.css';

function Main() {
    
    
    const [parameter,setParameter]=useState();
    const [paramUpdate, setParamUpdate] = useState(false);
    
   

    return (
        <div className="detailsMain">
            <div className="closeItem">
           
                <Link className="navBack" to="/">X</Link> 
    
                </div>
            <div className="one">
            
                <div className="graph"><Graph url="https://canvasjs.com/data/docs/ltcusd2018.json"/></div>
                { paramUpdate == true && parameter.length > 1 && <div className="graph"><Graph url="https://canvasjs.com/data/docs/ltcusd2018.json"/></div>}
                
                
            </div>
            <div className="two">
            <div className="graph1">graph Goes here</div>
                <div className="detailnew1">News here</div>
            </div>        
                   
        </div>
    )
}

export default Main
