import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import agent from '../../app/api/agent';
import { Basket } from '../../app/models/basket';

interface Payload {
  productId: number;
  quantity?: number;
  name?: 'del';
}

export interface BasketState {
  basket: Basket | null;
  status: string;
}

export const initialState: BasketState = {
  basket: null,
  status: 'idle'
};

export const addBasketItemAsync = createAsyncThunk<Basket | undefined, Payload>(
  'basket/addBasketItemAsync',
  async ({ productId, quantity = 1 }, thunkApi) => {
    try {
      return (await agent.Basket.addItem(productId, quantity)).value;
    } catch (err: any) {
      console.log('addBasketItemAsync', err);
      return thunkApi.rejectWithValue({ error: err?.data });
    }
  }
);

export const removeBasketItemAsync = createAsyncThunk<void, Payload>(
  'basket/removeBasketItemAsync',
  async ({ productId, quantity = 1 }, thunkApi) => {
    try {
      await agent.Basket.removeItem(productId, quantity);
    } catch (err: any) {
      console.log('removeBasketItemAsync', err);
      return thunkApi.rejectWithValue({ error: err?.data });
    }
  }
);

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    }
  },
  // async effects
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      console.log(action);
      state.status = 'pendingAddItem' + action.meta.arg.productId;
    });
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      if (action.payload) {
        console.log('Action payload', action.payload);
        state.basket = action.payload;
      }
      state.status = 'idle';
    });
    builder.addCase(addBasketItemAsync.rejected, (state, action) => {
      console.log('rejected', action);
      state.status = 'idle';
    });
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      console.log(action);
      const { productId, name } = action.meta.arg;
      state.status = 'pendingRemoveItem' + productId + (name || '');
    });
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const { productId, quantity = 1 } = action.meta.arg;
      console.log('removeFullfilled', action);
      const changedItem = state.basket?.items.find((item) => item.productId === productId) || { quantity: 0 };
      changedItem.quantity -= quantity || 1;
      if (changedItem.quantity <= 0 && state.basket) {
        state.basket.items = state.basket?.items.filter((item) => item.productId !== productId) || [];
      }
      state.status = 'idle';
    });
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      console.log('rejected', action);
      state.status = 'idle';
    });
  }
});

export const { setBasket } = basketSlice.actions;
