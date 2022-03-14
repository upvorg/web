const imagesReg = /!\[(.*?)\]\((.*?)\)/
const imageDotType = /\.(png|jpg|jpeg|gif|svg|webp)/

const getCoverFormMd = (text: string = '') => {
  const cover = text.match(/!\[suo\]\((.*?)\)/)

  if (cover) {
    return {
      titile: 'cover',
      url: cover[1],
      type: cover[1].match(imageDotType)?.[0]
    }
  } else {
    const match = text.match(imagesReg)
    if (match) {
      return {
        title: match[1],
        url: match[2],
        type: match[2].match(imageDotType)?.[0]
      }
    }
  }

  return {
    title: 'cover',
    url: 'https://s2.loli.net/2022/01/22/IkS53uazMbyYHsp.jpg',
    type: 'jpg'
  }
}

const removeImagesFormMd = (text: string) => {
  return text.replace(imagesReg, '')
}

export { getCoverFormMd, removeImagesFormMd }
