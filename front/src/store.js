import { legacy_createStore as createStore, combineReducers } from 'redux'
import { authReducer } from './reducers/authReducer' // Importa tu authReducer
import uiReducer from './reducers/uiReducer' // Importa el reducer que maneja el estado de la UI

// Combinar ambos reducers
const rootReducer = combineReducers({
  ui: uiReducer, // Reducer para la UI
  auth: authReducer, // Reducer para la autenticación
})

// Crear el store usando el reducer combinado
const store = createStore(uiReducer)

export default store
