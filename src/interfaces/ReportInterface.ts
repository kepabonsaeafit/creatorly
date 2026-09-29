// Author: Kevin Pabón

/** Report types available in ReportsView. */
export type ReportType = 'month' | 'status' | 'creator' | 'brand'

/** An option of ReportsView's report-type selector. */
export interface ReportOption {
  id: ReportType
  label: string
}
