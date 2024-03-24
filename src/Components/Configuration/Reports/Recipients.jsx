import {Flex, Dropdown, Text, Divider, Button} from "monday-ui-react-core";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getUsers} from "../../../Queries/monday.js";
import {useState} from "react";

function Recipient({prefix, value, setValue, extra, editable}) {
    const [searchValue, setSearchValue] = useState("");

    const {data: users, isLoading: isLoadingUsers} = useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers()
    });

    const options = users?.map((user) => ({
        label: user.name,
        value: user.email,
        leftAvatar: user.photo_tiny
    }));

    if (/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]+)$/.test(searchValue)) {
        options.push({
            label: searchValue,
            value: searchValue
        });
    }

    function generateValue() {
        if (!value) return [];
        return value.map(email => {
            const option = options?.find(option => option.value === email)
            if (option) return option;
            return {
                label: email,
                value: email
            }
        });
    }

    return [<Flex key="input" gap={Flex.gaps.SMALL} style={{width: "100%"}}>
        <Text type={Text.types.TEXT1} color={Text.colors.SECONDARY} style={{width: "30px"}}>{prefix}</Text>
        <Dropdown className="recipient-dropdown" multi
                  disabled={!editable}
                  isLoading={isLoadingUsers}
                  dropdownMenuWrapperClassName="recipient-dropdown-menu"
                  maxMenuHeight={200}
                  noOptionsMessage={() => "No monday users found.. But you can add a custom email!"}
                  options={options}
                  value={generateValue()}
                  onChange={(newValue) => {
                      if (newValue) setValue(newValue.map(({value}) => value))
                      else setValue([])
                  }}
                  onInputChange={setSearchValue}/>
        {extra && extra}
    </Flex>,
        <Divider key="divider" className="report-divider"/>
    ]
}

export default function Recipients({reportId, setReport, editable}) {
    const queryClient = useQueryClient();
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);

    function ccButtons() {
        return [
            <Button key="cc" active={report.cc}
                    size={Button.sizes.SMALL}
                    disabled={!editable}
                    onClick={() => {
                        if (report.cc) {
                            setReport("cc", null)
                        } else {
                            setReport("cc", [])
                        }
                    }}
                    kind={Button.kinds.TERTIARY}>
                Cc
            </Button>,
            <Button key="bcc" active={report.bcc}
                    size={Button.sizes.SMALL}
                    disabled={!editable}
                    onClick={() => {
                        if (report.bcc) {
                            setReport("bcc", null)
                        } else {
                            setReport("bcc", [])
                        }
                    }}
                    kind={Button.kinds.TERTIARY}>
                Bcc
            </Button>
        ]
    }

    return <Flex direction={Flex.directions.COLUMN} style={{width: "100%"}}>
        <Recipient prefix="To"
                   value={report.to}
                   setValue={(newValue) => setReport("to", newValue)}
                   editable={editable}
                   extra={ccButtons()}/>
        {report.cc && <Recipient prefix="Cc"
                                 value={report.cc}
                                 setValue={(newValue) => setReport("cc", newValue)}
                                 editable={editable}/>}
        {report.bcc && <Recipient prefix="Bcc"
                                  value={report.bcc}
                                  setValue={(newValue) => setReport("bcc", newValue)}
                                  editable={editable}/>}
    </Flex>
}