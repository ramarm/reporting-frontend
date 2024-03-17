import {$isTextNode, TextNode} from "lexical";


function patchStyleConversion(originalDOMConverter) {
    return (node) => {
        const original = originalDOMConverter?.(node);
        if (!original) return null;

        const originalOutput = original.conversion(node);
        if (!originalOutput) return originalOutput

        const backgroundColor = node.style.backgroundColor;
        const color = node.style.color;
        const fontFamily = node.style.fontFamily;
        const fontSize = node.style.fontSize;

        return {
            ...originalOutput,
            forChild: (lexicalNode, parent) => {
                const originalForChild = originalOutput?.forChild ?? ((x) => x);
                const result = originalForChild(lexicalNode, parent);
                if ($isTextNode(result)) {
                    const style = [
                        backgroundColor ? `background-color: ${backgroundColor}` : null,
                        color ? `color: ${color}` : null,
                        fontFamily ? `font-family: ${fontFamily}` : null,
                        fontSize ? `font-size: ${fontSize}` : null
                    ]
                        .filter((value) => value != null)
                        .join("; ");
                    if (style.length) {
                        return result.setStyle(style);
                    }
                }
                return result;
            }
        };
    };
}

export class ExtendedTextNode extends TextNode {
    static getType() {
        return "extended-text";
    }

    static clone(node) {
        return new ExtendedTextNode(node.__text, node.__key);
    }

    static importDOM() {
        const importers = TextNode.importDOM();
        return {
            ...importers,
            code: () => ({
                conversion: patchStyleConversion(importers?.code),
                priority: 1,
            }),
            em: () => ({
                conversion: patchStyleConversion(importers?.em),
                priority: 1
            }),
            span: () => ({
                conversion: patchStyleConversion(importers?.span),
                priority: 1
            }),
            strong: () => ({
                conversion: patchStyleConversion(importers?.strong),
                priority: 1
            }),
            sub: () => ({
                conversion: patchStyleConversion(importers?.sub),
                priority: 1
            }),
            sup: () => ({
                conversion: patchStyleConversion(importers?.sup),
                priority: 1
            })
        }
    }

    static importJSON(serializedNode) {
        return TextNode.importJSON(serializedNode);
    }

    exportJSON() {
        const serialized = super.exportJSON();
        serialized.type = ExtendedTextNode.getType();
        return serialized;
    }

    cleanWhiteSpace(element) {
        element.style.whiteSpace = null;
        for (const child of element.children) {
            this.cleanWhiteSpace(child);
        }
    }

    exportDOM(editor) {
        const {element} = super.exportDOM(editor);
        this.cleanWhiteSpace(element);
        return {element};
    }
}