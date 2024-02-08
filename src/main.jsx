import ReactDOM from 'react-dom/client'
import Reporting from './Reporting.jsx'
import {App, ConfigProvider} from "antd";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {GoogleOAuthProvider} from "@react-oauth/google";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider
        theme={{
            token: {
                fontFamily: "-apple-system, Poppins, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
                colorTextPlaceholder: "rgba(0,0,0,0.7)",
                colorBgContainerDisabled: "rgba(0,0,0,0)",
                colorTextDisabled: "rgba(0,0,0,0.7)",
            }
        }}>
        <App>
            <QueryClientProvider client={queryClient}>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <Reporting/>
                </GoogleOAuthProvider>
            </QueryClientProvider>
        </App>
    </ConfigProvider>
)
