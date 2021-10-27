import React, {useState} from 'react';
import {API_ADDRESS} from './API_VARIABLES';
import './App.css';

const App = () => {
  const [token, setToken] = useState(0);
  const [_username, setUsername] = useState(0);
  const [_password, setPassword] = useState(0);
  const [_loginError, setLoginError] = useState(0);


  //console.log(session);
  
  const tryLogin = () => {
    fetch(`${API_ADDRESS}/auth`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username : _username,
        password : _password,
        token : token
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
      if(data.token) setToken(data.token);
      if(data.error !== undefined){
        setLoginError(data.error);
      }
    })
    .then(
    )
    .catch(err => {
      console.log(err);
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    tryLogin();
  }

  const ErrorText = () => {
    switch(_loginError){
      case 0:
        return(<></>);
      case 1:
        return(<div class="error-text">Błędny login lub hasło</div>);
      case 2:
        return(<div class="error-text">Błąd serwera</div>);
      default:
        return(<></>);
    }
  }

  return (
    <div class="login-form">
      {/*div>/ <h1>⚡ Elektryzujące ⚡ <br> 🍳 Przepisy 🍳</h1> */}
      <h1>👹 Boxdelowe ⛄ <br/> 🍨 LOUUUUDY 🍨</h1>
      <h1>token: {token}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={v => setUsername(v.target.value)} name="username" placeholder="login" autocomplete="off" required/>
        <input type="password" onChange={v => setPassword(v.target.value)} name="password" placeholder="hasło" autocomplete="off"  required />
        <input type="submit"/>
      </form>
      <ErrorText />
    </div>
  );
}

export default App;
