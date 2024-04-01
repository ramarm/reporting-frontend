import {sendRequest} from "./requestService";

const REPORTING_URL_BASE = import.meta.env.VITE_REPORTING_API;

export async function sendReportingRequest({method, uri, data, params, headers}) {
    return await sendRequest(REPORTING_URL_BASE, {method, uri, data, params, headers});
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

export async function duplicateReport({reportId}) {
    return await sendReportingRequest({
        method: "POST",
        uri: `/api/v1/report/${reportId}/duplicate`
    });
}

export async function changeOwner({reportId}) {
    return await sendReportingRequest({
        method: "PATCH",
        uri: `/api/v1/report/${reportId}/owner`
    });
}

export async function patchReport({reportId, key, value}) {
    return await sendReportingRequest({
        method: "PATCH",
        uri: `/api/v1/report/${reportId}`,
        data: {key, value}
    });
}

export async function deleteReport({reportId}) {
    return await sendReportingRequest({
        method: "DELETE",
        uri: `/api/v1/report/${reportId}`
    });
}

export async function getInsightsUsage({since}) {
    return await sendReportingRequest({
        method: "GET",
        uri: `/api/v1/management/insights_usage`,
        params: {since: since.toISOString()}
    });
}


export async function sendReport({reportId}) {
    return await sendReportingRequest({
        method: "POST",
        uri: `/api/v1/report/${reportId}/send`
    });
}