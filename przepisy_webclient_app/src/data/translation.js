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
            if(t <= 0)
                res.push(<img src="http://localhost:3001/images/static/starL.png" alt="N"/>)
            else
                res.push(<img src="http://localhost:3001/images/static/starH.png" alt="H"/>)
        }else{
            res.push(<img src="http://localhost:3001/images/static/starF.png" alt="F"/>)
        }
        t -= 1;
    }
    res.push(<div style={{marginLeft: "5px", color:"#3bd16f"}}>{typeof(v) == 'number' ? v.toFixed(2) : v}</div>);
    return v == null ? <div style={{marginLeft: "5px", color:"#3bd16f"}}>Brak Ocen</div> : res;
}

export { translateLVL, translateTime, translateType, translateScore};