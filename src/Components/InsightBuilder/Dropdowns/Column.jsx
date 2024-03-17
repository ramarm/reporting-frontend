import {List, ListItem, DialogContentContainer, Loader} from 'monday-ui-react-core';
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {useQuery} from "@tanstack/react-query";
import {getBoardColumns} from "../../../Queries/monday.js";

export default function ColumnCombobox({setHover, value, setValue, extraColumns, columnTypes}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));

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

    return <DialogContentContainer>
        {isLoadingColumns
            ? <Loader size={Loader.sizes.SMALL}/>
            : <List className="insight-list" component={List.components.DIV}>
                {extraColumns?.map((option) => {
                    return <ListItem key={option.id}
                                     className="insight-list-item"
                                     onHover={() => setHover(option.title)}
                                     onClick={() => onClick(option)}
                                     selected={value?.value === option.id}>
                        {option.title}
                    </ListItem>
                })}
                {columns.map((column) => {
                    return <ListItem key={column.id}
                                     className="insight-list-item"
                                     onHover={() => setHover(column.title)}
                                     onClick={() => onClick(column)}
                                     selected={value?.value === column.id}>
                        {column.title}
                    </ListItem>
                })}
            </List>}
    </DialogContentContainer>
}