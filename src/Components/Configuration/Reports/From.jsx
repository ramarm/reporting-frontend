import {Avatar, Button, Col, Row, Select, Space, Typography} from "antd";
import AuthModal from "../../Auth/AuthModal.jsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {getEmailAccounts} from "../../../Queries/management.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";

const {Text} = Typography;

export default function From({reportId, setReport}) {
    const queryClient = useQueryClient();
    const {user} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);

    const {data: emailAccounts, isLoading: isLoadingEmailAccounts} = useQuery({
        queryKey: ["emailAccounts"],
        queryFn: getEmailAccounts
    });

    const options = emailAccounts?.map((emailAccount) => {
        return {
            label: emailAccount.email,
            value: emailAccount.email,
            customLabel: renderOption({
                picture: emailAccount.picture,
                name: emailAccount.name,
                email: emailAccount.email
            }),
            email: emailAccount.email,
            name: emailAccount.name,
            picture: emailAccount.picture
        }
    });

    function renderOption({picture, name, email}) {
        const nameInitials = name.split(" ").map((word) => word[0]).join("");
        return <Space size={5}>
            <Avatar size="small" src={picture}>{nameInitials}</Avatar>
            <Text>{email}</Text>
        </Space>
    }

    return <>
        <Row style={{padding: "4px 11px", width: "100%"}}>
            <Col>
                <Text>From</Text>
            </Col>
            <Col flex="auto">
                <Select style={{width: "100%"}}
                        size="small"
                        optionLabelProp="customLabel"
                        loading={isLoadingEmailAccounts}
                        variant="borderless"
                        options={options}
                        value={report.sender.email}
                        onChange={(value) => setReport("sender", {
                            user_id: user.id,
                            email: value
                        })}
                        optionRender={(option) => {
                            return renderOption({
                                picture: option.data.picture,
                                name: option.data.name,
                                email: option.data.email
                            })
                        }}/>
            </Col>
            <Col>
                <Button style={{float: "right"}}
                        size="small"
                        type="text"
                        onClick={() => setIsModalOpen(true)}>Add account</Button>
            </Col>
        </Row>
        <AuthModal isOpen={isModalOpen}
                   closeModal={() => setIsModalOpen(false)}/>
    </>
}