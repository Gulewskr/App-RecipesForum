import React, {useContext, useEffect, useState } from "react";
//DATA
import {API_ADDRESS} from '../data/API_VARIABLES';
import {UserContext} from '../data/User';
import {validationRegisterForm} from '../data/Validation'
//Styles
import '../styles/App.scss';

/*
TODO
Walidacja danych:
  -czy hasła te same
  -czy brak znaków niedozwolonych
  -czy hasło spełnia wymogi
  -czy format email poprawny
  -czy nick poprawny
*/

const Register = () => {
    const { USER, setToken, setUser } = useContext(UserContext);
    if(USER.nick != undefined)
    {
      window.location.replace('/home');        
    }

    const RegisterForm = () => {
        const [_username, setUsername] = useState(0);
        const [_password, setPassword] = useState(0);
        const [_repPassword, setRepPassword] = useState(0);
        const [_nick, setNick] = useState(0);
        const [_email, setEmail] = useState(0);
        const [_loginError, setLoginError] = useState(0);

        const tryRegister = () => {
        if(_password === _repPassword){
          fetch(`${API_ADDRESS}/register`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username : _username,
              password : _password,
              nick: _nick,
              email: _email
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
            }else{
              setLoginError(data.error);
            };
          })
          .then((bool) => {
            if(bool)
            {
              console.log("Token " + USER.token);
              window.location.replace('/home');
            }else{
              console.log("Błąd rejestracji");
            }
          })
          .catch(err => {
            console.log(err);
          });
        }else{

        }
      }
    
      const handleSubmit = (e) => {
        e.preventDefault();
        let val = validationRegisterForm(_username, _password, _nick, _email);
        if(!val.error){
          tryRegister();
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
            <input type="text" onChange={v => setNick(v.target.value)} name="username" placeholder="nazwa użytkownika" autoComplete="off" required/>
            <input type="text" onChange={v => setUsername(v.target.value)} name="username" placeholder="login" autoComplete="off" required/>
            <input type="password" onChange={v => setPassword(v.target.value)} name="password" placeholder="hasło" autoComplete="off"  required />
            <input type="password" onChange={v => setRepPassword(v.target.value)} name="password" placeholder="powtórz hasło" autoComplete="off"  required />
            <input type="text" onChange={v => setEmail(v.target.value)} name="username" placeholder="email" autoComplete="off" required/>
            <input type="submit"/>
          </form>
          <ErrorText />
        </div>
      );
    }

    return (
      <div>
        <h2>Register</h2>
        <RegisterForm />
      </div>
    );
  }
  
  export default Register;