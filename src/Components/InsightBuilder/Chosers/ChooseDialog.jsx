import {createElement, useEffect, useState} from "react";
import {Dialog} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";

export default function ChooseDialog({insightData, setInsight, type, placeholder, component, childProps}) {
    const [hoverValue, setHoverValue] = useState();
    const [chosenValue, setChosenValue] = useState();

    useEffect(() => {
        setChosenValue(insightData[type]);
    }, [insightData]);

    function setValue(value) {
        setHoverValue(() => undefined);
        setChosenValue(value);
        setInsight(type, value);
    }

    return <Dialog wrapperClassName="insight-dialog"
                   containerSelector="#add-insight-modal"
                   position={Dialog.positions.BOTTOM}
                   content={createElement(component, {
                       ...childProps,
                       setHover: setHoverValue,
                       value: chosenValue,
                       setValue: setValue
                   })}
                   showTrigger={[Dialog.hideShowTriggers.CLICK]}
                   hideTrigger={[Dialog.hideShowTriggers.CLICK, Dialog.hideShowTriggers.CLICK_OUTSIDE, Dialog.hideShowTriggers.CONTENT_CLICK]}
                   onDialogDidHide={() => setHoverValue()}>
        <Heading className={!hoverValue && "insight-select-text"}
                 color={chosenValue ? Heading.colors.PRIMARY : Heading.colors.SECONDARY}
                 type={Heading.types.H1}>
            {hoverValue ? hoverValue
                : chosenValue ? chosenValue.label
                    : placeholder}
        </Heading>
    </Dialog>
}