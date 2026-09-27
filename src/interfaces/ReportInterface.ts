// Kevin Pabón

/** Tipos de reporte disponibles en ReportsView. */
export type ReportType = 'month' | 'status' | 'creator' | 'brand'

/** Una opción del selector de tipo de reporte de ReportsView. */
export interface ReportOption {
  id: ReportType
  label: string
}
