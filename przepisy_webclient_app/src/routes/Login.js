import React, {useState, useContext} from 'react';
//DATA
import {API_ADDRESS} from '../data/API_VARIABLES';
import {UserContext} from '../data/User';
import {validationLoginForm} from '../data/Validation';
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
        if(data.error == 0)
        {
          if(data.token)
          {
            setToken(data.token);
            return true;
          }
          console.log("błędny format danych z serwera");
        }
        if(data.error) setLoginError(data.error);
        return false;
      })
      .then(
        (bool) => bool ? window.location.replace('/home') : console.log("Błąd logowania")
      )
      .catch(err => {
        console.log(err);
      });
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      //let val = validationLoginForm(e.target["username"].value, e.target["password"].value);
      let val = validationLoginForm(_username, _password);
      if(!val.error){
        tryLogin();
      }else{
        alert(val.errorMSG);
      }
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
            <div style={{height: 10}} />
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