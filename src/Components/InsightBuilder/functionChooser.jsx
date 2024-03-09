import {List, ListItem, Dialog, DialogContentContainer} from 'monday-ui-react-core';
import {Heading} from 'monday-ui-react-core/next';
import {FUNCTIONS} from "./insightsFunctions.js";

function FunctionCombobox({currentFunction, setFunction}) {
    function onFunctionSelect(value) {
        setFunction(value);
    }

    return <DialogContentContainer>
        <List className="insight-list" component={List.components.DIV}>
            {FUNCTIONS.map((func) => {
                return <ListItem key={func.value}
                                 className="insight-list-item"
                                 onClick={() => onFunctionSelect(func.value)}
                                 selected={currentFunction?.value === func.value}>
                    {func.title}
                </ListItem>
            })}
        </List>
    </DialogContentContainer>
}

export default function FunctionChooser({insightData, setInsight}) {
    const func = FUNCTIONS.find((f) => f.value === insightData.function);
    return <Dialog wrapperClassName="insight-dialog"
                   position={Dialog.positions.BOTTOM}
                   content={<FunctionCombobox currentFunction={func}
                                              setFunction={(value) => setInsight("function", value)}/>}
                   showTrigger={[Dialog.hideShowTriggers.CLICK]}
                   hideTrigger={[Dialog.hideShowTriggers.CLICK, Dialog.hideShowTriggers.CLICK_OUTSIDE, Dialog.hideShowTriggers.CONTENT_CLICK]}>
        <Heading className={"insight-select-text"}
                 color={func ? Heading.colors.PRIMARY : Heading.colors.SECONDARY}
                 type={Heading.types.H1}
                 weight={Heading.weights.NORMAL}>
            {func ? func.title : "Function"}
        </Heading>
    </Dialog>
}