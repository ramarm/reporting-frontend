import {List, ListItem, Dialog, DialogContentContainer} from 'monday-ui-react-core';
import {Heading} from 'monday-ui-react-core/next';
import {FUNCTIONS} from "./insightsFunctions.js";
import {useState} from "react";

function FunctionCombobox({setHoverFunction, currentFunction, setFunction}) {
    function onFunctionSelect(value) {
        setHoverFunction(value);
        setFunction(value);
    }

    return <DialogContentContainer>
        <List className="insight-list" component={List.components.DIV}>
            {FUNCTIONS.map((func) => {
                return <ListItem key={func.value}
                                 className="insight-list-item"
                                 onHover={() => setHoverFunction(func.value)}
                                 onClick={() => onFunctionSelect(func.value)}
                                 selected={currentFunction?.value === func.value}>
                    {func.title}
                </ListItem>
            })}
        </List>
    </DialogContentContainer>
}

export default function FunctionChooser({insightData, setInsight}) {
    const [hoverFunction, setHoverFunction] = useState();

    const tempFunction = FUNCTIONS.find((f) => f.value === hoverFunction);
    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function);

    return <Dialog wrapperClassName="insight-dialog"
                   position={Dialog.positions.BOTTOM}
                   content={<FunctionCombobox setHoverFunction={setHoverFunction}
                                              currentFunction={chosenFunction}
                                              setFunction={(value) => setInsight("function", value)}/>}
                   showTrigger={[Dialog.hideShowTriggers.CLICK]}
                   hideTrigger={[Dialog.hideShowTriggers.CLICK, Dialog.hideShowTriggers.CLICK_OUTSIDE, Dialog.hideShowTriggers.CONTENT_CLICK]}
                   onDialogDidHide={() => setHoverFunction()}>
        <Heading className={!tempFunction && "insight-select-text"}
                 color={chosenFunction ? Heading.colors.PRIMARY : Heading.colors.SECONDARY}
                 type={Heading.types.H1}>
            {tempFunction ? tempFunction.preview
                : chosenFunction ? chosenFunction.title
                    : "Function"}
        </Heading>
    </Dialog>
}