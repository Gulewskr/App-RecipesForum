import { useState } from 'react';
import {API_ADDRESS} from '../data/API_VARIABLES';
import { validationCommentForm } from '../data/Validation';
import {ProfileComp} from './index';

const NewCommentForm = (props) => {
    const {id_recipe, id_user, id_comment, token, callback} = props;
    const [text, setText] = useState("");

    const tryAddComment = () => {
        fetch(`${API_ADDRESS}/comment`, {
          method: 'post',
          headers: { 
            'Access-token': token,
            'Content-Type': 'application/json' 
        },
          body: JSON.stringify({
            recipeID : id_recipe,
            commentID : id_comment,
            commentTEXT : text
          }),
        })
        .then( res => {
          try{
            if(res.status == 200 && callback) callback();
          }catch (err){
            console.log(err);
          };
        })
        .catch(err => {
          console.log(err);
        });
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        //let val = validationCommentForm(e.target["komentarz"].value);
        let val = validationCommentForm(text, id_recipe, id_comment);
        if(!val.error){
          tryAddComment();
          alert(val.errorMSG);
        }else{
          alert(val.errorMSG);
        }
    }

    return (
        <div className="comment-form">
            {/*<div>
                <p>Dane testowe:</p>
                <p>ID przepisu komentowanego: {id_recipe}</p>
                <p>ID użytkownika piszącego: {id_user}</p>
                <p>ID komentarzu odpowiadanego: {id_comment}</p>
            </div>*/}
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={v => setText(v.target.value)} name="komentarz" placeholder="komentarz" autoComplete="off" required/>
                <input id="send" type="submit"/>
            </form>
        </div>
    );
}

const SingleComment = (props) => {
    const {id, id_recipe, id_user, user, text, editable, token, callback} = props;
    const [newCommentV, setV] = useState(false);

    const changeV = () => setV(!newCommentV);

    const Delete = () => {
      const [v, setV] = useState(false);
  
      const deleteData = () => {
        fetch(`${API_ADDRESS}/comment?id=${id}`, {
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
            if(callback) callback();
        })
        .catch(err => {
          console.log(err);
        });
      };
  
      return (
        <div>
          {v ? 
            <div className="confirm_field">
              <p><b>Czy na pewno chcesz usunąć komentarz?</b><br /> (tej operacji nie da się cofnąć)</p>
              <div id="buttons">
                <div onClick={() => setV(false)}>Anuluj</div>
                <div onClick={() => deleteData()}>Usuń</div>
              </div>
            </div>
            :
            <div className="deleteButton" onClick={() => setV(true)}>USUŃ KOMENTARZ</div>
          }
        </div>
      );
    }

    return (
        <div className="comment">
            <ProfileComp user={user}/>
            <div id="line" />
            <p>{text}</p>
            { editable ? <Delete /> : ""}
            { newCommentV && <NewCommentForm id_recipe={id_recipe} id_user={id_user} id_comment={id} token={token} callback={callback}/> }
            { newCommentV ? <div id="cancButt" onClick={() => changeV()}> Anuluj </div> 
                          : <div id="answButt"onClick={() => changeV()}> Odpowiedz </div>}
        </div>
    );
}

export {NewCommentForm, SingleComment}