import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        email: "test@gmail.com",
        tokenJWT: "azerty123",
        value: 0,
    },
    reducers: {
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        }
    }
});

export const selectEmail = (state: any) => state.user.email;

export const { increment, decrement, incrementByAmount, setEmail } = userSlice.actions;

export default userSlice.reducer;
