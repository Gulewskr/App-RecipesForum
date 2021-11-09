import React, {useState, useContext} from 'react';
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

  const Form = () => {
    const [_loginError, setError] = useState(0);
    const [_name, setName] = useState("");
    const [_tag, setTags] = useState("");
    const [_text, setText] = useState("");
    const [_type, setType] = useState(1);
    const [_speed, setSpeed] = useState(1);
    const [_lvl, setLVL] = useState(1);


    const tryCreateNewRecipe = () => {
    fetch(`${API_ADDRESS}/recipe`, {
      method: 'post',
      headers: { 'Content-Type' : 'application/json',
                'access-token'  : USER.token },
      body: JSON.stringify({
        name: _name,
        text: _text,
        tags: _tag,
        type: _type,
        speed: _speed,
        lvl: _lvl
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

  const handleSubmit = (e) => {
    e.preventDefault();
    tryCreateNewRecipe();
  }

  const ErrorText = () => {
    switch(_loginError){
      case 0:
        return(<></>);
      case 1:
        return(<div className="error-text">Błędny login lub hasło</div>);
      case 2:
        return(<div className="error-text">Błąd serwera</div>);
      default:
        return(<></>);
    }
  }

  return(
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={v => setName(v.target.value)} name="username" placeholder="nazwa przepisu" autoComplete="off" required/>
        <input type="text" onChange={v => setTags(v.target.value)} name="username" placeholder="tagi" autoComplete="off" required/>
        <p>Rodzaj dania</p>
        <select value={_type} onChange={v => setType(v.target.value)}>            
          <option value={1}>Danie główne</option>
          <option value={2}>Przekąska</option>
          <option value={3}>Sałatka</option>
          <option value={4}>Zupa</option>
          <option value={5}>Deser</option>
          <option value={6}>Ciasto</option>
        </select>
        <p>Czas przygotowania</p>
        <select value={_speed} onChange={v => setSpeed(v.target.value)}>            
          <option value={1}>krótki</option>
          <option value={2}>średni</option>
          <option value={3}>długi</option>
        </select>
        <p>Stopień zaawansowania dania</p>
        <select value={_lvl} onChange={v => setLVL(v.target.value)}>            
          <option value={1}>łatwe</option>
          <option value={2}>średnie</option>
          <option value={3}>trudne</option>
        </select>
        <p>Dodaj zdjęcia do przepisu</p>
        <input type="image" />
        <input type="text" onChange={v => setText(v.target.value)} name="password" placeholder="treść" autoComplete="off"  required />
        <input type="submit"/>
      </form>
      <ErrorText />
    </div>
  );
}

    return (
      <div>
        <h2>Formularz nowego przepisu</h2>
        <Form />
      </div>
    );
  }
  
  export default RecipeNew;