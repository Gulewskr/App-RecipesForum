import React, { createContext, useContext, useState, useEffect, useMemo, Children } from 'react';
import { API_ADDRESS } from './API_VARIABLES';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [ USER , setUser ] = useState({
        nick : "",
        type :  4,
        token : ""
    });
    const [ token , setToken ] = useState(() => {
        const saved = localStorage.getItem("token");
        const initialValue = JSON.parse(saved);
        return initialValue || "";
    });
    const [ nick , setNick ] = useState("");
    const [ type , setType ] = useState("");
    
    
    useEffect(() => {
        localStorage.setItem("token", JSON.stringify(token));
        
        console.log("przesyłąm na server token: " + token);
        //Not implemented in API 
        fetch(`${API_ADDRESS}/authByJWT`, {
            method: 'post',
            headers: { 
                'Access-token': token,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              token : token
            }),
          })
          .then( res => {
            try{
              console.log(res);
              return res.json();
            }catch (err){
              console.log(err);
            };
          })
          .then((data) => {
              console.log(data);
            if(data.nick && data.type){
                setUser({
                    nick: data.nick,
                    type: data.type,
                    token: token
                });
                setNick(data.nick);
                setType(data.type);
            };
          })
          .catch(err => {
            console.log(err);
          });
    }, [token]);

    const v = useMemo(
        () => ({ USER, setToken, setNick, setType }),
        [ USER, setToken, setNick, setType ],
    );

    return (
        <UserContext.Provider value={v}>
            {children}
        </UserContext.Provider>
    );
};

const GetUser = () => {
    const { USER, setToken, setNick, setType } = useContext(UserContext);
    return(
      {USER, setToken, setNick, setType}
    );
};

export { UserContext, GetUser }
export default UserContextProvider;