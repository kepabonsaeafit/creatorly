// Kevin Pabón

/** Tipos de reporte disponibles en ReportesView. */
export type TipoReporte = 'mes' | 'estado' | 'creador' | 'marca'

/** Una opción del selector de tipo de reporte de ReportesView. */
export interface OpcionReporte {
  id: TipoReporte
  label: string
}
