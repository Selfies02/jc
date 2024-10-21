import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Casillero_normal = React.lazy(
  () => import('./views/casilleros/casilleroNormal/CasilleroNormal'),
)
const Casillero_express = React.lazy(
  () => import('./views/casilleros/casilleroExpress/CasilleroExpress'),
)
const Reportar_paquete = React.lazy(() => import('./views/reportarPaquete/ReportarPaquete'))
const reportar_salida = React.lazy(() => import('./views/reportarSalida/ReportarSalida'))
const Reportar_llegada = React.lazy(() => import('./views/reportarLLegada/ReportarLLegada'))
const Facturar = React.lazy(() => import('./views/facturar/Facturar'))
const Perfil = React.lazy(() => import('./views/perfil/Perfil'))
const Facturas = React.lazy(() => import('./views/facturas/Factura'))
const Clientes = React.lazy(() => import('./views/clientes/Clientes'))
const Configuraciones = React.lazy(() => import('./views/configuraciones/Configuraciones'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/clientes', name: 'Clientes', element: Clientes },
  { path: '/casillero_normal', name: 'Casillero_normal', element: Casillero_normal },
  { path: '/casillero_express', name: 'Casillero_express', element: Casillero_express },
  { path: '/reportar_paquete', name: 'Reportar_paquete', element: Reportar_paquete },
  { path: '/reportar_salida', name: 'Reportar_salida', element: reportar_salida },
  { path: '/reportar_llegada', name: 'Reportar_llegada', element: Reportar_llegada },
  { path: '/facturar', name: 'Facturar', element: Facturar },
  { path: '/perfil', name: 'Perfil', element: Perfil },
  { path: '/facturas', name: 'Facturas', element: Facturas },
  { path: '/configuraciones', name: 'Configuraciones', element: Configuraciones },
]

export default routes
