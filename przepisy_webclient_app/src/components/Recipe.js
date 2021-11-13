import React, {useEffect, useMemo, useState} from 'react';

const RecipeComp = (props) => {
    const {id, user, name, text, type} = props;
    return(
        <div className="container" onClick={ () => window.location.replace('/recipe?id=' + id)} key={id}>
            Przepis nr: {id}<br/>
            Nazwa: {name}<br/>
            {text}<br/>
            Przepis typu: {type}<br/>
        </div>
    );
};

const RecipeForm = (props) => {
    const {name, text,  type, speed, lvl, tags, callback } = props;
    const [error, setError] = useState(0);
    const [_name, setName] = useState(name ? name : "");
    
    const [tagList, setTL] = useState("");
    const {tagsTable} = useMemo(
        () => { return({
          tagsTable : tags ? tags : []
        })}, []);

    useEffect(() => {
        drawTags();
    },[]);

    const [_text, setText] = useState(text ? text : "");
    const [_type, setType] = useState(type ? type : 1);
    const [_speed, setSpeed] = useState(speed ? speed : 1);
    const [_lvl, setLVL] = useState(lvl ? lvl : 1);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        callback(_name, _text, tagsTable, _type, _speed, _lvl);
    }

    const changedTags = (v, i, b) => {
        var tmp = v.split(' #');
        if(tmp.length == 2){
            tagsTable.push(tmp[0]);
            i.target.value = '#' + tmp[1];
        }else if(b && tmp[0] != ""){
            tagsTable.push(tmp[0]);
            i.target.value = "";
        }else if(tmp[0] == ""){
            getLastItem(i);
        }
        drawTags();
    }

    const getLastItem = (i) => {
        console.log(tagsTable);
        if(tagsTable.length > 0)
        {
            i.target.value = tagsTable.pop();
            drawTags();
        }
    }

    const deleteTagByIndex = (i) => {
        if(i >= 0 && i < tagsTable.length)
        {
            tagsTable.splice(i, 1);
            drawTags();
        }
    }

    const drawTags = (v) => 
    {
        var res = [];
        var l = tagsTable.length;
        for(let i = 0; i < l; i++)
        {
            res.push(<a key={i} onClick={() => deleteTagByIndex(i)} style={{color: "blue", paddingLeft: "5px"}}>{tagsTable[i].replaceAll(' ', '_')}</a>);
        }
        setTL(res);
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
            <form onSubmit={handleSubmit}>
            <input type="text" onChange={v => setName(v.target.value)} name="username" defaultValue={_name} placeholder="nazwa przepisu" autoComplete="off" required/>
            <div className="taginput">
                {tagList}
                <input type="text" onChange={v => changedTags(v.target.value, v)} onFocus={v => getLastItem(v)} onBlur={v => changedTags(v.target.value, v, true)} name="username" autoComplete="off"/>
            </div>
            <p>Rodzaj dania</p>
            <select value={_type} onChange={v => setType(v.target.value)}>            
                <option value={1}>Danie główne</option>
                <option value={2}>Przekąska</option>
                <option value={3}>Sałatka</option>
                <option value={4}>Zupa</option>
                <option value={5}>Deser</option>
                <option value={6}>Ciasto</option>
            </select>
            <p>Czas przygotowania</p>
            <select value={_speed} onChange={v => setSpeed(v.target.value)}>            
                <option value={1}>krótki</option>
                <option value={2}>średni</option>
                <option value={3}>długi</option>
            </select>
            <p>Stopień zaawansowania dania</p>
            <select value={_lvl} onChange={v => setLVL(v.target.value)}>            
                <option value={1}>łatwe</option>
                <option value={2}>średnie</option>
                <option value={3}>trudne</option>
            </select>
            <p>Dodaj zdjęcia do przepisu</p>
            <input type="image" />
            <input type="text" onChange={v => setText(v.target.value)} name="password"  defaultValue={_text} placeholder="treść" autoComplete="off"  required />
            <input type="submit"/>
            </form>
            <ErrorText />
        </div>
    );
}

export { RecipeComp , RecipeForm };