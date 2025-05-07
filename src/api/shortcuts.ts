import { isLocalEnv } from 'utils/url'
import { baseApi } from './baseHolominds'

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShortcuts: builder.query({
      query: ({ account }) => {
        return {
          url: `${isLocalEnv ? '/shortcuts' : ''}/short_cuts?user_id=${account}`,
          method: 'get',
        }
      },
    }),
    createShortcut: builder.query({
      query: ({ account, content }) => {
        const param = new URLSearchParams()
        param.append('user_id', account)
        param.append('content', content)
        return {
          url: `/short_cuts`,
          method: 'post',
          body: param,
        }
      },
    }),
    deleteShortcut: builder.query({
      query: ({ account, shortcutId }) => {
        return {
          url: `/short_cut?user_id=${account}&short_cut_id=${shortcutId}`,
          method: 'delete',
        }
      },
    }),
    updateShortcut: builder.query({
      query: ({ account, shortcutId, content }) => {
        const param = new URLSearchParams()
        param.append('user_id', account)
        param.append('short_cut_id', shortcutId)
        param.append('content', content)
        return {
          url: `/short_cut`,
          method: 'put',
          body: param,
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetShortcutsQuery,
  useLazyCreateShortcutQuery,
  useLazyDeleteShortcutQuery,
  useLazyUpdateShortcutQuery,
} = postsApi
export default postsApi
