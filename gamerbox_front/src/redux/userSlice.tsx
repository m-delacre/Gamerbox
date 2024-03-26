import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        id: 0,
        email: "",
        pseudonym: "",
        token: "",
        isConnected: false
    },
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPseudonym: (state, action) => {
            state.pseudonym = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setConnected: (state) => {
            state.isConnected = true;
        },
        setNotConnected: (state) => {
            state.isConnected = false;
        }
    }
});

export const selectUserId = (state: any) => state.user.id;
export const selectEmail = (state: any) => state.user.email;
export const selectPseudonym = (state: any) => state.user.pseudonym;
export const selectToken = (state: any) => state.user.token;
export const selectIsConnected = (state: any) => state.user.isConnected;

export const { setId, setEmail, setPseudonym, setToken, setConnected, setNotConnected } = userSlice.actions;

export default userSlice.reducer;
