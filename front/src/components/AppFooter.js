import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <CFooter className="px-4">
      <div>
        <a>Copyright</a>
        <span className="ms-1">&copy; {currentYear} JET CARGO</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a>AppTeck</a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
