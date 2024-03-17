import {List, ListItem, DialogContentContainer} from 'monday-ui-react-core';
import {FUNCTIONS} from "../insightsFunctions.jsx";

export default function FunctionCombobox({setHover, value, setValue}) {
    function onClick(value) {
        setValue({
            label: value.title,
            value: value.value
        })
    }

    return <DialogContentContainer>
        <List className="insight-list" component={List.components.DIV}>
            {FUNCTIONS.map((func) => {
                return <ListItem key={func.value}
                                 className="insight-list-item"
                                 onHover={() => setHover(func.preview)}
                                 onClick={() => onClick(func)}
                                 selected={value?.value === func.value}>
                    {func.title}
                </ListItem>
            })}
        </List>
    </DialogContentContainer>
}

