// Kevin Pabón

/** Un ítem de la actividad reciente del HomeView. */
export interface OrderActivity {
  id: string
  title: string
  timestamp: string
  type: 'default' | 'milestone'
}
