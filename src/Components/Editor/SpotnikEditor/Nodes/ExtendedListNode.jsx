import {ListNode} from "@lexical/list";

function styleListNode(domNode) {
    let listType = null;
    const start = domNode.getAttribute("start") || 1;
    if (domNode instanceof HTMLOListElement) {
        listType = "number";
    }
    if (domNode instanceof HTMLUListElement) {
        listType = "bullet";
    }
    if (listType) {
        const node = $createExtendedListNode(listType, start);
        node.setFormat(domNode.style.textAlign);
        return {node};
    }
}

export class ExtendedListNode extends ListNode {
    static getType() {
        return "extended-list";
    }

    static clone(node) {
        return new ExtendedListNode(node.getListType(), node.getStart());
    }

    static importJSON(serializedNode) {
        return ListNode.importJSON(serializedNode);
    }

    static importDOM() {
        const importers = ListNode.importDOM();
        return {
            ...importers,
            ol: () => ({
                conversion: styleListNode,
                priority: 1
            }),
            ul: () => ({
                conversion: styleListNode,
                priority: 1
            })
        }
    }

    exportJSON() {
        const serialized = super.exportJSON();
        serialized.type = ExtendedListNode.getType();
        return serialized;
    }

    createDOM(config, _editor) {
        const element = super.createDOM(config, _editor);
        element.style.textAlign = this.getFormatType();
        element.style.direction = this.getDirection();
        return element;
    }
}

export function $createExtendedListNode(listType, start) {
    return new ExtendedListNode(listType, start);
}

export function $isExtendedListNode(node) {
    return node instanceof ExtendedListNode;
}

export function $getExtendedListNode(node) {
    if (!node) {
        return null;
    }
    if ($isExtendedListNode(node)) {
        return node;
    }
    return $getExtendedListNode(node.getParent());
}
