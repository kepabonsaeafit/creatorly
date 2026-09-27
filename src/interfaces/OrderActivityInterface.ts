// Author: Kevin Pabón

/** An item of the recent activity shown in HomeView. */
export interface OrderActivity {
  id: string
  title: string
  timestamp: string
  type: 'default' | 'milestone'
}
