import { v4 as uuid } from 'uuid';

interface SignInRequestProps {
    email: string;
    password: string;
}

const delay = (amount = 500) => new Promise(resolve => setTimeout(resolve, amount));

export async function signInRequest(data: SignInRequestProps){

    await delay();

    return {
        token: uuid(),
        user: {
            name: 'Emanuel',
            email: 'emanuel@gmail.com',
            avatar_url: 'https://github.com/Emanuel321-DEV.png'
        }
    }

}

export async function recoverUserInformation(token ?: string){
    return {
        user: {
            name: 'Emanuel',
            email: 'emanuel@gmail.com',
            avatar_url: 'https://github.com/Emanuel321-DEV.png'
        }
    }
}