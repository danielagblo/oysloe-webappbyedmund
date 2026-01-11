import type { ChatMember, ChatRoom } from "../services/chatService";

/**
 * Check if a member is staff or superuser
 */
export const isSupportMember = (member: ChatMember | undefined): boolean => {
  if (!member) return false;
  // Backends may use different casing. Check common variants.
  const staff = (member as any).is_staff === true || (member as any).isStaff === true || (member as any).is_staff === true;
  const superuser = (member as any).is_superuser === true || (member as any).isSuperUser === true || (member as any).isSuperuser === true || (member as any).is_superuser === true;
  return Boolean(staff || superuser);
};

/**
 * Check if a room is a support case (has at least one staff/superuser member)
 */
export const isSupportRoom = (room: ChatRoom | undefined): boolean => {
  if (!room || !Array.isArray(room.members)) return false;
  return room.members.some(isSupportMember);
};

/**
 * Split rooms into support and user chat lists
 */
export const splitRooms = (rooms: ChatRoom[]): { supportRooms: ChatRoom[]; userRooms: ChatRoom[] } => {
  const supportRooms: ChatRoom[] = [];
  const userRooms: ChatRoom[] = [];

  for (const room of rooms) {
    if (isSupportRoom(room)) {
      supportRooms.push(room);
    } else {
      userRooms.push(room);
    }
  }

  return { supportRooms, userRooms };
};

/**
 * Get case ID from room (currently uses room_id, will use case_id when backend provides it)
 */
export const getCaseId = (room: ChatRoom): string => {
  // TODO: When backend adds case_id field, prefer that:
  // return room.case_id ?? room.room_id;
  return room.room_id;
};

/**
 * Get case status from room (currently derives from total_unread, will use status field when backend provides it)
 * Returns: 'active' | 'closed'
 */
export const getCaseStatus = (room: ChatRoom): 'active' | 'closed' => {
  // Check if room has is_closed property
  console.log('getCaseStatus check:', {
    room_id: room.room_id,
    is_closed: (room as any).is_closed,
    full_room: room
  });

  if ((room as any).is_closed === true) {
    return 'closed';
  }

  // Default to active
  return 'active';
};
