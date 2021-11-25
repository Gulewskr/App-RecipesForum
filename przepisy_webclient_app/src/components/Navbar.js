import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from '../data/User';

const Navbar = () => {
    const { USER, LogOut } = useContext(UserContext);
    /* wersja bez używania komponentów react-router-dom */
    return (
      <ul>
        <li onClick={() => window.location.assign("/")}><div> Home </div></li>
        <li onClick={() => window.location.assign("/recipes")}><div> Lista przepisów </div></li>
        {
          USER.id ? 
          <>
          <li onClick={() => window.location.assign("/profile?id=" + USER.id)}><div>Profil użytkownika</div></li>
          <li onClick={LogOut}><div className="logout_button">Wyloguj</div> </li>
          </>
            :
          <>
            <li onClick={() => window.location.assign("/login")}><div>Logowanie</div></li>
            <li onClick={() => window.location.assign("/register")}><div>Rejestracja</div></li>
          </>
        }
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