import { useContext, useEffect, useMemo, useState } from "react";
import { Buttons, NewCommentForm, RecipeForm, SingleComment } from "../components";
import { API_ADDRESS } from "../data/API_VARIABLES";
import { UserContext } from "../data/User";
import {translateLVL, translateTime, translateType, translateScore } from '../data/translation';

const Recipe = (props) => {

  const { user, token } = props;
  const { UserCanEdit } = useContext(UserContext);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')

  const [edit, setEditting] = useState(false);
  const [data, setData] = useState("");  
  const [dataTags, setDataTags] = useState([]);  
  const [dataImages, setDataImages] = useState([]);  

  const [comments, setComments] = useState(<div></div>);  
  const [extraImages, setExtraImages] = useState([]);
  
  const {mod, name, text, type, image, _user, score, speed, lvl} = useMemo(
    () => {console.log(data); return({ 
      name : data !== "" ? data.name ? data.name : "null" : "null", 
      text : data !== "" ? data.text ? data.text : "null" : "null", 
      type : data !== "" ? data.type != undefined ? data.type : 1 : 1, 
      speed : data !== "" ? data.speed != undefined ? data.speed : 1 : 1,
      score : data !== "" ? data.score != undefined ? data.score : 0 : 0,
      lvl : data !== "" ? data.lvl != undefined ? data.lvl : 1 : 1,
      image : data !== "" ? data.image != undefined ? data.image : { imageURL : "image",  id_ : -1 } : { imageURL : "image",  id_ : -1 }, 
      _user : data !== "" ? data.user != undefined ? data.user : {id_ : 0, name : "", type : 4, imageURL : "brak obrazu"} : {id_ : 0, name : "", type : 4, imageURL : "brak obrazu"}
  })}, [data]);

  const tags = useMemo(() => 
    {
      if(dataTags){
        let res = [];
        dataTags.forEach((v,i) => res.push(<div className="rec-tag" key={i}> #{v} </div>));
        return res;
      }else{
        return <p>brak</p>;
      }
    });

  const [ysData, set_ysData] = useState("");
  const {yourScr} = useMemo(
    () => {
      if(ysData != undefined && ysData != "")
      {
        return {
          yourScr : ysData.score != undefined ? ysData.score : 0
        }
      }else{
        return {
          yourScr : 0
        }
      }
  }, [ysData]);

  const displayComments = (d) => {
    console.log(d);
    if(d.error == 0)
    {
      var res = [];
      d.data.forEach(e => 
        {
          //console.log(`Komentarza uprawnienia ${UserCanEdit(e.user.id_)}`);
          res.push(<SingleComment id={e.id} id_recipe={Number(e.id_recipe)} id_user={e.user.id_} user={e.user} text={e.text} editable={UserCanEdit(e.user.id_)} token={token} callback={refreshData}/>);
        }
      );
      setComments(res);
    }else{
      setComments(<div>{d.errorMSG}</div>);
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
          return res.json();
        }catch (err){
          console.log(err);
        };
      })
      .then((data) => {
          console.log(data); 
          setData(data);
      })
      .catch(err => {
        console.log(err);
      });

      fetch(`${API_ADDRESS}/recipeTag?id=${id}`, {
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
      .then((data) => {
          let res = [];
          for(let i in data.data)
          {
            res.push(data.data[i].text);
          }
          setDataTags(res);
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
          return res.json();
        }catch (err){
          console.log(err);
        };
      })
      .then((data) => {
        console.log(data);
        displayComments(data);
      })
      .catch(err => {
        console.log(err);
      });

      fetch(`${API_ADDRESS}/recipeImage?id=${id}`, {
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
      .then((data) => {
          setExtraImages(data.data);
      })
      .catch(err => {
        console.log(err);
      });

      fetch(`${API_ADDRESS}/myScore?id=${id}`, {
        method: 'get',
        headers: { 
          'Access-token': token,
          'Content-Type': 'application/json' 
        },
      })
      .then( res => {
        try{
          if(res.status == 200)
            return res.json();
          else
            return undefined;
        }catch (err){
          console.log(err);
        };
      })
      .then((data) => {
        set_ysData(data);
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
  }, [id, token, user]);

  const resetEdit = () =>
  {
    setEditting(false);
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
      <div >
        {v ? 
          <div className="confirm_field">
            <p><b>Czy na pewno chcesz usunąć przepis?</b><br /> (tej operacji nie da się cofnąć, usunięte zostaną również wszelkie związane komentarze)</p>
              <div id="buttons">
                <div onClick={() => setV(false)}>Anuluj</div>
                <div onClick={() => deleteData()}>Usuń</div>
              </div>
          </div>
          :
          <div onClick={() => setV(true)}>USUŃ Przepis</div>
        }
      </div>
    );
  }

  const ScoreField = () => {

    const setNewScore = (v) => {
      set_ysData(v);
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
        refreshData();
      })
      .catch(err => {
        console.log(err);
      });
    }

    return(
      <div style={{paddingLeft:"40px"}}>
        <b style={{fontSize: "20px", margin: "-20px"}}>Oceny:</b>
        <div id="rec_score">
          <div><b>Ocena przepisu:</b></div>
          <div style={{alignSelf: "center"}}>{translateScore(score)}</div>
          <div><b>Twoja ocena przepisu:</b></div>
          <div style={{alignSelf: "center"}}>{yourScr ? translateScore(yourScr) : "Nie wystawiono jeszcze oceny" }</div>

        </div>
        <div>
          <div><b>Oceń przepis:</b></div>
          <div style={{display: "flex", flexDirection: "row"}}>
            <div className="score_set_f" onClick={() => setNewScore(1)}> 1 </div>
            <div className="score_set_f" onClick={() => setNewScore(2)}> 2 </div>
            <div className="score_set_f" onClick={() => setNewScore(3)}> 3 </div>
            <div className="score_set_f" onClick={() => setNewScore(4)}> 4 </div>
            <div className="score_set_f" onClick={() => setNewScore(5)}> 5 </div>
            <div className="score_set_f" onClick={() => setNewScore(6)}> 6 </div>
            <div className="score_set_f" onClick={() => setNewScore(0)}> anuluj ocenę </div>
          </div>
        </div>
      </div>
    );
  }

  const CommentsSection = () => {
    const [v, sV] = useState(false);
    const changeV = () => sV(!v) 
    return(
      <div>
        {comments}
        <div style={{height: "30px"}} />
        {v ?
          <div> 
            <NewCommentForm id_recipe={Number(id)} id_user={user ? user.id : -1} id_comment={-1} token={token} callback={refreshData}/>
            <div id="rec_comButton" onClick={() => changeV()}>Anuluj komentarz</div>
          </div>
        :
          <div id="rec_comButton" onClick={() => changeV()}>Dodaj komentarz</div>
        }
      </div>
    )
  }

  const saveChange = (name, text, tag, type, speed, lvl, images) =>
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
        lvl: lvl,
        images: images
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

  const ImageCarousel = (props) => {
    let {images} = props;
    const [firstID, setFI] = useState(1);

    let setNextID = () => {
      let newID = firstID + 1;
      if(images.length == newID) newID = 0;
      setFI(newID);
    }

    let setPrevID = () => {
      let newID = firstID - 1;
      if(newID < 0 ) newID = images.length - 1;
      setFI(newID);
    }
    
    let getPrevID = (i = 1) => {
      let newID = firstID - i;
      if(newID < 0) newID += images.length;
      return newID;
    }

    let getNextID = (i = 1) => {
      let newID = firstID + i;
      if(images.length <= newID) newID -= images.length;
      return newID;
    }

    if(Array.isArray(images))
    {
      if(images.length > 3)
      {
        return (
          <div id="imageCarousel">
            <div id="prevButton" onClick={() => setPrevID()}>{"<"}</div>
            <div className="singImage"><img key={images[getPrevID()].id} src={images[getPrevID()].imageURL} alt={images[getPrevID()].imageURL}/></div>
            <div className="singImage"><img key={images[firstID].id} src={images[firstID].imageURL} alt={images[firstID].imageURL}/></div>
            <div className="singImage"><img key={images[getNextID()].id} src={images[getNextID()].imageURL} alt={images[getNextID()].imageURL}/></div>
            <div id="nextButton" onClick={() => setNextID()}>{">"}</div>
          </div>
        );
      }else{
        return(
          <div id="imageCarousel">
          {images.map(({id, imageURL}) => <div className="singImage"><img key={id} src={imageURL} alt={imageURL}/></div>)}
          </div>
        );
      }
    }
    else
      return <div></div>;
  }

  return (
    <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
      <div id="recipeHead">
        <div id="mainImageContainer">
          <div className="profileBorder">
            <img id="mainImageContainerImg" src={image.imageURL ? image.imageURL : "http://localhost:3001/images/static/recipe.jpg"} alt={`obraz id ${image.id_}`}/>
          </div>
        </div>
        <div className="line"></div>
        <div className="profileBorder" style={{flexDirection: "column"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <h2>{name}</h2>
          </div>
          <div className="line"></div>
          <div style={{display: "flex", flexDirection:"row"}}>
            <div className="headCont">
              <div className="cr-icons"><img src="http://localhost:3001/images/static/dish.png" alt="Typ:"/></div>
              <div>{translateType( type )}</div>
            </div>
            <div className="lineV"></div>
            <div className="headCont">
              <div className="cr-icons"><img src="http://localhost:3001/images/static/clock.png" alt="Szybkość:"/></div>
              <div>{translateTime( speed )}</div>
            </div>
            <div className="lineV"></div>
            <div className="headCont">
              <div className="cr-icons"><img src="http://localhost:3001/images/static/lvl.png" alt="Poziom:"/></div>
              <div>{translateLVL( lvl )}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="ImageCarusel profileBorder">
        <ImageCarousel images={extraImages}/>
      </div>
      <div id="RecipeContent">
        <div  className="profileBorder">
          <div style={{display: "flex", flexDirection: "column", width: "1190px"}}>
            <div style={{display: "flex", flexDirection: "row", flexWrap:"wrap"}}><b style={{fontSize: "20px", margin: "5px"}}>Tagi:</b> {tags}</div>
            <div>
              <b style={{fontSize: "20px", margin: "5px"}}>Sposób przygotowania:</b>
              <div><pre style={{whiteSpace: "pre-wrap"}}>{text}</pre></div>
            </div>
            { 
              UserCanEdit(_user.id_) ?
              <>
                {
                edit ? 
                <div id="editFormCont">
                  <div>
                    <div id="background"></div>
                    <div id="editFormInCont">
                      <div id="formButtonCont">
                        <div onClick={() => resetEdit()}> Anuluj </div>
                        <Delete />
                      </div>
                      <RecipeForm name={name} text={text}  type={type} speed={speed} lvl={lvl} tags={dataTags} images={image.id_ != -1 ? [image, ...extraImages] : undefined} token={token} callback={saveChange} />
                    </div>
                  </div>
                </div>
                  :
                <div id="editButton" className="przycisk" onClick={() => setEditting(true)}> Edytuj dane </div>
                }
              </>
            : 
            <div />
            }
          </div>
        </div>
      </div>
      <div>
        <div  className="profileBorder">
          <ScoreField />
        </div>
      </div>
      <div id="RecipeComentSection">
        <div  className="profileBorder">
          <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems:"center", width: "100%"}}>
            <b style={{fontSize: "20px", margin: "5px"}}>Komentarze:</b>
            <CommentsSection />
            <div style={{height: "250px"}} />
          </div>
        </div>
      </div>
    </div>
  );
}
  
  export default Recipe;