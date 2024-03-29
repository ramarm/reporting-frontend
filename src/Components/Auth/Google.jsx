import {Flex, Avatar, Text, Button} from "monday-ui-react-core";
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
export default function GoogleAuth({setSender, closeModal}) {
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
        const newEmail = (await authGoogle({
            userId: Number(context.user.id),
            scopes: SCOPES,
            code: code
        })).data;
        await setSender(newEmail);
    }

    return <Button style={{height: "50px", width: "250px"}}
                   kind={Button.kinds.SECONDARY}
                   onClick={handleLogin}>
        <Flex gap={Flex.gaps.SMALL} justify={Flex.justify.SPACE_BETWEEN} style={{width: "100%"}}>
            <Avatar square={true} withoutBorder
                    type={Avatar.types.IMG}
                    size={Avatar.sizes.MEDIUM}
                    src="https://www.vectorlogo.zone/logos/google/google-icon.svg"/>
            <Text type={Text.types.TEXT1} style={{flexGrow: 1, textAlign: "center"}}>Sign in with Google</Text>
        </Flex>
    </Button>;
}