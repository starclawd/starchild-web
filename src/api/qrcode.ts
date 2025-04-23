import { baseApi } from './baseHolominds'
export const OPEN_AI_KEY = ''

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQrcodeId: builder.query({
      query: () => {
        return {
          url: '/qrcode/generate',
          method: 'post',
        }
      },
    }),
		getQrcodeStatus: builder.query({
			query: ({ qrcodeId }) => {
				return {
					url: `/qrcode/status/${qrcodeId}`,
					method: 'get',
				}
			},
		}),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetQrcodeIdQuery,
  useLazyGetQrcodeStatusQuery,
} = postsApi
export default postsApi
