import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl().replace(/\/$/, '')}/api/products`,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`); // This line ensures the token is set
        }
        return headers;
    }
});

const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery,
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        fetchAllProducts: builder.query({
            query: () => "/",
            providesTags: ['Products'],
        }),
        fetchProductById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Products', id }],
        }),
        addProduct: builder.mutation({
            query: (newProduct) => ({
                url: "/create-product",
                method: "POST",
                body: newProduct,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/edit/${id}`,
                method: "PUT",
                body: rest,
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Products'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Products'],
        }),

        // New mutation to update product price based on percentage
        updateProductPrice: builder.mutation({
            query: ({ id, percentage }) => ({
                url: `/update-price/${id}`,
                method: "PUT",
                body: { percentage },
            }),
            invalidatesTags: ['Products'],
        }),
    })
});

export const {
    useFetchAllProductsQuery,
    useFetchProductByIdQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUpdateProductPriceMutation // New hook for updating price
} = productsApi;

export default productsApi;
