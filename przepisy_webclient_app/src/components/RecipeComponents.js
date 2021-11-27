import React, {useContext, useState} from 'react';
import {RecipeImagesForm, ProfileComp} from './index';
import UF from '../data/UserTypes';
import {validationRecipeForm} from '../data/Validation'

const RecipeComp = (props) => {
    const {id, image, name, speed, score, lvl, text, type, user} = props;

    const translateLVL = (v) => {
        switch (v) {
            case 1: return "Łatwe do przygotowania";
            case 2: return "Średnie do przygotowania";
            case 3: return "Trudne do przygotowania";
        }
        return "Brak";
    }

    const translateTime = (v) => {
        switch (v) {
            case 1: return "Krótki czas przygotowania";
            case 2: return "Sredni czas przygotowania";
            case 3: return "Długi czas przygotowania";
        }
        return "Brak";
    }

    const translateType = (v) => {
        switch (v) {
            case 1: return "Danie główne";
            case 2: return "Przekąska";
            case 3: return "Sałatka";
            case 4: return "Zupa";
            case 5: return "Deser";
            case 6: return "Ciasto";
        }
        return "Brak";
    }

    const translateScore = (v) => {
        let t = v;
        let res = [];
        for(let i = 0; i < 6; i++)
        {
            if(t < 0.9)
            {
                if(t < 0)
                    res.push(<img src="http://localhost:3001/images/static/starL.png" alt="N"/>)
                else
                    res.push(<img src="http://localhost:3001/images/static/starH.png" alt="H"/>)
            }else{
                res.push(<img src="http://localhost:3001/images/static/starF.png" alt="F"/>)
            }
            t -= 1;
        }
        res.push(<div style={{marginLeft: "5px", color:"#3bd16f"}}>{typeof(v) == 'number' ? v.toFixed(2) : v}</div>);
        console.log(v);
        return v == null ? <div style={{marginLeft: "5px", color:"#3bd16f"}}>Brak Ocen</div> : res;
    }

    return(
        <div className="container-Recipe" key={id}>
            <div className="cR-l">
                <ProfileComp user={user}/>
                <div className="line" />
                <div className="imgCont">
                    <img src={image ? image : "http://localhost:3001/images/static/recipe.jpg"} alt={"obraz przepisu"}/>
                </div>
            </div>
            <div className="lineV"></div>
            <div className="cR-r">
                <div className="cr-r-c">
                    {name}
                </div>
                <div className="line" />
                <div className="cr-r-c">
                    <div>Ocena</div>
                    <div className="cr-score-stars">{translateScore(score)}</div>
                </div>
                <div className="line" />
                <div className="cr-r-cL">
                    <div>
                        <div className="cr-icons"><img src="http://localhost:3001/images/static/clock.png" alt="Szybkość:"/></div>
                        <div>{translateTime(speed)}</div>
                    </div>
                    <div>
                        <div className="cr-icons"><img src="http://localhost:3001/images/static/lvl.png" alt="Poziom:"/></div>
                        <div>{translateLVL(lvl)}</div>
                    </div>
                    <div>
                        <div className="cr-icons"><img src="http://localhost:3001/images/static/dish.png" alt="Typ:"/></div>
                        <div>{translateType(type)}</div>
                    </div>
                </div>
                <div className="line" />
                <div className="cr-r-text">
                    <div>{text}</div>
                </div>
                <div className="button" onClick={ () => {
                window.location.replace('/recipe?id=' + id);
                }} >Przejdź do strony przepisu</div>
            </div>            
        </div>
    );
};

