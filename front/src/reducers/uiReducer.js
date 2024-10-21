const initialUIState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
}

const uiReducer = (state = initialUIState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

export default uiReducer
