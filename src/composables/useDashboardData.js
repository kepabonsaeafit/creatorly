import { ref } from 'vue'

export function useDashboardData() {
  const stats = ref([
    { id: 'followers', label: 'Seguidores', value: 12480, delta: 4.2, unit: '' },
    { id: 'views', label: 'Vistas', value: 89345, delta: 12.8, unit: '' },
    { id: 'revenue', label: 'Ingresos', value: 3240, delta: -2.1, unit: '$' },
    { id: 'engagement', label: 'Interacción', value: 6.4, delta: 0.9, unit: '%' },
  ])

  const activity = ref([
    {
      id: 1,
      title: 'Se alcanzó un nuevo hito de seguidores',
      timestamp: '2026-08-14T09:12:00Z',
      type: 'milestone',
    },
    {
      id: 2,
      title: 'Se publicó el video "Detrás de Cámaras"',
      timestamp: '2026-08-13T16:40:00Z',
      type: 'content',
    },
    {
      id: 3,
      title: 'Pago mensual procesado',
      timestamp: '2026-08-12T08:00:00Z',
      type: 'payment',
    },
  ])

  return { stats, activity }
}
