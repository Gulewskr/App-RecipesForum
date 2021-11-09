import { useContext, useEffect, useMemo, useState } from "react";
import { Buttons, NewCommentForm, RecipeForm, SingleComment } from "../components";
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
  
  const {owner, mod, name, text, type, speed, lvl, tags} = useMemo(
    () => {console.log(data); return({
      owner : data !== "" ? data.own ? data.own === true : false : false, 
      mod : data !== "" ? data.mod ? data.mod === true : false : false, 
      name : data !== "" ? data.name ? data.name : "null" : "null", 
      text : data !== "" ? data.text ? data.text : "null" : "null", 
      type : data !== "" ? data.type != undefined ? data.type : 1 : 1, 
      speed : data !== "" ? data.speed != undefined ? data.speed : 1 : 1, 
      lvl : data !== "" ? data.lvl != undefined ? data.lvl : 1 : 1, 
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
      const interval = setInterval(() => {
        //TODO będzie trzeba ale wpierw oddzielić dane od re-renderowania elementów żeby się nie resetowały formularze
        //refreshData();
        console.log("data refreshed");
      }, 10000);
      return () => clearInterval(interval);
  }, [id, token]);

  const resetEdit = () =>
  {
    setEditting(false);
    //setEuserData(userData);
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
          refreshData();
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

  const saveChange = (name, text, tag, type, speed, lvl) =>
  {
    setEditting(false);
    //przesłanie na serwer
    console.log("nowy przepis:");
    console.log(`nazwa: ${name} \n Treść:\n  ${text} \n Typ:  ${type}`);
    fetch(`${API_ADDRESS}/recipe?id=${id}`, {
      method: 'put',
      headers: { 
        'Access-token': token,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        name: name,
        text: text,
        tags: tag,
        type: type,
        speed: speed,
        lvl: lvl
      })
    })
    .then( res => {
      try{
        //jak git to zamień jak nie to błąd wyświetl
        if(res.status == 200){
          console.log("powodzenie zmiany danych");
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

  return (
    <div>
      <h2>Recipe {name}</h2>
      { 
        owner || mod ? 
        <>
          {
          edit ? 
          <>
            <a className="przycisk" onClick={() => resetEdit()}> Anuluj </a>
            <RecipeForm name={name} text={text}  type={type} speed={speed} lvl={lvl} tags={tags} callback={saveChange} />
            <Delete />
          </>
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
        Szybkość:<br/>
        {speed}
      </p>
      <p>
        Poziom:<br/>
        {lvl}
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