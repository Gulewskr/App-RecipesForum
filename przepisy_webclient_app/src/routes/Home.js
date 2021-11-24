import { useContext, useEffect, useMemo, useState } from "react";
import { Buttons, RecipeComp  } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";
import UF from "../data/UserTypes";

const Home = (props) => {

  const { token } = props;

  const [reciepiesTable, setDataRecipies] = useState([]);

  const getData = () => {
    getRecipes();
  };

  useEffect(() => {
    getData();
  },[]);

  
const getRecipes = () => 
  fetch(`${API_ADDRESS}/recipesTop`, {
    method: 'get',
    headers: { 
        'Access-token': token,
        'Content-Type': 'application/json' 
    }
  })
  .then( res => {
    try{
      return res.json();
    }catch (err){
      console.log(err);
    };
  })
  .then((d) => {
      if(d.error == 0) setDataRecipies(d.data);
      <h1 style={{color: "red"}}>{d.errorMSG}</h1>
  })
  .catch(err => {
    console.log(err);
  });

  return (
    <div>
      <h2>Home</h2>
      <img src="http://localhost:3001/images/static/1.png" alt="Zdjęcie z serwera"/>
      {reciepiesTable.map((v, i) => {
        if(i < 2){
          let {id, imageURL, lvl, name, speed, text, type, user} = reciepiesTable[i];
          return <div key={id} className={UF.GetRecipeDivClass(user.type)}><RecipeComp key={id} id={id} image={imageURL} name={name} speed={speed} lvl={lvl} text={text} type={type} user={user} /></div> ;
        }else{
          return 
        }
      })
      }
    </div>
  );
}

export default Home;