const RecipeForm = (props) => {
    const {name, text,  type, speed, lvl, tags, images, token, callback } = props;
    const [error, setError] = useState(0);
    const [_name, setName] = useState(name ? name : "");
    const [tagsTable, setTagsTable] = useState( tags ? tags : []);

    const [_text, setText] = useState(text ? text : "");
    const [_type, setType] = useState(type ? type : 1);
    const [_speed, setSpeed] = useState(speed ? speed : 1);
    const [_lvl, setLVL] = useState(lvl ? lvl : 1);
    const [_imagesID, setImageIDs ] = useState([]);

    
    const handleSubmit = (e) => {
        console.log(e);
        e.preventDefault();
        let val = validationRecipeForm(_name, _text, tagsTable, _type, _speed, _lvl, _imagesID);
        if(!val.error){
            callback(_name, _text, tagsTable, _type, _speed, _lvl, _imagesID);
        }else{
          alert(val.errorMSG);
        }
    }

    const setNewImageIDS = (v) => { setImageIDs(v); };

    const changedTags = (v, i, b) => {
        var t = v.split(' #');
        if(t.length == 2){
            let tmp = [...tagsTable];
            tmp.push(t[0].replaceAll('#',''));
            setTagsTable(tmp);
            i.target.value = '#' + t[1];
        }else if(b && t[0] != ""){
            let tmp = [...tagsTable];
            tmp.push(t[0].replaceAll('#',''));
            setTagsTable(tmp);
            i.target.value = "";
        }else if(t[0] == ""){
            getLastItem(i);
        }
    }

    const getLastItem = (i) => {
        console.log(tagsTable);
        if(tagsTable.length > 0)
        {
            let tmp = [...tagsTable];
            i.target.value = '#' + tmp.pop();
            setTagsTable(tmp);
        }
    }

    const deleteTagByIndex = (i) => {
        if(i >= 0 && i < tagsTable.length)
        {
            let tmp = [...tagsTable];
            tmp.splice(i, 1);
            setTagsTable(tmp);
        }
    }

    const ErrorText = () => {
        switch(error){
            case 0:
                return(<></>);
            case 1:
                return(<div className="error-text">Błędny login lub hasło</div>);
            case 2:
                return(<div className="error-text">Błąd serwera</div>);
            default:
                return(<></>);
        }
    }

    return(
        <div className="login-form">
            <form onSubmit={handleSubmit} id="formMain"></form>
            <input type="text" form="formMain" onChange={v => setName(v.target.value)} name="username" defaultValue={_name} placeholder="nazwa przepisu" autoComplete="off" required/>
            <div className="taginput" form="formMain">
                { tagsTable.map((v, i) => <a key={i} onClick={() => deleteTagByIndex(i)} style={{color: "blue", paddingLeft: "5px"}}>#{v.replaceAll(' ', '_').replaceAll('#','')}</a>) }
                <input type="text" onChange={v => changedTags(v.target.value, v)} onFocus={v => getLastItem(v)} onBlur={v => changedTags(v.target.value, v, true)} name="username" autoComplete="off"/>
            </div>
            <p>Rodzaj dania</p>
            <select form="formMain" value={_type} onChange={v => setType(v.target.value)}>            
                <option value={1}>Danie główne</option>
                <option value={2}>Przekąska</option>
                <option value={3}>Sałatka</option>
                <option value={4}>Zupa</option>
                <option value={5}>Deser</option>
                <option value={6}>Ciasto</option>
            </select>
            <p>Czas przygotowania</p>
            <select form="formMain" value={_speed} onChange={v => setSpeed(v.target.value)}>            
                <option value={1}>krótki</option>
                <option value={2}>średni</option>
                <option value={3}>długi</option>
            </select>
            <p>Stopień zaawansowania dania</p>
            <select form="formMain" value={_lvl} onChange={v => setLVL(v.target.value)}>            
                <option value={1}>łatwe</option>
                <option value={2}>średnie</option>
                <option value={3}>trudne</option>
            </select>
            <p>Dodaj zdjęcia do przepisu</p>
            <RecipeImagesForm images={images} postAddress={'/imagesRecipe'} token={token} callback={setNewImageIDS} />
            <input type="text" form="formMain" onChange={v => setText(v.target.value)} name="password"  defaultValue={_text} placeholder="treść" autoComplete="off"  required />
            <input type="submit" form="formMain"/>
            <ErrorText />
        </div>
    );
}

const createRecipeList = (data, filter) => {
    var res = [];
    if(filter != undefined && Array.isArray(data)){
        data = data.filter(({name, text}) => {
            let tmp = false
            if(typeof name == "string" && !tmp){
                tmp = name.toLowerCase().includes(filter.toLowerCase());
            }
            if(typeof text == "string" && !tmp){
                tmp = text.toLowerCase().includes(filter.toLowerCase());
            }
            return tmp
        })
    }
    for(let i = 0, l = data.length; i < l; i++)
    {
      const {id, imageURL, lvl, name, score, speed, text, type, user} = data[i];
      if(user != undefined){
        res.push( <div key={id} className={UF.GetRecipeDivClass(user.type)}><RecipeComp key={id} id={id} image={imageURL} name={name} score={score} speed={speed} lvl={lvl} text={text} type={type} user={user} /></div> );
      }else{
        break;
      }
    }
    return res;
  }

export { RecipeComp , RecipeForm , createRecipeList};