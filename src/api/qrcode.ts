import { baseApi } from './baseHolominds'
export const OPEN_AI_KEY = ''

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQrcodeId: builder.query({
      query: () => {
        return {
          url: '/qrcode/getQrcodeId',
          method: 'get',
        }
      },
    }),
		getQrcodeStatus: builder.query({
			query: ({ qrcodeId }) => {
				return {
					url: '/qrcode/getQrcodeStatus',
					method: 'get',
					params: { qrcodeId },
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
