import React, {useContext, useState} from 'react';
import {RecipeImagesForm} from './index';
import UF from '../data/UserTypes';

const RecipeComp = (props) => {
    const {id, image, name, speed, lvl, text, type, user} = props;
    /*
        user:
        {
            "id_":4,
            "name":"zwykły użytkownik",
            "type":4,
            "imageURL":null
        }
    */
    return(
        <div className="container" onClick={ () => window.location.replace('/recipe?id=' + id)} key={id}>
            Przepis nr: {id}<br/>
            Nazwa: {name}<br/>
            <img  src={image} alt={"obraz przepisu"}/><br/>
            {text}<br/>
            Przepis typu: {type}<br/>
            Szybkość: {speed}<br/>
            Poziom: {lvl}<br/>
            <div className={UF.GetNickNameStyle(user.id_)}>
                Użytkownik:<br />
                id: {user.id_}<br />
                name: {user.name}<br />
                typ: {UF.GetTypeName(user.type)}<br />
                zdjęcie: {user.imageURL}
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
        callback(_name, _text, tagsTable, _type, _speed, _lvl, _imagesID);
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
            <RecipeImagesForm images={images} postAddress={'/imagesProfile'} token={token} callback={setNewImageIDS} />
            <input type="text" form="formMain" onChange={v => setText(v.target.value)} name="password"  defaultValue={_text} placeholder="treść" autoComplete="off"  required />
            <input type="submit" form="formMain"/>
            <ErrorText />
        </div>
    );
}

export { RecipeComp , RecipeForm };