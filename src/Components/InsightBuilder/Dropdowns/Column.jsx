import {Flex, Text, List, ListItem, DialogContentContainer, Loader, Search} from 'monday-ui-react-core';
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {useQuery} from "@tanstack/react-query";
import {getBoardColumns} from "../../../Queries/monday.js";
import {useState} from "react";

const columnNameMapping = {
    "numbers": "Number",
    "status": "Status",
    "people": "People",
    "date": "Date",
    "dropdown": "Dropdown"
}

export default function ColumnCombobox({setHover, value, setValue, extraColumns = [], columnTypes}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [search, setSearch] = useState("")

    const {data: columns, isLoading: isLoadingColumns} = useQuery({
        queryKey: ["columns", columnTypes],
        queryFn: () => getBoardColumns({boardId, types: columnTypes})
    });

    function onClick(value) {
        setValue({
            label: value.title,
            value: value.id,
            type: value.type
        })
    }

    function generateList() {
        const columnToGenerate = [...extraColumns, ...columns];

        if (columnToGenerate.length === 0) {
            const supportedColumns = columnTypes.map((type) => columnNameMapping[type]).join(", ");
            return <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL} style={{padding: "5px 15px"}}>
                <Text type={Text.types.TEXT1} weight={Text.weights.MEDIUM}>No supported columns in the board</Text>
                <Text type={Text.types.TEXT2}>The supported columns are: {supportedColumns}</Text>
            </Flex>;
        }

        return <Flex gap={Flex.gaps.XS} direction={Flex.directions.COLUMN}>
            <Search size={Search.sizes.SMALL}
                    placeholder="Search"
                    debounceRate={100}
                    value={search}
                    onChange={setSearch}/>
            <List className="insight-list" component={List.components.DIV} style={{width: 200}}>
                {columnToGenerate
                    .filter((column) => column.title.toLowerCase().includes(search.toLowerCase()))
                    .map((column) => {
                        return <ListItem key={column.id}
                                         className="insight-list-item"
                                         onHover={() => setHover(column.title)}
                                         onClick={() => onClick(column)}
                                         selected={value?.value === column.id}>
                            {column.title}
                        </ListItem>
                    })}
            </List>
        </Flex>
    }

    return <DialogContentContainer>
        {isLoadingColumns
            ? <Loader size={Loader.sizes.SMALL}/>
            : generateList()}
    </DialogContentContainer>
}