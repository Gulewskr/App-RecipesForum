import React, {useState, useContext} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Home, Login, Profile, Register, Recipe, RecipesList } from './routes';
import { Navbar } from './components';

//DATA
import {API_ADDRESS} from './data/API_VARIABLES';
import UserContextProvider , {UserContext} from './data/User';

//Styles
import './App.css';

const App = () => {

  const Hdr = () => {
    const { USER } = useContext(UserContext);
    return (
      <>
        <h1>nick: {USER.nick}</h1>
        <h1>typ konta: {USER.type}</h1>
        <h1>token: {USER.token}</h1>
      </>
    );
  }

  const LoginForm = () => {
      const [_username, setUsername] = useState(0);
      const [_password, setPassword] = useState(0);
      const [_loginError, setLoginError] = useState(0);

      const { USER, setToken, setNick, setType } = useContext(UserContext);

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
        if(data.token) setToken(data.token);
        if(data.error !== undefined){
          setLoginError(data.error);
        };
        if(data.nick) setNick(data.nick);
        if(data.lvl) setType(data.lvl);
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
          return(<div className="error-text">Błędny login lub hasło</div>);
        case 2:
          return(<div className="error-text">Błąd serwera</div>);
        default:
          return(<></>);
      }
    }

    return(
      <>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={v => setUsername(v.target.value)} name="username" placeholder="login" autoComplete="off" required/>
        <input type="password" onChange={v => setPassword(v.target.value)} name="password" placeholder="hasło" autoComplete="off"  required />
        <input type="submit"/>
      </form>
        <ErrorText />
      </>
    );
  }



  return (
    <Router>
    <UserContextProvider>
      <div className="login-form">
        {/*div>/ <h1>⚡ Elektryzujące ⚡ <br> 🍳 Przepisy 🍳</h1> */}
        <h1>👹 Boxdelowe ⛄ <br/> 🍨 LOUUUUDY 🍨</h1>
        <Hdr/>
        <LoginForm />
      </div>
      <Navbar />
        {/* { Home, Login, Profile, Register, Recipe, RecipesList } */}
      <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/recipe">
            <Recipe />
          </Route>
          <Route path="/recipes">
            <RecipesList />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </UserContextProvider>
    </Router>
    );
}

export default App;
