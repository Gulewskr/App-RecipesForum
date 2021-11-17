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


  const tryCreateNewRecipe = (name, text, tags, type, speed, lvl, images) => {
    console.log(`tagi: ${tags}`)
    fetch(`${API_ADDRESS}/recipe`, {
      method: 'post',
      headers: { 'Content-Type' : 'application/json',
                'access-token'  : USER.token },
      body: JSON.stringify({
        name: name,
        text: text,
        tags: tags,
        type: type,
        speed: speed,
        lvl: lvl,
        images: images
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
      if(data.error != 0)
      {
        console.log("Błąd dodania " + data.errorMSG);
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
        <RecipeForm token={USER.token} callback={tryCreateNewRecipe} />
      </div>
    );
  }
  
  export default RecipeNew;