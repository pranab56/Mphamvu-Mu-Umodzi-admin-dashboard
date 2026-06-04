import { io } from "socket.io-client";
import { getToken } from "../../utils/storage";
import { baseURL } from '../../utils/BaseURL';
import { baseApi } from "../../utils/apiBaseQuery";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getChat: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/chats?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["chat"],
      async onCacheEntryAdded(
        { userId },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        if (!userId) return;
        const token = getToken();
        // Socket connection logic
        const socket = io(baseURL, {
          auth: {
            token: `Bearer ${token}`,
          },
        });

        try {
          await cacheDataLoaded;

          socket.on(`newChat::${userId}`, (newChat) => {
            updateCachedData((draft) => {
              if (draft?.data?.chats) {
                // Add the new chat to the beginning of the list if it doesn't exist
                if (!draft.data.chats.find(c => c._id === newChat._id)) {
                  draft.data.chats.unshift(newChat);
                }
              }
            });
          });

          socket.on(`chatListUpdate::${userId}`, (updatedChat) => {
            updateCachedData((draft) => {
              if (draft?.data?.chats) {
                const index = draft.data.chats.findIndex(c => c._id === updatedChat._id);
                if (index !== -1) {
                  // Update existing chat and move to top
                  draft.data.chats[index] = { ...draft.data.chats[index], ...updatedChat };
                  const [item] = draft.data.chats.splice(index, 1);
                  draft.data.chats.unshift(item);
                } else {
                  // If not found, add it
                  draft.data.chats.unshift(updatedChat);
                }
              }
            });
          });

        } catch {
          // no-op
        }

        await cacheEntryRemoved;
        socket.close();
      },
    }),

    deleteChat: builder.mutation({
      query: ({ chatId }) => ({
        url: `/chats/delete/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["chat"],
    }),

  }),
});

// Export hooks
export const {
  useGetChatQuery,
  useDeleteChatMutation,
} = chatApi;
