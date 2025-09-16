import { createContext } from "react";
import React from "react";
import { AppConstants } from "../util/constants";
export const AppContext = createContext();

export const AppProvider = ( props ) => {

    const backendurl=AppConstants.BACKEND_URL;
    const[isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userData, setUserData] = React.useState(false);

    const contextValue={
       backendurl, isLoggedIn, setIsLoggedIn, userData, setUserData 
    }

    return (
    <AppContext.Provider value={contextValue}>
        {props.children}
    </AppContext.Provider>
    );

}