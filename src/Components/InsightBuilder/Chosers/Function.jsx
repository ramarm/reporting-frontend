import {List, ListItem, DialogContentContainer} from 'monday-ui-react-core';
import {FUNCTIONS} from "../insightsFunctions.js";

export default function FunctionCombobox({hover, setHover, value, setValue}) {
    const hoverFunction = FUNCTIONS.find((func) => func.value === hover);
    const currentFunction = FUNCTIONS.find((func) => func.value === value);

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
                                 selected={currentFunction?.value === func.value}>
                    {func.title}
                </ListItem>
            })}
        </List>
    </DialogContentContainer>
}

