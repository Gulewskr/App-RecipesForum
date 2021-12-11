import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Buttons, Recipe, ProfileImagesForm, createRecipeList } from "../components";
import {UserContext} from '../data/User';
import {validationPasswordChange, validationRProflieForm} from '../data/Validation'
import { API_ADDRESS } from "../data/API_VARIABLES";

const Profile = (props) => {
 
  const {user, token} = props;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')

  //const { USER, token } = useContext(UserContext);
  const [data, setData] = useState("");
  const [dataRecipies, setDataRecipies] = useState([]);
  const [recipiesObject, setRecipiesObject] = useState(<></>);

  const {owner, mod, nick, email, type, image, recipeNum, commentNum, avgScore} = useMemo(
    () => {console.log(data); return({
      owner : data !== "" ? data.own === true : false, 
      mod : data !== "" ? data.mod === true : false, 
      nick : data !== "" ? data.name : "null", 
      email : data !== "" ? data.email : "null", 
      type : data !== "" ? data.type : "null", 
      image : data !== "" ? data.image ? data.image : {id : 0, imageURL : ""} : {id : 0, imageURL : ""},
      recipeNum : data !== "" ? data.recipeNum : 0, 
      commentNum : data !== "" ? data.commentNum : 0, 
      avgScore : data !== "" ? data.avgScore != null ? data.avgScore : 0 : 0
    })}, [data]);

  const [editPassword, setEPassword] = useState(undefined);
  const [editProfile, setEProfile] = useState(false);
  const [edit, setEditting] = useState(false);

  //ProfileImagesForm
  useEffect(() => {
    refreshData();
  }, [id, token]);

  useEffect(() => {
    setRecipiesObject(createRecipeList( dataRecipies ));
  }, [dataRecipies])

  const refreshData = () => {
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

      fetch(`${API_ADDRESS}/profile/recipies?id=${id}`, {
        method: 'get',
        headers: { 
          'Access-token': token,
          'Content-Type': 'application/json' 
        },
      })
      .then( res => {
        try{
          return res.json();
        }catch (err){
          console.log(err);
        };
      })
      .then((d) => {
        console.log(d);
        if(d.error == 0) setDataRecipies(d.data);
        else setDataRecipies(<h1 style={{color: "red"}}>{d.errorMSG}</h1>)
      })
      .catch(err => {
        console.log(err);
      });
    }else{
      console.log("brak id profilu");
    }
  }

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

    const handleSubmit = (e) => {
      e.preventDefault();
      let val = validationRProflieForm(newNick, newEmail);
      if(!val.error){
        saveChange();
      }else{
        alert(val.errorMSG);
      }
    }

    return (
      <div>
          <div id="formButtonCont">
                        <div onClick={() => resetEdit()}> Anuluj </div>
          </div>
          <h3>Edycja danych</h3>
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <input type="text" onChange={v => setNewNick(v.target.value)} name="username" value={newNick} placeholder="nazwa użytkownika" required/>
              <div style={{height: "10px"}} />
              <input type="text" onChange={v => setNewEmail(v.target.value)} name="password" value={newEmail} placeholder="email"  required />
              <input type="submit"/>
            </form>
          </div>
        {/*<a className="przycisk" onClick={() => saveChange()}> Zapisz </a>*/}
      </div>
    );
  };

  const DeleteAccount = () => {
    const [v, setV] = useState(false);

    const deleteAcc = () => {
      fetch(`${API_ADDRESS}/profile?id=${id}`, {
        method: 'delete',
        headers: { 
          'Access-token': token,
          'Content-Type': 'application/json' 
        }
      })
      .then( res => {
        try{
          //jak git to zamień jak nie to błąd wyświetl
          if(res.status == 200){
            console.log("usunięto");
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
        {v ? 
          <div className="confirm_field">
            <p><b>Czy na pewno chcesz usunąć konto?</b><br /> (tej operacji nie da się cofnąć, usunięte zostaną również wszelkie przepisy i komentarze)</p>
            <div id="buttons">
                <div onClick={() => setV(false)}>Anuluj</div>
                <div onClick={() => deleteAcc()}>Usuń</div>
              </div>
          </div>
          :
          <div id="ACCDelButt" onClick={() => setV(true)}>USUŃ KONTO</div>
        }
      </div>
    );
  }

  const EditPasswdData = () => {
    const [oldPasswd, setOldPasswd] = useState("");
    const [newPasswd, setNewPasswd] = useState("");
    const [newPasswdR, setNewPasswdR] = useState("");

    const resetEdit = () =>
    {
      setEPassword(false);
    };

    const saveChange = () =>
    {
      if(newPasswd == newPasswdR)
      {
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
          if(res.status == 200){
            setEPassword(false);
            console.log("powodzenie zmiany hasła");
            return {error: 0}
          }else{
            //TODO wyświetl błąd
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

    const handleSubmit = (e) => {
      e.preventDefault();
      let val = validationPasswordChange(newPasswd);
      if(!val.error){
        saveChange();
      }else{
        alert(val.errorMSG);
      }
    }

    return (
      <div>
        <div id="formButtonCont">
                        <div onClick={() => resetEdit()}> Anuluj </div>
          </div>
          <h3>Edycja hasła</h3>
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <input type="password" onChange={v => setOldPasswd(v.target.value)} name="username" placeholder="stare hasło" required/>
              <div style={{height: "10px"}} />
              <input type="password" onChange={v => setNewPasswd(v.target.value)} name="password" placeholder="nowe hasło"  required />
              <div style={{height: "10px"}} />
              <input type="password" onChange={v => setNewPasswdR(v.target.value)} name="password" placeholder="powtórz nowe hasło"  required />
              <input type="submit"/>
            </form>
          </div>
      </div>
    );
  };

  const AvatarSettings = () => {
    const EditProfilePicture = (v) => 
    {
        if(v != "")
        {
          fetch(`${API_ADDRESS}/profile/image?id=${id}`, {
            method: 'put',
            headers: { 
              'Access-token': token,
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              image : v
            })
          })
          .then( res => {
            try{
              if(res.status == 200){
                console.log("powodzenie zmiany danych");
                refreshData();
                setEProfile(false);
              }else{
                console.log(res);
              }
            }catch (err){
              console.log(err);
            };
          })
          .catch(err => {
            console.log(err);
          });
        }
    }

    return(
      <div id="avatarCont">
        <div>
        {
          ( owner || mod ) && editProfile && 
          <div id="editFormCont">
            <div>
              <div id="background"></div>
              <div id="editFormInCont" style={{overflow: "hidden", position: "relative", display: "flex", justifyContent: "center"}}>
                <div style={{position: "relative", width: "98%"}} >
                  <ProfileImagesForm image={image} postAddress={'/imagesProfile'} token={token} cb={EditProfilePicture} />
                  <div id="CancImage" onClick={ () => setEProfile(false) }>Anuluj zmianę</div>
                </div>
              </div>
            </div>
          </div>
        }
        {
          ( owner || mod ) && <div className="imgButt" onClick={ () => setEProfile(true) }>Edytuj zdjęcie profilowe</div>
        }
        </div>
        <img  src={image.imageURL ? image.imageURL : "http://localhost:3001/images/static/profile.png"} alt={"obraz użytkownika"}/><br/>
      </div>
    )
  }
  
  return (
    <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
      <div id="recipeHead">
        <div id="mainImageContainer">
          <div className="profileBorder" id="avatarBorder" style={{flexDirection: "column"}}>
                <AvatarSettings />
          </div>
        </div>
      </div>
      <div className="profileBorder" style={{flexDirection: "column"}}>
        <div style={{marginLeft:"30px"}}>
          <h1>{nick}</h1>
          <h1>email {email}</h1>
          {
            ( owner || mod ) &&
              <div>
                <div id="EditInfoButt" onClick={() => setEditting(true)}> Edytuj dane </div>
                <div id="EditPassButt" onClick={() => setEPassword(true)}> Zmień hasło </div>
              </div>
          }
          {edit &&
            <div id="editFormCont">
              <div>
                <div id="background"></div>
                <div id="editFormInCont" style={{overflow: "hidden", position: "relative"}}>
                  <EditUserData />
                  <DeleteAccount />
                </div>
              </div>
            </div>}
          {editPassword &&
            <div id="editFormCont">
              <div>
                <div id="background"></div>
                <div id="editFormInCont" style={{overflow: "hidden"}}>
                  <EditPasswdData />
                </div>
              </div>
            </div>}
          </div>
      </div>
      <div className="profileBorder" style={{flexDirection: "column"}}>
        <p style={{marginLeft: "30px"}}>Statystyki użytkownika <b>{nick}</b></p>
        <div id="statTable" style={{margin: "10px", marginTop:"0", marginLeft: "30px"}}>
            <div style={{display: "flex", flexDirection: "row"}}><div style={{width:"200px"}}>Liczba przepisów:</div> <div>{recipeNum}</div></div>
            <div style={{display: "flex", flexDirection: "row"}}><div style={{width:"200px"}}>Średnia ocena:</div>    <div>{avgScore}</div></div>
            <div style={{display: "flex", flexDirection: "row"}}><div style={{width:"200px"}}>Liczba komentarzy:</div><div>{commentNum}</div></div>
            <div style={{display: "flex", flexDirection: "row"}}><div style={{width:"200px"}}>Status:</div>           <div>{type}</div></div>
        </div>
      </div>
      <div className="profileBorder" id="profileBorderRecipies" >
        <p>Przepisy użytkownika <b>{nick}</b></p>
        {recipiesObject}
      </div>
    </div>
  );
}

export default Profile;