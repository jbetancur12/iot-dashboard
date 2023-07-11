import {
  CustomerData,
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer
} from '@app/api/customer.api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface CustomerState {
  customers: any[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
  customers: [],
  loading: 'idle'
} as CustomerState

export const doCreateCustomer = createAsyncThunk(
  'customers/create',
  async (customerData: CustomerData) => createCustomer(customerData)
)

export const doUpdateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }: { id: string | undefined; data: CustomerData }) =>
    updateCustomer(id, data)
)

export const doDeleteCustomer = createAsyncThunk(
  'customers/delete',
  async (customerId: string) => deleteCustomer(customerId)
)

export const retrieveCustomers = createAsyncThunk(
  'customers/retrieve',
  async () => getCustomers()
)

export const retrieveCustomer = createAsyncThunk(
  'customers/retrieveOne',
  async (customerId: any) => getCustomer(customerId)
)

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(retrieveCustomers.fulfilled, (state, action) => {
      return { ...state, customers: action.payload }
    })
    builder.addCase(doCreateCustomer.fulfilled, (state, action) => {
      state.customers.push(action.payload)
    })
    builder.addCase(doUpdateCustomer.fulfilled, (state, action) => {
      const tt = state.customers.map((_) => {
        if (_._id === action.payload._id) {
          return action.payload
        }
        return _
      })
      return { ...state, customers: tt }
    })
    builder.addCase(doDeleteCustomer.fulfilled, (state, action) => {
      const index = state.customers.findIndex(
        ({ _id }) => _id === action.payload._id
      )
      state.customers.splice(index, 1)
    })
  }
})

export default customerSlice.reducer
