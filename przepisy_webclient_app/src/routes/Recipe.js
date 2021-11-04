import { useContext, useEffect, useMemo, useState } from "react";
import { Buttons } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";

const Recipe = () => {

  const { USER, token } = useContext(UserContext);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')

  const [data, setData] = useState("");  
  
  const {owner, name, text, type, tags} = useMemo(
    () => {console.log(data); return({
      owner : data !== "" ? data.own ? data.own === true : false : false, 
      name : data !== "" ? data.name ? data.name : "null" : "null", 
      text : data !== "" ? data.text ? data.text : "null" : "null", 
      type : data !== "" ? data.type ? data.type : "null" : "null", 
      tags : data !== "" ? data.rn ? data.rn : "null" : "null"
    })}, [data]);

  useEffect(() => {
    if(id){
      fetch(`${API_ADDRESS}/recipe?id=${id}`, {
        method: 'get',
        headers: { 
          'Access-token': token,
          'Content-Type': 'application/json' 
        },
      })
      .then( res => {
        try{
          console.log(res); 
          return res.json();
        }catch (err){
          console.log(err);
        };
      })
      .then((data) => {
        setData(data);
      })
      .catch(err => {
        console.log(err);
      });
    }else{
      console.log("brak id przepisu");
    }
  }, [id, token]);

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
      <p>
        Typ:<br/>
        {type}
      </p>
      <p>
        Tagi:<br/>
        {tags}
      </p>
    </div>
  );
}
  
  export default Recipe;