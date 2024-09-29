'use server'

import { cookies } from "next/headers"
import { createAdminClient, createSessionClient } from "../appwrite"
import { ID } from "node-appwrite"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import { plaidClient } from "../plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions"

const {
    APPWRITE_DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID
} = process.env

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

export const signUp = async ({password, ...userData}: SignUpParams) => {

    let newUserAccount;

    try {
        const { account, database } = await createAdminClient();
        const {email, firstName, lastName} = userData;

        newUserAccount = await account.create(
            ID.unique(), 
            email,
            password, 
            firstName + " " +  lastName
        );
        const session = await account.createEmailPasswordSession(email, password);

        if (!newUserAccount) throw new Error("Error creating user");

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal',
        })

        if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        const newUser = await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerUrl: dwollaCustomerUrl,
                dwollaCustomerId: dwollaCustomerId
            }
        )
      
        cookies().set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
        
        return parseStringify(newUser);
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

export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ['auth'] as Products[],
            language: "en",
            country_codes: ["US"] as CountryCode[]
        }

        const response = await plaidClient.linkTokenCreate(tokenParams);
        return parseStringify({
            linkToken: response.data.link_token
        })
    } catch (error) {
        console.error(error)
    }
}

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId
}: createBankAccountProps) => {
    try {
        const { database } = await createAdminClient();
        const bankAccount = await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                shareableId
            }
        )

        return parseStringify(bankAccount);
    } catch (error) {
        console.error(error);
    }
}

export const exchangePublicToken = async ({
    publicToken, user
}: exchangePublicTokenProps) => {
    try {const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken
    })

    const access_token = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
        access_token: access_token,
    });

    const accountData = accountsResponse.data.accounts[0];

    const request: ProcessorTokenCreateRequest = {
        access_token: access_token,
        account_id: accountData.account_id,
        processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
    }

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId: user.dwollaCustomerId,
        processorToken,
        bankName: accountData.name
    });

    if (!fundingSourceUrl) throw Error;

    const accessToken = access_token

    await createBankAccount({
        userId: user.$id,
        bankId: itemId,
        accountId: accountData.account_id,
        accessToken,
        fundingSourceUrl,
        shareableId: encryptId(accountData.account_id)
    })

    revalidatePath("/");
    return parseStringify({
        publicTokenExchange: "complete"
    });

    } catch (error) {
        console.error(error);
    }
}