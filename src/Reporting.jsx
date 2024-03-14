import './Reporting.css'
import mondaySdk from "monday-sdk-js";
import {useEffect, useState} from "react";
import {STORAGE_MONDAY_CONTEXT_KEY, STORAGE_SUBSCRIPTION_KEY} from "./consts.js";
import Loader from "./Components/Loader/Loader.jsx";
import ResultPage from "./Components/ResultPage.jsx";
import {getMe} from "./Queries/monday.js";
import {authorize, createUser, getSubscription, installApp, updateUserInformation} from "./Queries/management.js";
import {AlertBanner, AlertBannerButton, AlertBannerText, IconButton} from "monday-ui-react-core";
import {Upgrade, Help, Email} from "monday-ui-react-core/icons";
import TabsIndex from "./Components/Configuration/TabsIndex.jsx";

const monday = mondaySdk();
monday.setApiVersion(import.meta.env.VITE_MONDAY_API_VERSION);

function Reporting() {
    const [initialized, setInitialized] = useState(0); // 0 = Not initialized, 1 = Initializing, 2 = Initialized, 3 = Error
    const [result, setResult] = useState();
    const [context, setContext] = useState({});
    const subscription = JSON.parse(sessionStorage.getItem(STORAGE_SUBSCRIPTION_KEY));

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

    async function checkAuthorization(user) {
        try {
            await authorize();
            return true;
        } catch (error) {
            if (error.error_code === "USER_NOT_FOUND") {
                await createUser(user);
                await installApp({
                    accountId: user.account.id,
                    userId: user.id,
                    userName: user.name,
                    userEmail: user.email
                });
                return true;
            }
            if (error.error_code === "APP_NOT_FOUND_IN_USER") {
                await installApp({
                    accountId: user.account.id,
                    userId: user.id,
                    userName: user.name,
                    userEmail: user.email
                });
                return true;
            }
            setResult({
                status: "error",
                title: "Unauthorized"
            });
            return false;
        }
    }

    async function initializeUserInformation(user) {
        try {
            await updateUserInformation(user);
            return true;
        } catch (error) {
            setResult({
                status: "error",
                title: "Couldn't update user information"
            });
            return false;
        }
    }

    async function setSubscription() {
        try {
            const fetchedSubscription = await getSubscription();
            sessionStorage.setItem(STORAGE_SUBSCRIPTION_KEY, JSON.stringify(fetchedSubscription));
            return true;
        } catch (error) {
            setResult({
                status: "error",
                title: "Couldn't load subscription"
            })
            return false;
        }
    }

    async function handleInitialization() {
        let user;
        try {
            user = await getMe();
        } catch (err) {
            setResult({
                status: "error",
                title: "Couldn't load user information"
            });
            throw err;
        }

        await checkAuthorization(user);

        const res = await Promise.all([
            initializeUserInformation(user),
            setSubscription()
        ]);
        return res.every(result => result);
    }

    useEffect(() => {
        if (initialized === 0 && context) {
            setInitialized(1);
            handleInitialization()
                .then((res) => {
                    if (res) {
                        setInitialized(2);
                    } else {
                        setInitialized(3);
                    }
                })
                .catch(() => {
                    setInitialized(3);
                });
        }
    }, [context]);

    function isLoading() {
        return [0, 1].includes(initialized);
    }

    if (result) {
        return <ResultPage title={result.title}
                           message={result.message}
                           status={result.status}
                           extra={result.extra}/>
    }

    if (initialized === 3) {
        return <ResultPage status="error" title="Failed to load Insights"/>
    }

    if (isLoading()) {
        return <Loader/>;
    }

    return (
        <div>
            {subscription.is_default &&
                <div style={{
                    textAlign: "center",
                    lineHeight: "40px",
                    backgroundColor: "#333",
                    color: "white",
                    fontSize: "18px"
                }}>
                    <AlertBanner isCloseHidden={true}
                                 backgroundColor={AlertBanner.backgroundColors.DARK}>
                        <AlertBannerText text="Your account is currently on the Free plan"/>
                        <AlertBannerButton leftIcon={Upgrade}
                                           onClick={() => {
                                               monday.execute('openPlanSelection');
                                           }}>Change plan</AlertBannerButton>
                    </AlertBanner>
                </div>}
            <TabsIndex/>
            <div id="floating-icon-container" className="horizontal-space">
                <IconButton icon={Email} className="floating-icon"
                            kind={IconButton.kinds.SECONDARY}
                            tooltipContent="Support"
                            onClick={() => monday.execute("openLinkInTab", {url: "mailto:rnd@spot-nik.com"})}/>
                <IconButton icon={Help} className="floating-icon"
                            kind={IconButton.kinds.SECONDARY}
                            tooltipContent="FAQ"
                            onClick={() => monday.execute("openLinkInTab", {url: "https://www.spot-nik.com/how-to-use-insights"})}/>
            </div>
        </div>
    );
}

export default Reporting;
