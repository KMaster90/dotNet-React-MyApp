import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import agent from '../../app/api/agent';
import { Product } from '../../app/models/product';
import { RootState } from '../contact/configureStore';

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[] | undefined>('catalog/fetchProductsAsync', async (_, thunkAPI) => {
  try {
    return await agent.Catalog.list();
  } catch (err: any) {
    console.log('fetchProductsAsync', err);
    return thunkAPI.rejectWithValue({ error: err?.data });
  }
});

export const fetchProductAsync = createAsyncThunk<Product | undefined, number>('catalog/fetchProductAsync', async (productId, thunkAPI) => {
  try {
    return await agent.Catalog.details(productId);
  } catch (err: any) {
    console.log('fetchProductAsync', err);
    return thunkAPI.rejectWithValue({ error: err?.data });
  }
});

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: productsAdapter.getInitialState({
    productsLoaded: false,
    status: 'idle'
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state, action) => {
        state.status = 'pendingFetchProducts';
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        productsAdapter.setAll(state, action.payload || []);
        state.status = 'idle';
        state.productsLoaded = true;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        console.log('REJECTED', action);
        state.status = 'idle';
      });
    builder
      .addCase(fetchProductAsync.pending, (state, action) => {
        state.status = 'pendingFetchProduct';
      })
      .addCase(fetchProductAsync.fulfilled, (state, action) => {
        productsAdapter.upsertOne(state, action.payload || ({} as Product));
        state.status = 'idle';
      })
      .addCase(fetchProductAsync.rejected, (state, action) => {
        console.log('REJECTED', action);
        state.status = 'idle';
      });
  }
});

export const productSelectors = productsAdapter.getSelectors<RootState>((state) => state.catalog);
