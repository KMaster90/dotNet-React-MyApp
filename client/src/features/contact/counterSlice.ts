import { createSlice } from '@reduxjs/toolkit';

export interface CounterState {
  data: number;
  title: string;
}

export const initialState: CounterState = {
  data: 43,
  title: 'YARC (yet another redux counter with Redux/toolkit)'
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state, action) => {
      state.data += action.payload;
    },
    decrement: (state, action) => {
      state.data -= action.payload;
    }
  }
});

export const { increment, decrement } = counterSlice.actions;
