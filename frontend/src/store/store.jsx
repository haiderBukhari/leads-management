import { configureStore } from '@reduxjs/toolkit'
import authenticationReducer from './features/AuthenticationSlice.jsx'

const store =  configureStore({
    reducer: {
        authentication: authenticationReducer,
    },
})

export default store;