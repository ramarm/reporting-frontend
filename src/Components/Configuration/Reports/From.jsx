import {Button, Col, Row, Select, Space, Typography} from "antd";
import AuthModal from "../../Auth/AuthModal.jsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {deleteEmailAccount, getEmailAccounts} from "../../../Queries/management.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {renderOption} from "./GeneralComponents.jsx";
import {DeleteOutlined} from "@ant-design/icons";

const {Title, Text} = Typography;

export default function From({reportId, setReport, editable}) {
    const queryClient = useQueryClient();
    const {user} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);
    const [sender, setSender] = useState(report?.sender?.email);

    const {
        data: emailAccounts,
        isLoading: isLoadingEmailAccounts,
        refetch: refetchEmailAccount
    } = useQuery({
        queryKey: ["emailAccounts"],
        queryFn: getEmailAccounts
    });

    useEffect(() => {
        if (editable) {
            if (emailAccounts && sender) {
                let account;
                if (sender === "__LAST_EMAIL_ACCOUNT__") {
                    account = emailAccounts.sort((a, b) => new Date(b.last_update) - new Date(a.last_update))[0];
                    setSender(account.email)
                } else {
                    account = emailAccounts.find((emailAccount) => emailAccount.email === sender)
                }
                setReport("sender", {
                    user_id: Number(user.id),
                    name: account.name,
                    email: account.email
                });
            }
        }
    }, [emailAccounts]);

    const options = emailAccounts?.map((emailAccount) => {
        let name;
        if (emailAccount.name.trim()) {
            name = emailAccount.name;
        } else {
            name = emailAccount.email;
        }
        return {
            label: emailAccount.email,
            value: emailAccount.email,
            customLabel: renderOption({
                picture: emailAccount.picture,
                name: name
            }),
            email: emailAccount.email,
            name: name,
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
                        disabled={!editable}
                        optionLabelProp="customLabel"
                        loading={isLoadingEmailAccounts}
                        variant="borderless"
                        options={options}
                        value={report?.sender?.email}
                        onChange={(_, option) => setReport("sender", {
                            user_id: Number(user.id),
                            name: option.name,
                            email: option.email
                        })}
                        notFoundContent={emptyResult()}
                        optionRender={(option) => {
                            return renderOption({
                                picture: option.data.picture,
                                name: option.data.name,
                                extra: <Button size="small"
                                               type="text"
                                               icon={<DeleteOutlined/>}
                                               onClick={(e) => {
                                                   e.stopPropagation();
                                                   if (report.sender?.email === option.data.email) {
                                                       setSender(null);
                                                       setReport("sender", null);
                                                   }
                                                   deleteEmailAccount({email: option.data.email})
                                                       .then(() => refetchEmailAccount())
                                               }}/>
                            })
                        }}/>
            </Col>
            <Col>
                <Button style={{float: "right"}}
                        disabled={!editable}
                        type="text"
                        onClick={() => setIsModalOpen(true)}>Add account</Button>
            </Col>
        </Row>
        <AuthModal isOpen={isModalOpen}
                   refetchAccount={refetchEmailAccount}
                   setSender={setSender}
                   closeModal={() => setIsModalOpen(false)}/>
    </>
}