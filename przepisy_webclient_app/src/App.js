import React, {useState, useContext, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Home, Login, Profile, Register, Recipe, RecipeNew,  RecipesList } from './routes';
import { Navbar } from './components';

//DATA
import {UserContext} from './data/User';

//Styles
import './styles/App.scss';
import './styles/TypeUser.scss';
import './styles/Navbar.scss';
import './styles/Form.scss';
import './styles/Filter.scss';
import './styles/CommentComponent.scss';
import './styles/RecipeComponent.scss';
import './styles/ProfileSite.scss';
import './styles/RecipeSite.scss';
import './styles/Other.scss';

const App = () => {

  const { USER, token } = useContext(UserContext);

  const Hdr = () => {
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
      {/*<div className="login-form">
        div>/ <h1>⚡ Elektryzujące ⚡ <br> 🍳 Przepisy 🍳</h1> 
        <h1>👹 Boxdelowe ⛄ <br/> 🍨 LOUUUUDY 🍨</h1>
      </div>*/}
      <div style={{display:'none'}}>
        <Hdr/>
      </div>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="siteContent">
      <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/profile">
            <Profile user={USER} token={token} />
          </Route>
          <Route exact path="/recipe">
            <Recipe user={USER} token={token} />
          </Route>
          {/* TODO - naprawić żeby dobrze przekierowywało bo przekierowywuje źle sadge :( */}
          <Route exact path="/recipe/new" >
            <RecipeNew user={USER} token={token} />
          </Route>
          <Route path="/recipes">
            <RecipesList user={USER} token={token} />
          </Route>
          <Route path="/">
            <Home token={token} />
          </Route>
        </Switch>
        </div>
    </Router>
    );
}

export default App;
