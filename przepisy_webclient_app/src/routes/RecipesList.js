import { useContext, useEffect, useMemo, useState } from "react";
import { Buttons, RecipeComp, createRecipeList } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";
import UF from "../data/UserTypes";

const RecipeList = () => {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  //Do filtrowania
  //const type = urlParams.get('type')
  //const tags = urlParams.get('tags')

  const { _type, _lvl, _speed, _TAGS } = useMemo(() => ({
    _type: [],
    _lvl: [],
    _speed: [],
    _TAGS: []
  }), []);
  const [ allTags, setAllTags ] = useState([]);
  const [_premium, setPremium] = useState(false);

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
      <div>
        <h1>Filtry</h1>
        <p>Typ</p>
        <SingleFilter name={"Danie główne"} v={1} l={_type} choosed={_type.indexOf(1) != -1}/>
        <SingleFilter name={"Przekąska"} v={2} l={_type} choosed={_type.indexOf(2) != -1}/>
        <SingleFilter name={"Sałatka"} v={3} l={_type} choosed={_type.indexOf(3) != -1}/>
        <SingleFilter name={"Zupa"} v={4} l={_type} choosed={_type.indexOf(4) != -1}/>
        <SingleFilter name={"Deser"} v={5} l={_type} choosed={_type.indexOf(5) != -1}/>
        <SingleFilter name={"Ciasto"} v={6} l={_type} choosed={_type.indexOf(6) != -1}/>
        <p>Długość przygotowania</p>
        <SingleFilter name={"szybki"} v={1} l={_speed} choosed={_speed.indexOf(1) != -1}/>
        <SingleFilter name={"średni"} v={2} l={_speed} choosed={_speed.indexOf(2) != -1}/>
        <SingleFilter name={"długi"} v={3} l={_speed} choosed={_speed.indexOf(3) != -1}/>
        <p>Stopień trudności</p>
        <SingleFilter name={"łatwe"} v={1} l={_lvl} choosed={_lvl.indexOf(1) != -1}/>
        <SingleFilter name={"średnie"} v={2} l={_lvl} choosed={_lvl.indexOf(2) != -1}/>
        <SingleFilter name={"trudne"} v={3} l={_lvl} choosed={_lvl.indexOf(3) != -1}/>
        <p>Tagi</p>
        <TagsFilter />
        <p>Tylko Premium</p>
        <div onClick={() => setPremium(!_premium)}>
          {_premium ? <a  style={{"color" : "green"}}>Wybrano</a> : <a  style={{"color" : "orange"}}>Nie wybrano</a>}
        </div>
        <div onClick={() => { console.log(`${API_ADDRESS}/recipes?${_type.length > 0 ? "type=" + _type.join(",") + "&": ""}${_speed.length > 0 ? "speed=" + _speed.join(",") + "&": ""}${_lvl.length > 0 ? "lvl=" + _lvl.join(",") + "&": ""}${_TAGS.length > 0 ? "tags=" + _TAGS.join(",") + "&": ""}${_premium ? "premium=1" : ""}`);
          getRecipes()}}>Zastosuj</div>
      </div>
    )
  }
  


  const { USER } = useContext(UserContext);
  const [recipes, setRecipes] = useState("Brak przepisów");

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
        if(d.error == 0) setRecipes(createRecipeList(d.data));
        else setRecipes(<h1 style={{color: "red"}}>{d.errorMSG}</h1>)
    })
    .catch(err => {
      console.log(err);
    });

    useEffect(() => {
      getRecipes();
      refreshTags();
    },[]);


    return (
      <div>
        <h2>RecipeList</h2>
        <Filter />
        <Buttons.AddRecipeButton />{/* id, id_user, name, text, type */}
        {recipes}
      </div>
    );
  }
  
  export default RecipeList;