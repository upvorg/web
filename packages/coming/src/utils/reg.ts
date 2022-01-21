const imagesReg = /!\[.*?\]\((.*?)\)/g

const getCoverFormMd = (text: string = '') => {
  const cover = text.match(/!\[suo\]\((.*?)\)/)

  if (cover) {
    return {
      titile: 'cover',
      url: cover[1]
    }
  } else {
    const match = text.match(imagesReg)
    if (match) {
      return {
        title: match[1],
        url: match[2]
      }
    }
  }

  return {
    title: '',
    url: ''
  }
}

const removeImagesFormMd = (text: string) => {
  return text.replace(imagesReg, '')
}

export { getCoverFormMd, removeImagesFormMd }
