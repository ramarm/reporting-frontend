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

export async function getUser({userId}) {
    const query = "query ($userId: [ID!]) { users (ids:$userId) { id name email photo_tiny photo_original } }"
    return (await runQuery({query, variables: {userId}})).users[0]
}

export async function getUsers() {
    const query = "{ users { id name email photo_tiny } }"
    return (await runQuery({query, variables: {}})).users

}

export async function getBoardColumns({boardId, types}) {
    const query = "query ($boardId: [ID!], $types: [ColumnType!]) { " +
        "boards(ids: $boardId) { " +
        "columns(types: $types) { id title type } " +
        "} }"
    const res = await runQuery({query, variables: {boardId, types}})
    return res.boards[0].columns
}

export async function getBoardGroups({boardId}) {
    const query = "query ($boardId: [ID!]) { " +
        "boards(ids: $boardId) { " +
        "groups { id title position } " +
        "} }"
    const res = await runQuery({query, variables: {boardId}})
    return res.boards[0].groups
}

export async function getBoardUsers({boardId}) {
    const query = "query ($boardId: [ID!]) { " +
        "boards(ids: $boardId) { board_kind " +
        "owners { id name photo_tiny } " +
        "subscribers { id name photo_tiny } " +
        "team_owners { id name picture_url } " +
        "team_subscribers { id name picture_url } " +
        "} " +
        "users { id name photo_tiny } " +
        "teams { id name picture_url } " +
        "}"
    const res = await runQuery({query, variables: {boardId}})

    const boardKind = res.boards[0].board_kind
    if (["private", "share"].includes(boardKind)) {
        const users = [];
        res.boards[0].owners.forEach(owner => {
            users.push({...owner, type: "person"})
        });
        res.boards[0].subscribers.forEach(subscriber => {
            if (!users.some(user => user.id === subscriber.id)) {
                users.push({...subscriber, type: "person"})
            }
        });
        res.boards[0].team_owners.forEach(teamOwner => {
            users.push({...teamOwner, type: "team"})
        });
        res.boards[0].team_subscribers.forEach(teamSubscriber => {
            if (!users.some(user => user.id === teamSubscriber.id)) {
                users.push({...teamSubscriber, type: "team"})
            }
        });
        return users;
    } else {
        const users = [];
        res.users.forEach(user => {
            users.push({...user, type: "person"})
        });
        res.teams.forEach(team => {
            users.push({...team, type: "team"})
        });
        return users;
    }
}