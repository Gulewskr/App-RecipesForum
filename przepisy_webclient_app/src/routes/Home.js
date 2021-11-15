import { useContext, useEffect, useMemo, useState } from "react";
import { Buttons, RecipeComp, RecipeImagesForm  } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";

const Home = (props) => {

  const { token } = props;

  const getData = () => {
    return 0;
  };

  useEffect(() => {
    getData();
  },[]);

  return (
    <div>
    <h2>Home</h2>
    <img src="http://localhost:3001/images/static/1.png" alt="Zdjęcie z serwera"/>
    <h2>TEST</h2>
    <RecipeImagesForm postAddress={'/imagesProfile'} token={token} />
    </div>
  );
}

/*
  TODO: 
    - dodać callback ( do większych formularzy - zwracać id i url dodanego zdjęcia)
    - formularz dla przepisu na dodawanie większej ilości zdjęć (ma id i url -> wyświetlanie zdjęć i dodawanie do bazy danych potem
*/



export default Home;