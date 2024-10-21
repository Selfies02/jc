import React, { useContext } from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilInbox,
  cilMonitor,
  cilSend,
  cilDollar,
  cilBoatAlt,
  cilFlightTakeoff,
  cilTruck,
  cilPrint,
  cilUser,
  cilSettings,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
import { AuthContext } from './actions/authContext.js' // Importar el AuthContext

const _nav = () => {
  const { user } = useContext(AuthContext) // Acceder al contexto para obtener los permisos del usuario

  // Verificar si el usuario tiene permisos para ver ciertos ítems
  const canViewClientes =
    user?.permissions?.find((perm) => perm.object === 'REPORTAR PAQUETE')?.canView === 1
  const canViewReportarPaquete =
    user?.permissions?.find((perm) => perm.object === 'REPORTAR PAQUETE')?.canView === 1
  const canViewReportarLlegada =
    user?.permissions?.find((perm) => perm.object === 'REPORTAR LLEGADA')?.canView === 1
  const canViewReportarSalida =
    user?.permissions?.find((perm) => perm.object === 'REPORTAR SALIDA')?.canView === 1
  const canViewFacturar =
    user?.permissions?.find((perm) => perm.object === 'FACTURAR')?.canView === 1
  const canViewCasilleroNormal =
    user?.permissions?.find((perm) => perm.object === 'CASILLERO NORMAL')?.canView === 1
  const canViewCasilleroExpress =
    user?.permissions?.find((perm) => perm.object === 'CASILLERO EXPRESS')?.canView === 1
  const canViewFacturas =
    user?.permissions?.find((perm) => perm.object === 'FACTURAS')?.canView === 1
  const canViewConfiguraciones =
    user?.permissions?.find((perm) => perm.object === 'FACTURAS')?.canView === 1

  // Filtrar los ítems del menú basado en los permisos del usuario
  return [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
    },
    canViewClientes && {
      component: CNavItem,
      name: 'Clientes',
      to: '/clientes',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
    // Solo mostrar si tiene permiso para ver Casillero Normal o Express
    (canViewCasilleroNormal || canViewCasilleroExpress) && {
      component: CNavGroup,
      name: 'Paquetes',
      icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
      items: [
        // Solo mostrar si tiene permiso para Casillero Normal
        canViewCasilleroNormal && {
          component: CNavItem,
          name: 'Casillero normal',
          to: '/casillero_normal',
          icon: <CIcon icon={cilBoatAlt} customClassName="nav-icon" />,
        },
        // Solo mostrar si tiene permiso para Casillero Express
        canViewCasilleroExpress && {
          component: CNavItem,
          name: 'Casillero express',
          to: '/casillero_express',
          icon: <CIcon icon={cilFlightTakeoff} customClassName="nav-icon" />,
        },
      ].filter(Boolean), // Filtrar valores nulos
    },
    // Solo mostrar si tiene permiso para Reportar Paquete
    canViewReportarPaquete && {
      component: CNavItem,
      name: 'Reportar paquete',
      to: '/reportar_paquete',
      icon: <CIcon icon={cilSend} customClassName="nav-icon" />,
    },
    canViewReportarSalida && {
      component: CNavItem,
      name: 'Reportar salida',
      to: '/reportar_salida',
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    },
    // Solo mostrar si tiene permiso para Reportar Llegada
    canViewReportarLlegada && {
      component: CNavItem,
      name: 'Reportar llegada',
      to: '/reportar_llegada',
      icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
    },
    // Solo mostrar si tiene permiso para Facturar
    canViewFacturar && {
      component: CNavItem,
      name: 'Facturar',
      to: '/facturar',
      icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
    },
    canViewFacturas && {
      component: CNavItem,
      name: 'Facturas',
      to: '/facturas',
      icon: <CIcon icon={cilPrint} customClassName="nav-icon" />,
    },
    canViewConfiguraciones && {
      component: CNavItem,
      name: 'Configuraciones',
      to: '/configuraciones',
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    },
  ].filter(Boolean) // Filtrar valores nulos
}

export default _nav
