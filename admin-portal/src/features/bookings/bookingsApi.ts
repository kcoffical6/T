import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Booking } from '@/app/(dashboard)/bookings/columns';

export interface PaginatedBookings {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Define a service using a base URL and expected endpoints
export const bookingsApi = createApi({
  reducerPath: 'bookingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      // Get the auth token from the Redux store
      const token = (getState() as any).auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Bookings'],
  endpoints: (builder) => ({
    getBookings: builder.query<PaginatedBookings, GetBookingsParams>({
      query: (params) => ({
        url: 'bookings',
        params: {
          page: params.page,
          limit: params.limit,
          search: params.search,
          status: params.status,
          startDate: params.startDate,
          endDate: params.endDate,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Bookings' as const, id })),
              { type: 'Bookings', id: 'LIST' },
            ]
          : [{ type: 'Bookings', id: 'LIST' }],
    }),
    getBookingById: builder.query<Booking, string>({
      query: (id) => `bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Bookings', id }],
    }),
    createBooking: builder.mutation<Booking, Partial<Booking>>({
      query: (newBooking) => ({
        url: 'bookings',
        method: 'POST',
        body: newBooking,
      }),
      invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
    }),
    updateBooking: builder.mutation<Booking, Partial<Booking>>({
      query: ({ id, ...patch }) => ({
        url: `bookings/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Bookings', id },
        { type: 'Bookings', id: 'LIST' },
      ],
    }),
    deleteBooking: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Bookings', id },
        { type: 'Bookings', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingsApi;
