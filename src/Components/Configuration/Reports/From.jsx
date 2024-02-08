import {Button, Col, Row, Select, Space, Typography} from "antd";
import AuthModal from "../../Auth/AuthModal.jsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {getEmailAccounts} from "../../../Queries/management.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {renderOption} from "./GeneralComponents.jsx";

const {Title, Text} = Typography;

export default function From({reportId, setReport}) {
    const queryClient = useQueryClient();
    const {user} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);

    const {
        data: emailAccounts,
        isLoading: isLoadingEmailAccounts,
        refetch: refetchEmailAccount
    } = useQuery({
        queryKey: ["emailAccounts"],
        queryFn: getEmailAccounts
    });

    const options = emailAccounts?.map((emailAccount) => {
        return {
            label: emailAccount.email,
            value: emailAccount.email,
            customLabel: renderOption({
                picture: emailAccount.picture,
                name: emailAccount.name
            }),
            email: emailAccount.email,
            name: emailAccount.name,
            picture: emailAccount.picture
        }
    });

    function emptyResult() {
        return <Space direction="vertical"
                      style={{
                          width: "100%",
                          textAlign: "center",
                          marginBottom: "10px"
                      }}>
            <Title level={4}>No email accounts associated with this user</Title>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>Add account</Button>
        </Space>
    }

    return <>
        <Row style={{padding: "4px 11px", width: "100%"}}>
            <Col>
                <Text style={{lineHeight: "24px"}}>From</Text>
            </Col>
            <Col flex="auto">
                <Select style={{width: "100%"}}
                        optionLabelProp="customLabel"
                        loading={isLoadingEmailAccounts}
                        variant="borderless"
                        options={options}
                        value={report?.sender?.email}
                        onChange={(_, option) => setReport("sender", {
                            user_id: user.id,
                            name: option.name,
                            email: option.email,
                        })}
                        notFoundContent={emptyResult()}
                        optionRender={(option) => {
                            return renderOption({
                                picture: option.data.picture,
                                name: option.data.name
                            })
                        }}/>
            </Col>
            <Col>
                <Button style={{float: "right"}}
                        type="text"
                        onClick={() => setIsModalOpen(true)}>Add account</Button>
            </Col>
        </Row>
        <AuthModal isOpen={isModalOpen}
                   refetchAccount={refetchEmailAccount}
                   closeModal={() => setIsModalOpen(false)}/>
    </>
}