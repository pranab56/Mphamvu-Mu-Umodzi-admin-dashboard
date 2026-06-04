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
        { chatId },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        if (!chatId) return;
        const token = getToken();
        const socket = io(baseURL, {
          auth: {
            token: `Bearer ${token}`,
          },
        });

        try {
          await cacheDataLoaded;

          socket.on(`newMessage::${chatId}`, (newMessage) => {
            updateCachedData((draft) => {
              // The API returns newest first, so we unshift the new message
              if (draft?.data?.messages) {
                draft.data.messages.unshift(newMessage);
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

    deleteMessage: builder.mutation({
      query: ({ messageId }) => ({
        url: `/messages/delete/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["message"],
    }),

  }),
});

// Export hooks
export const {
  useSendMessageMutation,
  useGetMessageQuery,
  useDeleteMessageMutation,
} = messageApi;
