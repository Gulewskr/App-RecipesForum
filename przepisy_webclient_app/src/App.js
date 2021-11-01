import React, {useState, useContext} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Home, Login, Profile, Register, Recipe, RecipeNew,  RecipesList } from './routes';
import { Navbar } from './components';

//DATA
import {API_ADDRESS} from './data/API_VARIABLES';
import UserContextProvider , {UserContext} from './data/User';

//Styles
import './styles/App.scss';

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

  return (
    <Router>
    <UserContextProvider>
      {/*<div className="login-form">
        div>/ <h1>⚡ Elektryzujące ⚡ <br> 🍳 Przepisy 🍳</h1> 
        <h1>👹 Boxdelowe ⛄ <br/> 🍨 LOUUUUDY 🍨</h1>
      </div>*/}
      <Hdr/>
      <Navbar />
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
          {/* TODO - naprawić żeby dobrze przekierowywało bo przekierowywuje źle sadge :( */}
          <Route path="/recipe/new" >
            <RecipeNew />
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
