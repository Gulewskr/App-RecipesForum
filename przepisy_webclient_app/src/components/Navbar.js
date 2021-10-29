import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from '../data/User';

const Navbar = () => {
    const { USER, LogOut } = useContext(UserContext);
    return (
        <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {
            USER.nick ? 
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
            <Link to="/profile">Profil użytkownika</Link>
          </li>
          <li>
            <Link to="/recipe">Przepis</Link>
          </li>
          <li>
            <Link to="/recipes">Lista przepisów</Link>
          </li>
        </ul>
      </nav>
    );
  }
  
  export default Navbar;