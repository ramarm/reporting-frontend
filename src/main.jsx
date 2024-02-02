import ReactDOM from 'react-dom/client'
import Reporting from './Reporting.jsx'
import {App, ConfigProvider} from "antd";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider
        theme={{
            token: {
                fontFamily: "-apple-system, Poppins, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
                colorTextPlaceholder: "rgba(0,0,0,0.7)"
            }
        }}>
        <App>
            <QueryClientProvider client={queryClient}>
                <Reporting/>
            </QueryClientProvider>
        </App>
    </ConfigProvider>
)
