import { io } from "socket.io-client";
import { getToken } from "../../utils/storage";
import { baseApi } from "../../utils/apiBaseQuery";
import { baseURL } from "../../utils/BaseURL";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    sendMessage: builder.mutation({
      query: ({ data, chatId }) => ({
        url: `/messages/send/${chatId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["message", "chat"],
    }),

    getMessage: builder.query({
      query: ({ chatId }) => ({
        url: `/messages/${chatId}`,
        method: "GET",
      }),
      providesTags: ["message"],
      async onCacheEntryAdded(
        { chatId, userId },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        if (!chatId || !userId) return;
        const token = getToken();
        const socket = io(baseURL, {
          auth: {
            token: `Bearer ${token}`,
          },
        });

        const handleNewMessage = (newMessage) => {
          // Try to extract chatId from all possible backend field shapes
          const incomingChatId =
            newMessage?.chatId?._id ??
            newMessage?.chatId ??
            newMessage?.chat?._id ??
            newMessage?.chat ??
            null;

          // If backend includes chatId, filter; otherwise accept all (safe for this cache entry)
          if (incomingChatId && incomingChatId !== chatId) return;

          updateCachedData((draft) => {
            if (draft?.data?.messages) {
              // Avoid duplicate messages
              const alreadyExists = draft.data.messages.some((m) => m._id === newMessage._id);
              if (!alreadyExists) {
                draft.data.messages.unshift(newMessage);
              }
            }
          });
        };

        try {
          await cacheDataLoaded;

          // Listen on userId-based event (primary) AND chatId-based event (fallback)
          socket.on(`newMessage::${userId}`, handleNewMessage);
          socket.on(`newMessage::${chatId}`, handleNewMessage);
        } catch {
          // no-op
        }

        await cacheEntryRemoved;
        socket.disconnect();
      },
    }),

    deleteMessage: builder.mutation({
      query: ({ messageId }) => ({
        url: `/messages/delete/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["message"],
    }),

  }),
});

export const {
  useSendMessageMutation,
  useGetMessageQuery,
  useDeleteMessageMutation,
} = messageApi;
