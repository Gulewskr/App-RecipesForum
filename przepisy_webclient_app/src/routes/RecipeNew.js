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
    const [_username, setUsername] = useState(0);
    const [_password, setPassword] = useState(0);
    const [_loginError, setError] = useState(0);


    const tryCreateNewRecipe = () => {
    fetch(`${API_ADDRESS}/recipe`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        //TODO
        token : USER.token
      }),
    })
    .then( res => {
      try{
        console.log(res);
        
        return res.json();
      }catch (err){
        console.log(err);
      };
    })
    .then((data) => {
        //data = id nowego przepisu
      if(data.id)
      {
        window.location.replace("/recipe?id=" + data.id);
      }
      if(data.error !== undefined){
        setError(data.error);
      };
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
        <input type="text" onChange={v => setUsername(v.target.value)} name="username" placeholder="login" autoComplete="off" required/>
        <input type="password" onChange={v => setPassword(v.target.value)} name="password" placeholder="hasło" autoComplete="off"  required />
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