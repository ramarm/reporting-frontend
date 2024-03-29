import {createElement, useState} from "react";
import {Clickable, Dialog} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";

export default function ChooseDialog({value, setValue, placeholder, component, childProps}) {
    const [isOpen, setIsOpen] = useState(false);
    const [hoverValue, setHoverValue] = useState();

    function onSelect(value) {
        setIsOpen(false);
        setHoverValue(() => undefined);
        setValue(value);
    }

    return <Dialog containerSelector="#add-insight-modal"
                   open={isOpen}
                   position={Dialog.positions.BOTTOM}
                   content={createElement(component, {
                       ...childProps,
                       setHover: setHoverValue,
                       value: value,
                       setValue: onSelect
                   })}
                   showTrigger={[]}
                   hideTrigger={[]}
                   onClickOutside={() => {
                       setIsOpen(false)
                       setHoverValue(() => undefined);
                   }}>
        <Clickable onClick={() => setIsOpen((prev) => !prev)}>
            <Heading className={"insight-select-text"}
                     style={{color: value ? "#323338" : "#c3c6d4"}}
                     type={Heading.types.H2}
                     weight={Heading.weights.LIGHT}>
                {hoverValue ? hoverValue
                    : value ? value.label
                        : placeholder}
            </Heading>
        </Clickable>
    </Dialog>
}