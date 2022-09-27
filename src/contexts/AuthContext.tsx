import { createContext, useEffect, useState } from "react";
import { recoverUserInformation, signInRequest } from "../services/fakeBackend";
import { setCookie, parseCookies } from 'nookies'; // LocalStorage e document.cookies por vezes pode dar problema no next, por existir a possiBilidade de usarmos SSR

import Router from 'next/router';
import { api } from "../services/api";

interface SignInProps {
    email: string;
    password: string;
}

interface UserProps {
    name: string;
    email: string;
    avatar_url: string;
}

interface AuthContextProps {
    isAuthenticated: boolean;
    signIn: (data: SignInProps) => Promise<void>;
    user: UserProps;
}

export const AuthContext = createContext({} as AuthContextProps);


export function AuthProvider ({ children }) {
    const [ user, setUser ] = useState< UserProps | null >(null);

    const isAuthenticated = !!user;

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies();

        if(token){
            recoverUserInformation().then(response => {
                setUser(response.user);
            })
        }

    }, [])


    async function signIn( { email, password }: SignInProps ){
       
        const { token, user } = await signInRequest({ email, password });
        
        // Contexto da requisicao(se for no browser é undefined), nome token, o token, opcionais
        setCookie(undefined, 'nextauth.token', token, {
            maxAge: 60 * 60 * 1 // 1 hour
        })

        api.defaults.headers['Authorization'] = `Bearer ${token}`

        setUser(user);
        console.log("FUNCAO SIGNIN CHAMADA");
        console.log('este eh o user', user)

        Router.push('/dashboard')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
            { children }
        </AuthContext.Provider>
    )
}