import { useContext, useEffect, useState } from "react";
import { Buttons } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";

const Recipe = () => {

  const { USER } = useContext(UserContext);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')

  const [data, setData] = useState("");  

  const owner = data !== "" ? data.own ? data.own === true : false : false;
  const name = data !== "" ? data.name ? data.name : "null" : "null";
  const text = data !== "" ? data.email ? data.email : "null" : "null";
  const type = data !== "" ? data.type ? data.type : "null" : "null";
  const tags = data !== "" ? data.rn ? data.rn : "null" : "null";


  useEffect(() => {
    //Pobranie danych na temat przepisu
  },[])

  return (
    <div>
      <h2>Recipe {name}</h2>
      { 
        owner ?
          <p>właściciel przepisu</p> 
        :
          <p>jakiś random co tylko może oglądać</p> 
      }
      <p>
        Sposób przygotowania:<br/>
        {text}
      </p>
    </div>
  );
}
  
  export default Recipe;