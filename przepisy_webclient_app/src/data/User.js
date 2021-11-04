import React, { createContext, useState, useEffect, useMemo } from 'react';
import { API_ADDRESS } from './API_VARIABLES';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [ USER , setUser ] = useState({
        id : undefined,
        nick : undefined,
        type :  undefined,
        token : undefined
    });
    const [ token , setToken ] = useState(() => {
        const saved = localStorage.getItem("token");
        if(saved !== 'undefined'){
          return JSON.parse(saved);
        }else{
          return "";
        }
    });
    
    const LogOut = () => {  
      localStorage.setItem("token", undefined);
      console.log(`wylogowano`);
      setUser({
          id : undefined,
          nick: undefined,
          type: undefined,
          token: undefined
      });
      window.location.reload();
    }
    
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
            if(data.error == 0)
            {
              if(data.id && data.nick && data.type){
                setUser({
                    id    : data.id,
                    nick  : data.nick,
                    type  : data.type,
                    token : token
                });
              };
            }
          })
          .catch(err => {
            console.log(err);
          });
    }, [token]);

    const v = useMemo(
        () => ({ USER, token, setToken, setUser, LogOut }),
        [ USER, token, setToken, setUser, LogOut ],
    );

    return (
        <UserContext.Provider value={v}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext }
export default UserContextProvider;