import { useContext, useEffect, useMemo, useState } from "react";
import { Buttons, RecipeComp, createRecipeList } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";
import UF from "../data/UserTypes";
//image

const RecipeList = () => {

  //const queryString = window.location.search;
  //const urlParams = new URLSearchParams(queryString);
  
  const { _type, _lvl, _speed, _TAGS } = useMemo(() => ({
    _type: [],
    _lvl: [],
    _speed: [],
    _TAGS: []
  }), []);
  const [ allTags, setAllTags ] = useState([]);
  const [_premium, setPremium] = useState(false);
  const { USER } = useContext(UserContext);
  
  const [recipesData, setRecipesData] = useState("Brak przepisów");
  const [recipes, setRecipes] = useState("Brak przepisów");
  const [filtr, setFiltr] = useState("");


  const refreshTags = () => {
    fetch(`${API_ADDRESS}/tags`, {
      method: 'get',
      headers: { 
          'Access-token': USER.token,
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
        console.log(d);
        if(d.error == 0) setAllTags( d.data );
        else return setAllTags( [] );
    })
    .catch(err => {
      console.log(err);
    });
  };

  const Filter = () => {

    const SingleFilter = (props) => {
      const {name, v, l, choosed} = props;
      const [choosen, setChoosen] = useState(choosed);
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
        <div className="filter-box">
          <div>{name}</div>
          {
            choosen ? 
            <div className="checkmarkBox" onClick={() => changeState(false) }><div className="divNormal"><img className="checkmark" src={"http://localhost:3001/images/static/checkmark.png"} alt="wybrano"/></div></div>
              :
            <div className="checkmarkBox" onClick={() => changeState(true) }><div></div></div>
          }
        </div>
      )
    }

    const addToFilterList = (list, v) => {
      var i = list.indexOf(v);
      if(i == -1) list.push(v);
      console.log(list);
    };

    const removeFromFilterList = (list, v) => {
      var i = list.indexOf(v);
      if(i != -1) list.splice(i, 1);
      console.log(list);
    };

    const TagsFilter = () => {
      let res = [];
      for(let i in allTags)
      {
        let tagID = allTags[i].id;
        let tagText = allTags[i].text;
        res.push(<SingleFilter key={tagID} name={'#' + tagText} v={tagText} l={_TAGS} choosed={_TAGS.indexOf(tagText) != -1}/>);
      }
      return res;
    };
    /**
     * 'Danie główne' : 0,
      'Przekąska' : 1,
      'Sałatka' : 2,
      'Zupa' : 3,
      'Deser' : 4,
      'Ciasto' : 5
     */
    return(
      <div className="filters">
        <div className="filter-cont" id="cont1">
          <h1>Filtry</h1>
        </div>
        <div className="line" />
        <div className="filter-cont">
          <p>Typ</p>
          <SingleFilter name={"Danie główne"} v={1} l={_type} choosed={_type.indexOf(1) != -1}/>
          <SingleFilter name={"Przekąska"} v={2} l={_type} choosed={_type.indexOf(2) != -1}/>
          <SingleFilter name={"Sałatka"} v={3} l={_type} choosed={_type.indexOf(3) != -1}/>
          <SingleFilter name={"Zupa"} v={4} l={_type} choosed={_type.indexOf(4) != -1}/>
          <SingleFilter name={"Deser"} v={5} l={_type} choosed={_type.indexOf(5) != -1}/>
          <SingleFilter name={"Ciasto"} v={6} l={_type} choosed={_type.indexOf(6) != -1}/>
        </div>
        <div className="line" />
        <div className="filter-cont">
          <p>Długość przygotowania</p>
          <SingleFilter name={"szybki"} v={1} l={_speed} choosed={_speed.indexOf(1) != -1}/>
          <SingleFilter name={"średni"} v={2} l={_speed} choosed={_speed.indexOf(2) != -1}/>
          <SingleFilter name={"długi"} v={3} l={_speed} choosed={_speed.indexOf(3) != -1}/>
        </div>
        <div className="line" />
        <div className="filter-cont">
          <p>Stopień trudności</p>
          <SingleFilter name={"łatwe"} v={1} l={_lvl} choosed={_lvl.indexOf(1) != -1}/>
          <SingleFilter name={"średnie"} v={2} l={_lvl} choosed={_lvl.indexOf(2) != -1}/>
          <SingleFilter name={"trudne"} v={3} l={_lvl} choosed={_lvl.indexOf(3) != -1}/>
        </div>
        <div className="line" />
        <div className="filter-cont">
          <p>Premium</p>
          <div className="filter-box">
            <div>Wyświetl tylko przepisy użytkowników premium</div>
            <div onClick={() => setPremium(!_premium)}>
              {
              _premium ? <div className="checkmarkBox"><img className="checkmark" src={"http://localhost:3001/images/static/checkmark.png"} alt="wybrano"/></div>
                : 
              <div className="checkmarkBox"> </div>
              }
            </div>
          </div>
        </div>
        <div className="line" />
        <div className="filter-cont">
          <p>Tagi</p>
          <TagsFilter />
        </div>        
        <div id="filterButton" onClick={() => {getRecipes()}}>Zastosuj</div>
      </div>
    )
  }
  
  const getRecipes = () => fetch(`${API_ADDRESS}/recipes?${_type.length > 0 ? "type=" + _type.join(",") + "&": ""}${_speed.length > 0 ? "speed=" + _speed.join(",") + "&": ""}${_lvl.length > 0 ? "lvl=" + _lvl.join(",") + "&": ""}${_TAGS.length > 0 ? "tags=" + _TAGS.join(",").replace("#","") + "&": ""}${_premium ? "premium=1" : ""}`, {
      method: 'get',
      headers: { 
          'Access-token': USER.token,
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
        if(d.error == 0) setRecipesData(d.data);
        else setRecipes(<h1 style={{color: "red"}}>{d.errorMSG}</h1>)
    })
    .catch(err => {
      console.log(err);
    });

    useEffect(() => {
      getRecipes();
      refreshTags();
    },[]);

    useEffect(() => {
      setRecipes(createRecipeList(recipesData, filtr));
    },[recipesData, filtr])


    return (
      <div className="mainDiv">
        {/*
          <div className="siteTitle">
          <h2>RecipeList</h2>
        </div>
        */}
        <div className="search">
          <p>Wyszukiwarka przepisów</p>
          <input type="text" placeholder={"wyszukaj przepis"} onChange={(v) => setFiltr(v.target.value)}></input>
          <div style={{width:"75px"}}/>
          <div className="newRecipeButton" onClick={() => window.location.assign("/recipe/new")}>
          <Buttons.AddRecipeButton />
        </div>
        </div>
        <div className="md">
          <div style={{display:"flex", flexDirection:"row"}}>
            <div style={{display:"flex"}}>
              <Filter />
            </div>
            <div className="recipesCont" >
              {recipes}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default RecipeList;