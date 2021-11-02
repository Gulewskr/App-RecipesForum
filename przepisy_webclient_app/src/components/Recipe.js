const Recipe = (id, user, name, text, type) => {
    return(
        <div className="container" key={id}>
            Przepis nr: {id}<br/>
            Nazwa: {name}<br/>
            {text}<br/>
            Przepis typu: {type}<br/>
        </div>
    );
};

export default Recipe;