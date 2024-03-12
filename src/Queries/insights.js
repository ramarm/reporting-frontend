import {handleAxiosError} from "./requestService";
import axios from "axios";

const INSIGHTS_URL_BASE = import.meta.env.VITE_INSIGHTS_API;

export async function sendInsightsRequest({method, uri, data, headers}) {
    const url = new URL(uri, INSIGHTS_URL_BASE).href;
    try {
        const response = await axios({
            method,
            url,
            data,
            headers
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function calculateInsight({uri, data}) {
    return await sendInsightsRequest({
        method: "POST",
        uri: uri,
        data: data
    });
}