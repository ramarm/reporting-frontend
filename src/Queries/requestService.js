import axios from "axios";
import {authorize} from "./management";

export class QueryError extends Error {
    constructor({status, message, error_code, data}) {
        super(message);
        this.status = status;
        this.error_code = error_code;
        this.data = data;
    }
}

export function handleAxiosError(error) {
    if (error.response) {
        throw new QueryError({
            status: error.response.status,
            message: error.response.data.detail.message,
            error_code: error.response.data.detail.error_code,
            data: error.response.data
        });
    } else {
        throw new QueryError({
            status: 500,
            message: error.message,
            error_code: "INTERNAL_SERVER_ERROR"
        });
    }
}


export async function sendRequest(baseUrl, {method, uri, data, headers, params}) {
    const accessToken = (await authorize()).access_token;
    const url = new URL(uri, baseUrl).href;
    try {
        headers = {...headers, Authorization: `Bearer ${accessToken}`};
        const response = await axios({
            method,
            url,
            data,
            headers,
            params
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}