declare global {
    interface Element {
        appendElement(
            tagName: keyof HTMLElementTagNameMap,
            content: string,
            insertAfter: boolean,
            attributes?: object,
            options?: ElementCreationOptions
        ): void
    }
}

Element.prototype.appendElement = function (
    tagName: keyof HTMLElementTagNameMap,
    content: string,
    insertAfter: boolean = false,
    attributes?: { [key: string]: any },
    options?: ElementCreationOptions
) {
    const el = document.createElement(tagName, options)
    el.innerText = content

    Object.keys(attributes).forEach(att => {
        el.setAttribute(att, attributes[att])
    })

    if (insertAfter) {
        this.parentNode.insertBefore(el, this.nextSibling)
    } else {
        this.appendChild(el)
    }
}

function getElementByXpath(path: string): Node | null {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}

function getElementsByAttribute(attributeName: string, keyword: string): Element[] {
    const elements = document.querySelectorAll(`[${attributeName}]`)
    return [].slice.call(elements).filter((el: Element) => el.getAttribute(attributeName).indexOf(keyword) > -1)
}

export { getElementByXpath, getElementsByAttribute }
