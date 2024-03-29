import {AttentionBox} from "monday-ui-react-core";

export default function ResultPage({title, message, status}) {
    const types = {
        error: AttentionBox.types.DANGER,
        warning: AttentionBox.types.WARNING,
        success: AttentionBox.types.SUCCESS
    }

    return (
        <AttentionBox className="result-page"
            type={types[status]}
            title={title}
            text={message || "Please contact us on rnd@spot-nik.com for further assistance"}/>
    );
}