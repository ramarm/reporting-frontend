import mondaySdk from "monday-sdk-js";
import {QueryError} from "./requestService.js";

const monday = mondaySdk();
monday.setApiVersion(import.meta.env.VITE_MONDAY_API_VERSION);
if (import.meta.env.VITE_MONDAY_API_KEY) {
    monday.setToken(import.meta.env.VITE_MONDAY_API_KEY);
}

async function runQuery({query, variables}) {
    const res = await monday.api(query, {
        variables
    });
    if (Object.keys(res).includes("errors")) {
        throw new QueryError({
            status: 400,
            message: res.errors.map(error => error.message),
            error_code: "MONDAY_API_ERROR"
        });
    }
    if (Object.keys(res).includes("error_code")) {
        if (res.error_code === "ComplexityException") {
            setTimeout(() => runQuery)
            await new Promise((r) => setTimeout(r, 60 * 1000))
            return await runQuery({query, variables});
        }
        throw new QueryError({
            status: res.status_code || 500,
            message: res.error_message,
            error_code: res.error_code
        });
    }
    if (Object.keys(res).includes("error_message")) {
        throw new QueryError({
            status: res.status_code || 500,
            message: res.error_message,
            error_code: "MONDAY_API_ERROR"
        });
    }
    return res.data;
}

export async function getMe() {
    const query = "{ me { account { id name slug logo plan { tier max_users } country_code } id" +
        " name email photo_original country_code } }"
    return (await runQuery({query, variables: {}})).me
}