import {Button, IconButton, Toast, Flex, Text} from "monday-ui-react-core";
import {CloseSmall, Send} from "monday-ui-react-core/icons";
import {useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {sendReport} from "../../../Queries/reporting.js";

export default function SendNowButton({report, size}) {
    const [errorMessage, setErrorMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
        }
    }, [isSuccess]);

    const {
        mutate: sendReportMutation,
        isPending: isSending
    } = useMutation({
        mutationFn: () => sendReport({reportId: report.id}),
        onSuccess: () => {
            setIsSuccess(true);
            setErrorMessage("");
        },
        onError: (err) => {
            setErrorMessage(err.message);
        }
    });

    function _sendReport() {
        if (report.sender === null) {
            setErrorMessage("Please set a sender for the report");
            return;
        }
        if (report.to === null || report.to.length === 0) {
            setErrorMessage("Please set at least one recipient for the report");
            return;
        }
        sendReportMutation();
    }

    return [<Button key="send-now-button" kind={Button.kinds.TERTIARY} leftIcon={Send}
                    size={size}
                    disabled={isSending}
                    loading={isSending}
                    success={isSuccess}
                    successIcon={Send}
                    successText="Sent"
                    onClick={(e) => {
                        e.stopPropagation();
                        _sendReport();
                    }}>
        Send now
    </Button>,
        <Toast key="send-now-error-toast" className="send-now-toast" open={!!errorMessage}
               type={Toast.types.NEGATIVE}
               onClose={() => setErrorMessage("")}
               autoHideDuration={10000}>
            <Flex gap={Flex.gaps.SMALL}>
                <Text type={Text.types.TEXT2}
                      color={Text.colors.ON_INVERTED}>{errorMessage}</Text>
                <IconButton icon={CloseSmall}
                            size={IconButton.sizes.SMALL}
                            color={IconButton.colors.ON_PRIMARY_COLOR}
                            onClick={(e) => {
                                e.stopPropagation();
                                setErrorMessage("")
                            }}/>
            </Flex>
        </Toast>]
}