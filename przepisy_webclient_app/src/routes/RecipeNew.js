import React, {useState, useContext} from 'react';
import { RecipeForm } from '../components';
//DATA
import {API_ADDRESS} from '../data/API_VARIABLES';
import {UserContext} from '../data/User';
//Styles
import '../styles/App.scss';

/*
  TODO 
  -dodać szyfrowanie hasła
  -dodać walidacje wprowadzonych danych

*/

const RecipeNew = () => {
  const { USER } = useContext(UserContext);


  const tryCreateNewRecipe = (name, text, tag, type, speed, lvl) => {
    fetch(`${API_ADDRESS}/recipe`, {
      method: 'post',
      headers: { 'Content-Type' : 'application/json',
                'access-token'  : USER.token },
      body: JSON.stringify({
        name: name,
        text: text,
        tags: tag,
        type: type,
        speed: speed,
        lvl: lvl
      }),
    })
    .then( res => {
      try{
        console.log(res);
        if(res.status == 200)
          return res.json();
        return res.status;
      }catch (err){
        console.log(err);
      };
    })
    .then((data) => {
      if(typeof data == Number)
      {
        console.log("Błąd dodania " + data);
        return;
      } 
        //data = id nowego przepisu
      if(data.id)
      {
        window.location.replace("/recipe?id=" + data.id);
        return;
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

    return (
      <div>
        <h2>Formularz nowego przepisu</h2>
        <RecipeForm callback={tryCreateNewRecipe} />
      </div>
    );
  }
  
  export default RecipeNew;