import {Avatar, Button} from "antd";
import {useGoogleLogin} from "@react-oauth/google";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../consts.js";
import {authGoogle} from "../../Queries/management.js";

const GOOGLE_API_URL = "https://www.googleapis.com";
const SCOPES = [
    "openid",
    `${GOOGLE_API_URL}/auth/userinfo.profile`,
    `${GOOGLE_API_URL}/auth/userinfo.email`,
    `${GOOGLE_API_URL}/auth/gmail.send`
]
export default function GoogleAuth({refetchAccounts, closeModal}) {
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const loginHook = useGoogleLogin({
        flow: "auth-code",
        scope: SCOPES.join(" "),
        onSuccess: (res) => handleAuth(res.code),
        onError: (error) => console.error("Failed authentication with google -", error)
    });

    function handleLogin() {
        closeModal();
        loginHook();
    }

    async function handleAuth(code) {
        await authGoogle({
            userId: context.user.id,
            scopes: SCOPES,
            code: code
        });
        refetchAccounts();
    }

    return <Button icon={<Avatar shape="square" style={{borderRadius: 0}}
                                 src="https://www.vectorlogo.zone/logos/google/google-icon.svg"/>}
                   style={{height: "50px", width: "220px"}}
                   onClick={handleLogin}>
        Sign in with Google
    </Button>;
}