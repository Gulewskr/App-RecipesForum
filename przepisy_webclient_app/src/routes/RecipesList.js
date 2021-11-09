import { useContext, useEffect, useState } from "react";
import { Buttons, Recipe } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";

const RecipeList = () => {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  //Do filtrowania
  //const type = urlParams.get('type')
  //const tags = urlParams.get('tags')

  var _type = [];
  var _lvl = [];
  var _speed = [];
  var _TAGS = [];
  //const [_type, setRecipeType ] = useState([]);
  //const [_lvl, setRecipeLVL ] = useState([]);
  //const [_speed, setRecipeSpeed ] = useState([]);
  //const [_TAGS, setRecipeTags ] = useState([]);

  const Filter = () => {
    const SingleFilter = (props) => {
      const {name, v, l} = props;
      const [choosen, setChoosen] = useState(false);
      const changeState = (val) =>
      {
        if(val){
          addToFilterList(l, v);
        }else{
          removeFromFilterList(l, v);
        }
        setChoosen(val);
      }

      return( 
        <div>
          <div>{name}</div>
          {
            choosen ? 
            <div style={{"color" : "green"}} onClick={() => changeState(false) }>wybrany</div>
            :
            <div style={{"color" : "orange"}} onClick={() => changeState(true) }>wybierz</div>
          }
        </div>
      )
    }

    const addToFilterList = (list, v) => {
      var i = list.indexOf(v);
      if(i == -1) list.push(v);
      console.log(list);
    }

    const removeFromFilterList = (list, v) => {
      var i = list.indexOf(v);
      if(i != -1) list.splice(i, 1);
      console.log(list);
    }

    const applyFilters = () => {
      fetch(`${API_ADDRESS}/recipes?type=${_type}&speed=${_speed}&lvl=${_lvl}&tags=${_TAGS}`, {
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
          //createRecipeList(d.data);
      })
      .catch(err => {
        console.log(err);
      });
    }

    /**
     * 'Danie główne' : 0,
      'Przekąska' : 1,
      'Sałatka' : 2,
      'Zupa' : 3,
      'Deser' : 4,
      'Ciasto' : 5
     */
    return(
      <div>
        <h1>Filtry</h1>
        <p>Typ</p>
        <SingleFilter name={"Danie główne"} v={1} l={_type}/>
        <SingleFilter name={"Przekąska"} v={2} l={_type}/>
        <SingleFilter name={"Sałatka"} v={3} l={_type}/>
        <SingleFilter name={"Zupa"} v={4} l={_type}/>
        <SingleFilter name={"Deser"} v={5} l={_type}/>
        <SingleFilter name={"Ciasto"} v={6} l={_type}/>
        <p>Długość przygotowania</p>
        <SingleFilter name={"szybki"} v={1} l={_speed}/>
        <SingleFilter name={"średni"} v={2} l={_speed}/>
        <SingleFilter name={"długi"} v={3} l={_speed}/>
        <p>Stopień trudności</p>
        <SingleFilter name={"łatwe"} v={1} l={_lvl}/>
        <SingleFilter name={"średnie"} v={2} l={_lvl}/>
        <SingleFilter name={"trudne"} v={3} l={_lvl}/>
      </div>
    )
  }
  


  const { USER } = useContext(UserContext);
  const [recipes, setRecipes] = useState("Brak przepisów");

  const createRecipeList = (data) => {
    var res = []; //= <div>{JSON.stringify(data, null, '  ')}</div>;
    for(let i = 0, l = data.length; i < l; i++)
    {
      const {id, id_user, name, text, type} = data[i];
      res.push( <Recipe key={id} id={id} user={id_user} name={name} text={text} type={type} /> );
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
        //console.log(d);
        //console.log(d.data.length);
        //console.log(d.data);
        //setRecipes(d.data);
        if(d.error == 0) createRecipeList(d.data);
        else setRecipes(<h1 style={{color: "red"}}>{d.errorMSG}</h1>)
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
        <Filter />
        <Buttons.AddRecipeButton />{/* id, id_user, name, text, type */}
        <pre>{recipes}</pre>
      </div>
    );
  }
  
  export default RecipeList;