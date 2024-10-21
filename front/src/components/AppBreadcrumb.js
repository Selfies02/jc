import React from 'react'
import { useLocation } from 'react-router-dom'
import routes from '../routes'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    const pathParts = location.split('/').filter(Boolean)

    pathParts.forEach((part, index) => {
      const currentPath = '/' + pathParts.slice(0, index + 1).join('/')
      const routeName = getRouteName(currentPath, routes)

      if (routeName) {
        breadcrumbs.push({
          pathname: currentPath,
          name: routeName,
          active: index === pathParts.length - 1,
        })
      } else if (index === pathParts.length - 1) {
        breadcrumbs.push({
          pathname: currentPath,
          name: part.charAt(0).toUpperCase() + part.slice(1).replace(/_/g, ' '),
          active: true,
        })
      } else {
        breadcrumbs.push({
          pathname: currentPath,
          name: part.charAt(0).toUpperCase() + part.slice(1).replace(/_/g, ' '),
          active: false,
        })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem key={index} active={breadcrumb.active}>
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
