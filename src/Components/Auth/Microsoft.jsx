import {Flex, Avatar, Text, Button} from "monday-ui-react-core";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../consts.js";

const BASE_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`;
const SCOPES = ["openid", "profile", "offline_access", "User.Read", "Mail.Send"];

export default function MicrosoftAuth({setSender, closeModal}) {
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));

    async function handleLogin() {
        closeModal();
        const redirectUrl = new URL("/api/v1/auth/microsoft", import.meta.env.VITE_MANAGEMENT_API).href;
        const queryParams = {
            client_id: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
            response_type: "code",
            redirect_uri: redirectUrl,
            response_mode: "query",
            prompt: "select_account",
            scope: SCOPES.join(" "),
            state: JSON.stringify({
                app_id: import.meta.env.VITE_MONDAY_APP_ID,
                user_id: Number(context.user.id),
                scopes: SCOPES
            })
        };
        const query = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join("&");
        const url = `${BASE_URL}?${query}`;
        const popup = window.open(url, "loginPopup", "width=600,height=600");
        const popupListener = setInterval(async () => {
            if (!popup || popup.closed) {
                await setSender("__LAST_EMAIL_ACCOUNT__");
                clearInterval(popupListener);
            }
        }, 500);
    }

    return <Button style={{height: "50px", width: "250px"}}
                   kind={Button.kinds.SECONDARY}
                   onClick={handleLogin}>
        <Flex gap={Flex.gaps.SMALL} justify={Flex.justify.SPACE_BETWEEN} style={{width: "100%"}}>
            <Avatar square={true} withoutBorder
                    type={Avatar.types.IMG}
                    size={Avatar.sizes.MEDIUM}
                    src="https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg"/>
            <Text type={Text.types.TEXT1} style={{flexGrow: 1, textAlign: "center"}}>Sign in with Microsoft</Text>
        </Flex>
    </Button>;
}