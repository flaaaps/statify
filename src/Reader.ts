import { VideoMetadata } from "./types/index"
import { getElementsByAttribute } from "./utils/dom"

class Reader {
    readVideoMetadata(): Promise<VideoMetadata> {
        return new Promise((resolve, reject) => {
            let runs = 0
            let i: NodeJS.Timeout
            i = setInterval(() => {
                const likes = getElementsByAttribute("aria-label", "likes")[0]
                    ?.getAttribute("aria-label")
                    .match(/\d+/g)
                    .join("")
                const dislikes = getElementsByAttribute("aria-label", "dislikes")[0]
                    ?.getAttribute("aria-label")
                    .match(/\d+/g)
                    .join("")

                const views = document.querySelector(".view-count")?.textContent?.split(" ")[0]

                if (likes !== null && dislikes !== null && views !== null) {
                    const _likes = parseInt(likes)
                    const _dislikes = parseInt(dislikes)
                    const _views = parseInt(this.removePunctuation(views))

                    const totalRatings = _likes + _dislikes
                    clearInterval(i)
                    resolve({
                        likes: _likes,
                        dislikes: _dislikes,
                        totalRatings: totalRatings,
                        views: _views,
                    })
                }
                if (runs === 9) {
                    reject("No more tries")
                    clearInterval(i)
                }
                runs++
            }, 1000)
        })
    }

    private removePunctuation(num: string) {
        return num.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    }
}

export default Reader
