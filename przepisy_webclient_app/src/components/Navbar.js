import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from '../data/User';

const Navbar = () => {
    const { USER, LogOut } = useContext(UserContext);
    /* wersja bez używania komponentów react-router-dom
    */
    return (
      <ul>
        <li onClick={() => window.location.assign("/")}> Home </li>
        {
          USER.id ? 
          <li onClick={LogOut} >Wyloguj</li>
            :
          <>
            <li onClick={() => window.location.assign("/login")}> Logowanie </li>
            <li onClick={() => window.location.assign("/register")}> Rejestracja </li>
          </>
        }
        <li onClick={() => window.location.assign("/profile?id=" + USER.id)}>Profil użytkownika</li>
        <li onClick={() => window.location.assign("/recipes")}> Lista przepisów </li>
      </ul>
    );
   
    /*return (
        <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {
            USER.id ? 
            <li onClick={LogOut} >Wyloguj</li>
              :
            <>
              <li>
                <Link to="/login">Logowanie</Link>
              </li>
              <li>
                <Link to="/register">Rejestracja</Link>
              </li>
            </>
          }
          <li>
            <Link to={"/profile?id=" + USER.id}>Profil użytkownika</Link>
          </li>
          {/*
            <li>
              <Link to="/recipe">Przepis</Link>
            </li>
          /}
          <li>
            <Link to="/recipes">Lista przepisów</Link>
          </li>
        </ul>
      </nav>
    );*/
  }
  
  export default Navbar;