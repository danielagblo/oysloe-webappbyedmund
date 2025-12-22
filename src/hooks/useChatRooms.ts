import { useQuery } from "@tanstack/react-query";
import { listChatRooms } from "../services/chatService";

export function useChatRooms() {
  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const rooms = await listChatRooms();
      return rooms;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
}
