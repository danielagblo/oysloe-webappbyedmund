import { useQuery } from "@tanstack/react-query";
import { listChatRooms } from "../services/chatService";

export function useChatRooms() {
  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      console.log("🔄 [useChatRooms] Fetching chat rooms from API...");
      const rooms = await listChatRooms();
      console.log(`✅ [useChatRooms] Fetched ${rooms.length} rooms`);
      console.log(`✅ [useChatRooms] Rooms with members:`, rooms.filter(r => r.members?.length > 0).length);
      console.log(`✅ [useChatRooms] Full room data:`, rooms);
      return rooms;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
}
