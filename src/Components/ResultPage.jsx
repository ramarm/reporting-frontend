import {Result} from "antd";

export default function ResultPage({title, message, status, extra}) {
    return (
        <Result
            title={title}
            subTitle={message || "Please contact us on rnd@spot-nik.com for further assistance"}
            status={status || "info"}
            extra={extra}
        />
    );
}