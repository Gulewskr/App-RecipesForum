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
    const [_type, setType] = useState(0);


    const tryCreateNewRecipe = () => {
    fetch(`${API_ADDRESS}/recipe`, {
      method: 'post',
      headers: { 'Content-Type' : 'application/json',
                'access-token'  : USER.token },
      body: JSON.stringify({
        name: _name,
        text: _text,
        tags: _tag,
        type: 1
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
        <select value={_type} onChange={v => setType(v.target.value)}>            
            <option value={0}>Danie główne</option>
            <option value={1}>Przekąska</option>
            <option value={2}>Sałatka</option>
            <option value={3}>Zupa</option>
            <option value={4}>Deser</option>
            <option value={5}>Ciasto</option>
          </select>
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