import axios from "axios";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../consts";
import {handleAxiosError, sendRequest} from "./requestService";
import moment from "moment";

const MANAGEMENT_URL_BASE = import.meta.env.VITE_MANAGEMENT_API

let credentials = null;

export async function authorize() {
    try {
        if (!credentials || moment.utc(credentials.expireAt).subtract(1, "minutes").isBefore(moment.utc())) {
            const url = new URL("/api/v1/auth/token", MANAGEMENT_URL_BASE).href;
            const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
            const response = await axios.post(url, {
                account_id: context.account.id,
                user_id: context.user.id,
                app_id: import.meta.env.VITE_MONDAY_APP_ID
            });
            credentials = {
                expireAt: response.data.expire_at,
                access_token: response.data.access_token
            };
        }
        return credentials;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function createUser(user) {
    try {
        const data = {
            account_id: user.account.id,
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.photo_original,
            country_code: user.country_code
        }
        const url = new URL("/api/v1/user", MANAGEMENT_URL_BASE).href;
        const res = await axios.post(url, data);
        return res.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function installApp({accountId, userId, userName, userEmail}) {
    const url = new URL(`/api/v1/user/${userId}/app/${import.meta.env.VITE_MONDAY_APP_ID}/install`, MANAGEMENT_URL_BASE).href;
    await axios.put(url, {
        account_id: accountId.toString(),
        user_name: userName,
        user_email: userEmail,
    });
}

export async function sendManagementRequest({method, uri, data, headers}) {
    return await sendRequest(MANAGEMENT_URL_BASE, {method, uri, data, headers});
}

async function updateAccount(account) {
    return await sendManagementRequest({
        method: "PUT",
        uri: `/api/v1/account/me`,
        data: account
    });
}

async function updateUser(user) {
    const account_id = user.account.id;
    delete user.account;

    return await sendManagementRequest({
        method: "PUT",
        uri: `/api/v1/user/me`,
        data: {...user, account_id}
    });
}

export async function updateUserInformation(user) {
    try {
        await Promise.all([
            updateAccount(user.account),
            updateUser(user)
        ]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function getSubscription() {
    return await sendManagementRequest({
        method: "GET",
        uri: `/api/v1/account/me/subscription`
    });
}

export async function authGoogle({userId, scopes, code}) {
    const url = new URL(`/api/v1/auth/google`, MANAGEMENT_URL_BASE).href;
    return await axios.post(url, {appId: import.meta.env.VITE_MONDAY_APP_ID, userId, scopes, code});
}