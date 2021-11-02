import { useContext, useEffect, useState } from "react";
import { Buttons, Recipe } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";

const RecipeList = () => {

  const { USER } = useContext(UserContext);
  const [recipes, setRecipes] = useState("Brak przepisów");

  const createRecipeList = (data) => {
    var res = []; //= <div>{JSON.stringify(data, null, '  ')}</div>;
    for(let i = 0, l = data.length; i < l; i++)
    {
      const {id, id_user, name, text, type} = data[i];
      res.push( Recipe(id, id_user, name, text, type) );
    }
    setRecipes( res );
  }

  const getRecipes = () => fetch(`${API_ADDRESS}/recipes`, {
      method: 'get',
      headers: { 
          'Access-token': USER.token,
          'Content-Type': 'application/json' 
      }
    })
    .then( res => {
      try{
        console.log(res);
        return res.json();
      }catch (err){
        console.log(err);
      };
    })
    .then((d) => {
        //console.log(d.data[0]);
        //console.log(JSON.stringify(d.data, null, '  '));
        console.log(d.data.length);
        console.log(d.data);
        //setRecipes(d.data);
        createRecipeList(d.data);
    })
    .catch(err => {
      console.log(err);
    });

    useEffect(() => {
      getRecipes();
    },[]);


    return (
      <div>
        <h2>RecipeList</h2>
        <Buttons.AddRecipeButton />{/* id, id_user, name, text, type */}
        <pre>{recipes}</pre>
      </div>
    );
  }
  
  export default RecipeList;