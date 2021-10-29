import React, {useState, useContext} from 'react';
//DATA
import {API_ADDRESS} from '../data/API_VARIABLES';
import {UserContext} from '../data/User';
//Styles
import '../styles/App.scss';

const Login = () => {

  const LoginForm = () => {
    const [_username, setUsername] = useState(0);
    const [_password, setPassword] = useState(0);
    const [_loginError, setLoginError] = useState(0);

    const { USER, setUser, setToken } = useContext(UserContext);

    const tryLogin = () => {
    fetch(`${API_ADDRESS}/auth`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username : _username,
        password : _password,
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
      if(data.token && data.nick && data.lvl)
      {
        setUser({
          nick: data.nick,
          type: data.type,
          token: data.token
        });
        setToken(data.token);
      }
      if(data.error !== undefined){
        setLoginError(data.error);
      };
    })
    .then(
      () => window.location.replace('/home')
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
        <h2>Login</h2>
        <LoginForm />
      </div>
    );
  }
  
  export default Login;