const { download } = require('./utils.js')
const fs = require('fs')

let getImgurLink = (hsh, ext) => `https://i.imgur.com/${hsh}${ext}`

let sleep = (ms = 500) => new Promise(r => setTimeout(r, ms))

let batchedDownload = async (allImages, dir) => {
  let batched = allImages.reduce((acc, asset, index) => {
    if (index % 5 === 0) {
      return [...acc, [asset]]
    } else {
      let last = acc[acc.length - 1]
      let temp = acc.slice(0, acc.length - 1)
      return [...temp, [...last, asset]]
    }
  }, [])
  for (let batch of batched) {
    await sleep()
    batch.forEach((asset, index) => {
      const link = getImgurLink(asset.hash, asset.ext)
      download(
        link,
        `./static/${dir}/${asset.title || index}${asset.ext}`,
        arg => {
          if (typeof arg === 'string') {
            console.log(arg)
          }
        },
      )
    })
  }
}

let downloadDecks = async () => {
  let pathToDecks = './static/decks.json'

  let decks = fs.readFileSync(pathToDecks, 'utf8')
  decks = JSON.parse(decks)
  await batchedDownload(decks, 'deck-images')
}

let downloadCards = async () => {
  let pathToCards = './static/cards.json'

  let cards = fs.readFileSync(pathToCards, 'utf8')
  cards = JSON.parse(cards)
  await batchedDownload(cards, 'card-images')
}

const main = async () => {
  // downloadDecks()
  downloadCards()
}

main()
