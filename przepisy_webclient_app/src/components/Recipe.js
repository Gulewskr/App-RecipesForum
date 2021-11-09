const Recipe = (props) => {
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

export default Recipe;