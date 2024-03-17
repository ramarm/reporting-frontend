import {createElement, useState} from "react";
import {Dialog} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";

export default function ChooseDialog({value, setValue, placeholder, component, childProps}) {
    const [hoverValue, setHoverValue] = useState();

    function onSelect(value) {
        setHoverValue(() => undefined);
        setValue(value);
    }

    return <Dialog wrapperClassName="insight-dialog"
                   containerSelector="#add-insight-modal"
                   position={Dialog.positions.BOTTOM}
                   content={createElement(component, {
                       ...childProps,
                       setHover: setHoverValue,
                       value: value,
                       setValue: onSelect
                   })}
                   showTrigger={[Dialog.hideShowTriggers.CLICK]}
                   hideTrigger={[Dialog.hideShowTriggers.CLICK, Dialog.hideShowTriggers.CLICK_OUTSIDE, Dialog.hideShowTriggers.CONTENT_CLICK]}
                   onDialogDidHide={() => setHoverValue()}>
        <Heading className={"insight-select-text"}
                 color={value ? Heading.colors.PRIMARY : Heading.colors.SECONDARY}
                 type={Heading.types.H1}
                 weight={Heading.weights.LIGHT}>
            {hoverValue ? hoverValue
                : value ? value.label
                    : placeholder}
        </Heading>
    </Dialog>
}