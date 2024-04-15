import { createSlice } from '@reduxjs/toolkit';

// Function to load state from local storage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('reduxState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

// Function to save state to local storage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('reduxState', serializedState);
    } catch {
        // Ignore write errors
    }
};

// Load initial state from local storage or use default value
const initialState = loadState() || {
    userId: 0,
    stsID: '',
    name: '',
    jwtToken: '',
    isAdmin: false,
    isGeneralManager: false,
    isManager: false,
    isEmployee: false
};

export const authenticationSlice = createSlice({
    name: 'counter',
    initialState: initialState,
    reducers: {
        registerUser: (state, action) => {
            state.userId = action.payload.userId;
            state.stsID = action.payload.stsID;
            state.name = action.payload.name;
            state.jwtToken = action.payload.jwtToken;
            state.isAdmin = action.payload.isAdmin;
            state.isGeneralManager = action.payload.isGeneralManager;
            state.isManager = action.payload.isManager;
            state.isEmployee = action.payload.isEmployee;
            saveState(state); // Save state to local storage
        },
        logoutUser: (state) => {
            state.userId = 0;
            state.stsID = 0;
            state.name = '';
            state.jwtToken = '';
            state.isAdmin = false;
            state.isGeneralManager = false;
            state.isManager = false;
            state.isEmployee = false;
            saveState(state); // Save state to local storage
        },
    },
});

// Action creators are generated for each case reducer function
export const { registerUser, logoutUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;