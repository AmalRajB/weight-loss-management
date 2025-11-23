import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("user"));

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: savedUser ? savedUser : null  
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            window.localStorage.setItem('user', JSON.stringify(action.payload));
        },
        removeUser: (state) => {
            state.user = null;
            window.localStorage.removeItem('user');
        },
    }
});

export const { setUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
