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

          // New chats: don't add from socket (may lack participant names).
          // The 5s polling will fetch complete data.
          socket.on(`newChat::${userId}`, () => {});

          socket.on(`chatListUpdate::${userId}`, (updatedChat) => {
            updateCachedData((draft) => {
              if (draft?.data?.chats) {
                const index = draft.data.chats.findIndex(c => c._id === updatedChat._id);
                if (index !== -1) {
                  const existingChat = draft.data.chats[index];
                  // Only update safe fields — NEVER touch participants (prevents "Unknown" flash)
                  draft.data.chats[index] = {
                    ...existingChat,
                    lastMessage: updatedChat.lastMessage ?? existingChat.lastMessage,
                    lastMessageAt: updatedChat.lastMessageAt ?? existingChat.lastMessageAt,
                    unreadCount: updatedChat.unreadCount ?? existingChat.unreadCount,
                    isRead: updatedChat.isRead ?? existingChat.isRead,
                  };
                  const [item] = draft.data.chats.splice(index, 1);
                  draft.data.chats.unshift(item);
                }
                // Unknown chat: skip — polling will fetch with full participant data
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
