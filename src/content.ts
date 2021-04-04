import Reader from "./Reader"
import { getElementsByAttribute } from "./utils/dom"

let prevUrl = resolveUrl(window.location.href)

if (document.readyState !== "loading") {
    main()
} else {
    document.addEventListener("load", function () {
        main()
    })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.message === "url-change") {
        const url = resolveUrl(request.url)
        if (window.location.pathname.includes("watch")) {
            if (url !== prevUrl) {
                prevUrl = url
                main()
            }
        }
    }
})

async function main() {
    console.log("Loaded.")
    if (document.getElementsByTagName("html")[0].getAttribute("lang").indexOf("en") === -1) {
        console.log("Please change your YouTube language to english") // TODO: Explicitly warn user
        return
    }
    const reader = new Reader()
    const metadata = await reader.readVideoMetadata()
    console.log(metadata)
    const likeRate = (metadata.likes / metadata.totalRatings) * 100
    const dislikeRate = (metadata.dislikes / metadata.totalRatings) * 100

    const likesEl = getElementsByAttribute("aria-label", "likes")[0]
    const dislikesEl = getElementsByAttribute("aria-label", "dislikes")[0]

    if (document.querySelector(".like-rate")) {
        document.querySelectorAll("a.ytd-toggle-button-renderer")[0].removeChild(document.querySelector(".like-rate"))
        document
            .querySelectorAll("a.ytd-toggle-button-renderer")[1]
            .removeChild(document.querySelector(".dislike-rate"))
    }
    likesEl.appendElement("span", Math.floor(likeRate).toString() + "%", true, { class: "like-rate" })
    dislikesEl.appendElement("span", Math.ceil(dislikeRate).toString() + "%", true, { class: "dislike-rate" })
}

function resolveUrl(url: string) {
    if (url.indexOf("&") > -1) {
        console.log(url.split("&")[0])
        return url.split("&")[0]
    }
    return url
}
