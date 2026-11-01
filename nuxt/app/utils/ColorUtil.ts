// Author: Kevin Pabón

export class ColorUtil {
  static availability(available: boolean): string {
    return available ? 'success' : 'secondary'
  }
}
