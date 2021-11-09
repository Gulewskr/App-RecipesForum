import React, {useState} from 'react';

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
    const [_tag, setTags] = useState(tags ? tags : "");
    const [_text, setText] = useState(text ? text : "");
    const [_type, setType] = useState(type ? type : 1);
    const [_speed, setSpeed] = useState(speed ? speed : 1);
    const [_lvl, setLVL] = useState(lvl ? lvl : 1);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        callback(_name, _text, _tag, _type, _speed, _lvl);
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
            <input type="text" onChange={v => setTags(v.target.value)} name="username" defaultValue={_tag} placeholder="tagi" autoComplete="off" required/>
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