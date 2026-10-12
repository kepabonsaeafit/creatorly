// Author: Kevin Pabón

/** An item of the recent activity shown in HomeView. */
export interface OrderActivityInterface {
  id: number
  title: string
  timestamp: string
  type: 'default' | 'milestone'
}
