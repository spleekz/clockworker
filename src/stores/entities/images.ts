import { makeAutoObservable } from 'mobx'

type ImagesWithSrc = {
  [key: string]: string
}
type ImageList = {
  [key: keyof ImagesWithSrc]: {
    element: HTMLImageElement
    isLoaded: boolean
  }
}

type LoadImageConfig = {
  imageName: keyof ImagesWithSrc
  imageSrc: string
}

export class Images {
  constructor(imagesWithSrc: ImagesWithSrc) {
    Object.keys(imagesWithSrc).forEach((key) => {
      this.createImage(key)
    })
    Object.keys(imagesWithSrc).forEach((key) => {
      this.loadImage({ imageName: key, imageSrc: imagesWithSrc[key] })
    })

    makeAutoObservable(this, {}, { autoBind: true })
  }

  list: ImageList = {}

  get allAreLoaded(): boolean {
    return Object.keys(this.list).every((key) => this.list[key].isLoaded)
  }

  createImage(imageName: keyof ImagesWithSrc): void {
    this.list[imageName] = {
      element: new Image(),
      isLoaded: false,
    }
  }
  loadImage({ imageName, imageSrc }: LoadImageConfig): void {
    this.list[imageName].element.addEventListener('load', () => {
      this.list[imageName].isLoaded = true
    })

    this.list[imageName].element.src = imageSrc
  }
}
