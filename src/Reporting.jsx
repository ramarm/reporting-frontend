import './Reporting.css'
import mondaySdk from "monday-sdk-js";
import {useEffect, useState} from "react";
import {STORAGE_MONDAY_CONTEXT_KEY} from "./consts.js";

const monday = mondaySdk();
monday.setApiVersion(import.meta.env.VITE_MONDAY_API_VERSION);

function Reporting() {
    const [context, setContext] = useState({});

    useEffect(() => {
        if (import.meta.env.VITE_BOARD_ID && import.meta.env.VITE_VIEW_ID) {
            const localContext = {
                account: {id: parseInt(import.meta.env.VITE_ACCOUNT_ID)},
                user: {id: parseInt(import.meta.env.VITE_USER_ID)},
                boardId: parseInt(import.meta.env.VITE_BOARD_ID),
                boardViewId: parseInt(import.meta.env.VITE_VIEW_ID),
            };
            setContext(localContext);
            sessionStorage.setItem(STORAGE_MONDAY_CONTEXT_KEY, JSON.stringify(localContext));
        } else {
            monday.listen("context", (context) => {
                setContext(context.data);
                sessionStorage.setItem(STORAGE_MONDAY_CONTEXT_KEY, JSON.stringify(context.data));
            });
        }
    }, []);

    return (
        <>
            <h1>Hello world</h1>
            <span>{JSON.stringify(context)}</span>
        </>
    );
}

export default Reporting;
