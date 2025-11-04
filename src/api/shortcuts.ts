import { chatApi } from './baseChat'

const postsApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    getShortcuts: builder.query({
      query: () => {
        return {
          url: `/short_cuts?user_id=`,
          method: 'get',
        }
      },
    }),
    createShortcut: builder.query({
      query: ({ content }) => {
        const param = new URLSearchParams()
        param.append('user_id', '')
        param.append('content', content)
        return {
          url: `/short_cuts`,
          method: 'post',
          body: param,
        }
      },
    }),
    deleteShortcut: builder.query({
      query: ({ shortcutId }) => {
        return {
          url: `/short_cut?user_id=&short_cut_id=${shortcutId}`,
          method: 'delete',
        }
      },
    }),
    updateShortcut: builder.query({
      query: ({ shortcutId, content }) => {
        const param = new URLSearchParams()
        param.append('user_id', '')
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
