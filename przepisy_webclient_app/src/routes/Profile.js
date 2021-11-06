import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Buttons, Recipe } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";

const Profile = (props) => {
  //TODO: 
  // -przycisk dezaktywowanie konta
  // -formularze edycji konta
  // -formularz edycji hasła
  // -przesłanie żądań na serwer

  const {user, token} = props;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')

  //const { USER, token } = useContext(UserContext);
  const [data, setData] = useState("");

  const {owner, mod, nick, email, type, recipeNum, commentNum, avgScore} = useMemo(
    () => {console.log(data); return({
      owner : data !== "" ? data.own === true : false, 
      mod : data !== "" ? data.mod === true : false, 
      nick : data !== "" ? data.name : "null", 
      email : data !== "" ? data.email : "null", 
      type : data !== "" ? data.type : "null", 
      recipeNum : data !== "" ? data.rn : 0, 
      commentNum : data !== "" ? data.cn : 0, 
      avgScore : data !== "" ? data.scr : 0
    })}, [data]);

  const [editPassword, setEPassword] = useState(undefined);
  const [edit, setEditting] = useState(false);

  useEffect(() => {
    if(id){
      fetch(`${API_ADDRESS}/profile?id=${id}`, {
        method: 'get',
        headers: { 
          'Access-token': token,
          'Content-Type': 'application/json' 
        },
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
        setData(data);
      })
      .catch(err => {
        console.log(err);
      });
    }else{
      console.log("brak id profilu");
    }
  }, [id, token]);

  const EditUserData = () => {
    const [newNick, setNewNick] = useState(nick);
    const [newEmail, setNewEmail] = useState(email);


    const resetEdit = () =>
    {
      setEditting(false);
      //setEUserData(userData);
    };

    const saveChange = () =>
    {
      setEditting(false);
      //przesłanie na serwer
      fetch(`${API_ADDRESS}/profile?id=${id}`, {
        method: 'put',
        headers: { 
          'Access-token': token,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          nick: newNick,
          email: newEmail
        })
      })
      .then( res => {
        try{
          //jak git to zamień jak nie to błąd wyświetl
          if(res.status == 200){
            console.log("powodzenie zmiany danych");
            setData({
              own : owner,
              mod : mod,
              name : newNick,
              email : newEmail,
              type : type,
              error : 0,
              errorMSG : ""
            });
            return {error: 0}
          }else{
            console.log(res);
          }
          return res.json();
        }catch (err){
          console.log(err);
        };
      })
      .then((data) => {
        if(data.error == 1)
          console.log(data.errorMSG);
      })
      .catch(err => {
        console.log(err);
      });
    };

    return (
      <div>
        <a className="przycisk" onClick={() => resetEdit()}> Anuluj </a>
          <h3>Edycja danych</h3>
          <div className="login-form">
            <form onSubmit={saveChange}>
              <input type="text" onChange={v => setNewNick(v.target.value)} name="username" value={newNick} placeholder="nazwa użytkownika" required/>
              <input type="text" onChange={v => setNewEmail(v.target.value)} name="password" value={newEmail} placeholder="email"  required />
              <input type="submit"/>
            </form>
          </div>
        {/*<a className="przycisk" onClick={() => saveChange()}> Zapisz </a>*/}
      </div>
    );
  };

  const EditPasswdData = () => {
    const [oldPasswd, setOldPasswd] = useState("");
    const [newPasswd, setNewPasswd] = useState("");
    const [newPasswdR, setNewPasswdR] = useState("");

    const resetEdit = () =>
    {
      setEPassword(false);
      //setEUserData(userData);
    };

    const saveChange = () =>
    {
      setEPassword(false);
      if(newPasswd == newPasswdR)
      {
      //przesłanie na serwer
      fetch(`${API_ADDRESS}/profile/pass?id=${id}`, {
        method: 'put',
        headers: { 
          'Access-token': token,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          passwdOld: oldPasswd,
          passwdNew: newPasswd
        })
      })
      .then( res => {
        try{
          //jak git to zamień jak nie to błąd wyświetl
          if(res.status == 200){
            console.log("powodzenie zmiany hasła");
            return {error: 0}
          }else{
            console.log(res);
          }
          return res.json();
        }catch (err){
          console.log(err);
        };
      })
      .then((data) => {
        if(data.error == 1)
          console.log(data.errorMSG);
      })
      .catch(err => {
        console.log(err);
      });
    };
  }

    return (
      <div>
        <a className="przycisk" onClick={() => resetEdit()}> Anuluj </a>
          <h3>Edycja hasła</h3>
          <div className="login-form">
            <form onSubmit={saveChange}>
              <input type="password" onChange={v => setOldPasswd(v.target.value)} name="username" placeholder="stare hasło" required/>
              <input type="password" onChange={v => setNewPasswd(v.target.value)} name="password" placeholder="nowe hasło"  required />
              <input type="password" onChange={v => setNewPasswdR(v.target.value)} name="password" placeholder="powtórz nowe hasło"  required />
              <input type="submit"/>
            </form>
          </div>
        <a className="przycisk" onClick={() => saveChange()}> Zapisz </a>
      </div>
    );
  };

  return (
    <div>
      <h2>Profile</h2>
      <h1>AVATAR??</h1>
      <h1>{nick}</h1>
      <h1>email {email}</h1>
      {
        owner || mod ? 
          <>
            {edit ? 
            <EditUserData />
              :
            <a className="przycisk" onClick={() => setEditting(true)}> Edytuj dane </a>}
            {editPassword ? 
            <EditPasswdData />
              :
            <a className="przycisk" onClick={() => setEPassword(true)}> Zmień hasło </a>}
          </>
        : 
        <div />
      }
      <p>Dane użytkownika <b>{nick}</b></p>
      <p>Liczba przepisów: {recipeNum}</p>
      <p>Średnia ocena: {avgScore}</p>
      <p>Liczba komentarzy: {commentNum}</p>
      <p>Status: {type}</p>
      <p>Przepisy użytkownika <b>{nick}</b></p>
    </div>
  );
}

export default Profile;