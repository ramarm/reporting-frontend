import {Button, Col, Divider, Row, Select, Space, Typography} from "antd";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getUsers} from "../../../Queries/monday.js";
import {renderOption} from "./GeneralComponents.jsx";

const {Text} = Typography;

function Recipient({options, isLoading, value, setValue, prefix, extra}) {
    return <Row style={{padding: "4px 11px", width: "100%"}}>
        <Col>
            <Text style={{lineHeight: "24px"}}>{prefix}</Text>
        </Col>
        <Col flex="auto">
            <Select style={{width: "100%"}}
                    mode="multiple"
                    optionLabelProp="customLabel"
                    loading={isLoading}
                    variant="borderless"
                    options={options}
                    value={value}
                    onChange={(newValue) => {
                        if (newValue) {
                            setValue(newValue)
                        } else {
                            setValue([])
                        }
                    }}
                    optionRender={(option) => {
                        return renderOption({
                            picture: option.data.picture,
                            name: option.data.name
                        })
                    }}/>
        </Col>
        {extra && <Col>
            {extra}
        </Col>}
    </Row>
}

export default function Recipients({reportId, setReport}) {
    const queryClient = useQueryClient();
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);

    const {data: users, isLoading: isLoadingUsers} = useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers()
    });

    const recipientOptions = users?.map((user) => {
        return {
            label: user.name,
            value: user.email,
            customLabel: renderOption({
                picture: user.photo_tiny,
                name: user.name
            }),
            email: user.email,
            name: user.name,
            picture: user.photo_tiny
        }
    });

    function recipientAddon() {
        return <div>
            {!report.cc && <Button type="text" onClick={() => setReport("cc", [])}>Cc</Button>}
            {!report.bcc && <Button type="text" onClick={() => setReport("bcc", [])}>Bcc</Button>}
        </div>
    }

    return <Space direction="vertical"
                  size={2}
                  split={<Divider style={{margin: 0}}/>}
                  style={{width: "100%"}}>
        <Recipient options={recipientOptions}
                   isLoading={isLoadingUsers}
                   value={report.to}
                   setValue={(newValue) => setReport("to", newValue)}
                   prefix="To"
                   extra={recipientAddon()}/>
        {report.cc && <Recipient options={recipientOptions}
                                 isLoading={isLoadingUsers}
                                 value={report.cc}
                                 setValue={(newValue) => setReport("cc", newValue)}
                                 prefix="Cc"/>}
        {report.bcc && <Recipient options={recipientOptions}
                                  isLoading={isLoadingUsers}
                                  value={report.bcc}
                                  setValue={(newValue) => setReport("bcc", newValue)}
                                  prefix="Bcc"/>}
    </Space>
}