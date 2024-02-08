import {$applyNodeReplacement, ParagraphNode} from "lexical";

export default class DivParagraphNode extends ParagraphNode {
    static getType() {
        return "div-paragraph";
    }

    static clone(node) {
        return new DivParagraphNode(node.__key);
    }

    static importDOM() {
        return {
            p: () => ({
                conversion: convertDivParagraphElement,
                priority: 0,
            }),
            div: () => ({
                conversion: convertDivParagraphElement,
                priority: 0,
            }),
        };
    }

    createDOM() {
        return document.createElement('div');
    }

    exportJSON() {
        const serialized = super.exportJSON();
        serialized.type = DivParagraphNode.getType();
        return serialized;
    }
}

function convertDivParagraphElement(element) {
    const node = $createDivParagraphNode();
    if (element.style) {
        node.setFormat(element.style.textAlign);
        const indent = parseInt(element.style.textIndent, 10) / 20;
        if (indent > 0) {
            node.setIndent(indent);
        }
    }
    return {node};
}

export function $createDivParagraphNode() {
    return $applyNodeReplacement(new DivParagraphNode());
}

export function $isDivParagraphNode(node) {
    return node instanceof DivParagraphNode;
}