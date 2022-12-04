export class UsageController {
  prohibitors: Array<string> = []

  addProhibitor = (prohibitor: string): void => {
    this.prohibitors.push(prohibitor)
  }

  removeProhibitor = (prohibitor: string): void => {
    this.prohibitors = this.prohibitors.filter((p) => p !== prohibitor)
  }

  get isProhibited(): boolean {
    return this.prohibitors.length > 0
  }
}
