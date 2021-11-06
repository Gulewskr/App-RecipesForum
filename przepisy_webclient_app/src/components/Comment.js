import { useState } from 'react';
import {API_ADDRESS} from '../data/API_VARIABLES';

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
            if(res.status == 200) callback();
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
        tryAddComment();
    }

    return (
        <div className="login-form">
            <div>
                <p>Dane testowe:</p>
                <p>ID przepisu komentowanego: {id_recipe}</p>
                <p>ID użytkownika piszącego: {id_user}</p>
                <p>ID komentarzu odpowiadanego: {id_comment}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={v => setText(v.target.value)} name="komentarz" placeholder="komentarz" autoComplete="off" required/>
                <input type="submit"/>
            </form>
        </div>
    );
}

const SingleComment = (props) => {
    const {id, id_recipe, id_user, text, token, callback} = props;
    const [newCommentV, setV] = useState(false);

    const changeV = () => setV(!newCommentV);

    return (
        <div>
            <p>Id komentarzu: {id}</p>
            <p>Przepis ID: {id_recipe}</p>
            <p>Użytkownik ID: {id_user}</p>
            <p>Treść: {text}</p>
            <a onClick={() => changeV()}> { newCommentV ? "Anuluj" : "Odpowiedz" }</a>
            { newCommentV && <NewCommentForm id_recipe={id_recipe} id_user={id_user} id_comment={id} token={token} callback={callback}/> }
        </div>
    );
}

export {NewCommentForm, SingleComment}