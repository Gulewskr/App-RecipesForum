import { useContext, useEffect, useState } from "react";
import { Buttons, Recipe } from "../components";
import {UserContext} from '../data/User';
import { API_ADDRESS } from "../data/API_VARIABLES";

const Profile = () => {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')

  const { USER } = useContext(UserContext);
  const [data, setData] = useState("");

  const owner = data !== "" ? data.own === true : false;
  const nick = data !== "" ? data.name : "null";
  const email = data !== "" ? data.email : "null";
  const type = data !== "" ? data.type : "null";
  const recipeNum = data !== "" ? data.rn : 0;
  const commentNum = data !== "" ? data.cn : 0;
  const avgScore = data !== "" ? data.scr : 0;

  //const [userData, setUserData] = useState(undefined);
  //const [editUserData, setEUserData] = useState(undefined);
  const [editPassword, setEPassword] = useState(undefined);
  const [edit, setEditting] = useState(false);

  const resetEdit = () =>
  {
    setEditting(false);
    //setEUserData(userData);
  };

  const saveChange = () =>
  {
    setEditting(false);
    //przesłanie na serwer

    //jak git to zamień jak nie to błąd wyświetl
    //setUserData(editUserData);
  };

  const EditUserData = () => {

    return (
      <div>
        <button onClick={() => resetEdit()} />
        <h3>Edycja danych</h3>
        <button onClick={() => saveChange()} />
      </div>
    );
  };


  return (
    <div>
      <h2>Profile</h2>
      <h1>AVATAR??</h1>
      <h1>{USER.nick}</h1>
      <h1>email {email}</h1>
      {
        owner ? 
          edit 
            ? 
          <EditUserData />
            :
          <button onClick={() => setEditting(true)} />
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