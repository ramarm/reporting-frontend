import "./init.js";
import ReactDOM from 'react-dom/client'
import Reporting from './Reporting.jsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {GoogleOAuthProvider} from "@react-oauth/google";
import "monday-ui-react-core/tokens";
import "./VibeHelper.css";
import "./VibeOverride.css";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Reporting/>
        </GoogleOAuthProvider>
    </QueryClientProvider>
)
