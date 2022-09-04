import { makeAutoObservable } from 'mobx'

type ImageContainerOptions = {
  loadImmediately?: boolean
}

export class ImageContainer<InitialImageList extends { [imageName: string]: string }> {
  private initialList: InitialImageList
  list: { [P in keyof InitialImageList]: { isLoaded: boolean; imageElement: HTMLImageElement } }

  constructor(initialImageList: InitialImageList, options?: ImageContainerOptions) {
    const { loadImmediately = false } = options ?? {}

    this.initialList = initialImageList
    this.configureImageList()

    if (loadImmediately) {
      this.loadAll()
    }

    makeAutoObservable(this, {}, { autoBind: true })
  }

  private configureImageList(): void {
    this.list = (Object.keys(this.initialList) as Array<keyof typeof this.initialList>).reduce(
      (acc, imageName) => {
        acc[imageName] = { isLoaded: false, imageElement: new Image() }
        return acc
      },
      {} as { [P in keyof InitialImageList]: { isLoaded: boolean; imageElement: HTMLImageElement } },
    )
  }

  loadImage(imageName: keyof InitialImageList): Promise<void> {
    return new Promise((resolve) => {
      this.list[imageName].imageElement.addEventListener('load', () => {
        this.list[imageName].isLoaded = true
        resolve()
      })
      this.list[imageName].imageElement.src = this.initialList[imageName]
    })
  }

  loadAll(): Promise<void> {
    return new Promise((resolve) => {
      const promises: Array<Promise<void>> = []
      ;(Object.keys(this.list) as Array<keyof typeof this.list>).forEach((imageName) => {
        promises.push(this.loadImage(imageName))
      })

      Promise.all(promises).then(() => {
        resolve()
      })
    })
  }

  get isAllImagesLoaded(): boolean {
    return Object.values(this.list).every((image) => image.isLoaded)
  }
}
