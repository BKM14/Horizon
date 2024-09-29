'use server'

import { cookies } from "next/headers"
import { createAdminClient, createSessionClient } from "../appwrite"
import { ID } from "node-appwrite"
import { parseStringify } from "../utils"



export const signIn = async ({email, password}:signInProps) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);
        cookies().set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
        return parseStringify(session);
    } catch (e) {
        console.error('Error', e)
    }
}

export const signUp = async (userData: SignUpParams) => {
    try {
        const { account } = await createAdminClient();
        const {email, password, firstname, lastname} = userData;

        const newUserAccount = await account.create(
            ID.unique(), 
            email,
            password, 
            firstname + " " +  lastname
        );
        const session = await account.createEmailPasswordSession(email, password);
      
        cookies().set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
        
        return parseStringify(newUserAccount)
    } catch (e) {
        console.error('Error', e)
    }
}

export const getLoggedInUser = async () => {
    try {
      const { account } = await createSessionClient();
      const user =  await account.get();
      return parseStringify(user);
    } catch (error) {
      return null;
    }
}

export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();
        cookies().delete("appwrite-session");

        await account.deleteSession('current');
        return true;
    } catch {
        return null;
    }
}