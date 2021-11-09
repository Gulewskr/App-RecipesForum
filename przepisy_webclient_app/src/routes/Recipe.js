import { useContext, useEffect, useMemo, useState } from "react";
import { Buttons, NewCommentForm, SingleComment } from "../components";
import { API_ADDRESS } from "../data/API_VARIABLES";

const Recipe = (props) => {

  const { user, token } = props;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')

  const [edit, setEditting] = useState(false);
  const [data, setData] = useState("");  
  const [score, setScore] = useState(0);
  const [comments, setComments] = useState(<div></div>);  
  
  const {owner, mod, name, text, type, tags} = useMemo(
    () => {console.log(data); return({
      owner : data !== "" ? data.own ? data.own === true : false : false, 
      mod : data !== "" ? data.mod ? data.mod === true : false : false, 
      name : data !== "" ? data.name ? data.name : "null" : "null", 
      text : data !== "" ? data.text ? data.text : "null" : "null", 
      type : data !== "" ? data.type != undefined ? data.type : -1 : -1, 
      tags : data !== "" ? data.tags ? data.tags : "null" : "null"
    })}, [data]);

  const displayComments = (d) => {
    if(d.error == "")
    {
      var res = [];
      d.data.forEach(e => res.push(<SingleComment id={e.id} id_recipe={e.id_recipe} id_user={e.id_user} text={e.text} owner={e.owner} mod={e.mod} token={token} callback={refreshData}/>));
      setComments(res);
    }else{
      setComments(<div>{d.error}</div>);
    }
  }

  const refreshData = () => {
    if(id){
      fetch(`${API_ADDRESS}/recipe?id=${id}`, {
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

      fetch(`${API_ADDRESS}/comments?id=${id}`, {
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
        displayComments(data);
      })
      .catch(err => {
        console.log(err);
      });
    }else{
      console.log("brak id przepisu");
    }
  }

  useEffect(() => {
    refreshData();
  }, [id, token]);


  const EditData = () => {
    const [newName, setNewName] = useState(name);
    const [newText, setNewText] = useState(text);
    const [newType, setNewType] = useState(type);


    const resetEdit = () =>
    {
      setEditting(false);
      //setEuserData(userData);
    };

    const saveChange = () =>
    {
      setEditting(false);
      //przesłanie na serwer
      console.log("nowy przepis:");
      console.log(`nazwa: ${newName} \n Treść:\n  ${newText} \n Typ:  ${newType}`);
      fetch(`${API_ADDRESS}/recipe?id=${id}`, {
        method: 'put',
        headers: { 
          'Access-token': token,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          name: newName,
          text: newText,
          type: newType
        })
      })
      .then( res => {
        try{
          //jak git to zamień jak nie to błąd wyświetl
          if(res.status == 200){
            console.log("powodzenie zmiany danych");
            /*setData({
              own : owner,
              mod : mod,
              name : newName,
              text : newText,
              type : newType,
              tags : tags
            });*/
            refreshData();
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

    const Delete = () => {
      const [v, setV] = useState(false);
  
      const deleteData = () => {
        fetch(`${API_ADDRESS}/recipe?id=${id}`, {
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
          else
            window.location.assign("/recipes");
        })
        .catch(err => {
          console.log(err);
        });
      };
  
      return (
        <div>
          {v ? 
            <div>
              <p>Czy na pewno chcesz usunąć przepis (tej operacji nie da się cofnąć, usunięte zostaną również wszelkie związane komentarze)</p>
              <a onClick={() => setV(false)}>Nie</a>
              <a onClick={() => deleteData()}>Tak usuń konto</a>
            </div>
            :
            <div onClick={() => setV(true)}>USUŃ KONTO</div>
          }
        </div>
      );
    }

    return (
      <div>
        <a className="przycisk" onClick={() => resetEdit()}> Anuluj </a>
          <h3>Edycja danych</h3>
          <div className="login-form">
            <form onSubmit={saveChange}>
              <input type="text" onChange={v => setNewName(v.target.value)} name="username" value={newName} placeholder="nazwa przepisu" required/>
              <input type="text" onChange={v => setNewText(v.target.value)} name="username" value={newText} placeholder="opis" required/>
              <select value={newType} onChange={v => setNewType(v.target.value)}>            
                <option value={0}>Danie główne</option>
                <option value={1}>Przekąska</option>
                <option value={2}>Sałatka</option>
                <option value={3}>Zupa</option>
                <option value={4}>Deser</option>
                <option value={5}>Ciasto</option>
              </select>
              <input type="submit"/>
            </form>
            <Delete />
          </div>
        {/*<a className="przycisk" onClick={() => saveChange()}> Zapisz </a>*/}
      </div>
    );
  };

  const ScoreField = () => {
    const [yourScr, setYourScr] = useState(0);

    const setNewScore = (v) => {
      setYourScr(v);
      //TODO prześlij na serwer
      fetch(`${API_ADDRESS}/score`, {
        method: 'put',
        headers: { 'Content-Type' : 'application/json',
                  'access-token'  : token },
        body: JSON.stringify({
          recipe: id,
          score: v
        }),
      })
      .then( res => {
        try{
          if(res.status == 200)
            return undefined;
          return res.json();
        }catch (err){
          console.log(err);
        };
      })
      .then((data) => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
    }

    return(
      <div>
        <div>
          <p>Ocena przepisu: {score}</p>
          <p>Twoja ocena przepisu: {yourScr ? yourScr : "brak oceny"}</p>
        </div>
        <div>
          <p>Oceń przepis</p>
          <a onClick={() => setNewScore(1)}> 1 </a>
          <a onClick={() => setNewScore(2)}> 2 </a>
          <a onClick={() => setNewScore(3)}> 3 </a>
          <a onClick={() => setNewScore(4)}> 4 </a>
          <a onClick={() => setNewScore(5)}> 5 </a>
          <a onClick={() => setNewScore(6)}> 6 </a>
          <a onClick={() => setNewScore(0)}> x </a>
        </div>
      </div>
    );
  }

  const CommentsSection = () => {
    const [v, sV] = useState(false);
    const changeV = () => sV(!v) 
    return(
      <div>
        <p>Sekcja komentarzy</p>
        {comments}
        {v ?
          <div> 
            <NewCommentForm id_recipe={id} id_user={user ? user.id : -1} id_comment={-1} token={token} callback={refreshData}/>
            <a onClick={() => changeV()}>Anuluj komentarz</a>
          </div>
        :
          <a onClick={() => changeV()}>Dodaj komentarz</a>
        }
      </div>
    )
  }

  return (
    <div>
      <h2>Recipe {name}</h2>
      { 
        owner || mod ? 
        <>
          {
          edit ? 
          <EditData />
            :
          <a className="przycisk" onClick={() => setEditting(true)}> Edytuj dane </a>
          }
        </>
      : 
      <div />
      }
      <p>
        Sposób przygotowania:<br/>
        {text}
      </p>
      <p>
        Typ:<br/>
        {type}
      </p>
      <p>
        Tagi:<br/>
        {tags}
      </p>
      <div>
        Oceny: <br />
        <ScoreField />
      </div>
      <div>
        Komentarze:<br/>
        <CommentsSection />
      </div>
    </div>
  );
}
  
  export default Recipe;