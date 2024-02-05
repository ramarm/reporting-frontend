import {Avatar, Button} from "antd";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../consts.js";

const BASE_URL = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize`;
const SCOPES = ["openid", "profile", "offline_access", "User.Read", "Mail.Send"];

export default function MicrosoftAuth({closeModal}) {
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));

    function handleLogin() {
        closeModal();
        const redirectUrl = new URL("/api/v1/auth/microsoft", import.meta.env.VITE_MANAGEMENT_API).href;
        const queryParams = {
            client_id: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
            response_type: "code",
            redirect_uri: redirectUrl,
            response_mode: "query",
            scope: SCOPES.join(" "),
            state: JSON.stringify({
                app_id: import.meta.env.VITE_MONDAY_APP_ID,
                user_id: context.user.id,
                scopes: SCOPES
            })
        };
        const query = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join("&");
        const url = `${BASE_URL}?${query}`;
        window.open(url, "loginPopup", "width=600,height=600");
    }

    return <Button icon={<Avatar shape="square" style={{borderRadius: 0}}
                                 src="https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg"/>}
                   style={{height: "50px"}}
                   onClick={handleLogin}>
        Sign in with Microsoft
    </Button>;
}