import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { auth } from "../Firebase"
import SplashScreen from "../screens/SplashScreen"
import { SignedInStack, SignedOutStack } from "../navigation/Navigation"

const AuthNavigation = () => {

    const{currentUser, setCurrentUser} = useContext(UserContext)

    const[status, setStatus] = useState(false)


    const userHandler = async(user) => {
        user ? setCurrentUser(user) : setCurrentUser(null)
    }

    useEffect(()=> {
        auth.onAuthStateChanged((user) => userHandler(user).then(() => {
            setTimeout(() => {setStatus(true)}, 1000)
        }).catch((e) => {}))
    },[])

    if(!status) {
        return (
            <SplashScreen/>
        )
    }
    else {
        return (
            currentUser? <SignedInStack/> : <SignedOutStack/>
        )
    }
}

export default AuthNavigation