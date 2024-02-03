import {sendRequest} from "./requestService";

const REPORTING_URL_BASE = import.meta.env.VITE_REPORTING_API;

export async function sendReportingRequest({method, uri, data, headers}) {
    return await sendRequest(REPORTING_URL_BASE, {method, uri, data, headers});
}

export async function getReports({boardId}) {
    return await sendReportingRequest({
        method: "GET",
        uri: `/api/v1/report/board/${boardId}`
    });
}

export async function createReport({boardId}) {
    return await sendReportingRequest({
        method: "POST",
        uri: `/api/v1/report/board/${boardId}`
    });
}

export async function changeOwner({reportId}) {
    return await sendReportingRequest({
        method: "PATCH",
        uri: `/api/v1/report/${reportId}/owner`
    });
}

export async function deleteReport({reportId}) {
    return await sendReportingRequest({
        method: "DELETE",
        uri: `/api/v1/report/${reportId}`
    });
}