import axios from "axios";
import { Group, Profile, Post, Conversation, Message } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL,
  withCredentials: true,
});

// A generic fetcher function for SWR.
// It takes a URL, makes a request using our configured axios instance,
export const fetcher = (url: string) => api.get(url).then((res) => res.data);


// posts
export const createPost = async (data: { content: string; imageUrl?: string }): Promise<Post> => {
  const response = await api.post<Post>('/posts', data);
  return response.data;
};

export const getPostImageUploadUrl = async (
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> => {
  const response = await api.post("/posts/image-upload-url", { contentType });
  return response.data;
};

export const updatePost = async (
  postId: string,
  data: { content: string; imageUrl?: string | null }
): Promise<Post> => {
  const response = await api.patch<Post>(`/posts/${postId}`, data);
  return response.data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/posts/${postId}`);
};


// groups
export const createGroup = async (data: { name: string; description: string }): Promise<Group> => {
  const response = await api.post<Group>('/groups', data);
  return response.data;
};

export const joinGroup = async (groupId: string): Promise<Group> => {
  const response = await api.post<Group>(`/groups/${groupId}/join`);
  return response.data;
};

export const leaveGroup = async (groupId: string): Promise<Group> => {
  const response = await api.post<Group>(`/groups/${groupId}/leave`);
  return response.data;
};

export const updateGroup = async (
  groupId: string,
  data: { name?: string; description?: string; avatarUrl?: string; bannerUrl?: string }
): Promise<Group> => {
  const response = await api.patch<Group>(`/groups/${groupId}`, data);
  return response.data;
};

export const getGroupAvatarUploadUrl = async (contentType: string): Promise<{ uploadUrl: string; publicUrl: string; }> => {
    const response = await api.post('/groups/avatar-upload-url', { contentType });
    return response.data;
};

export const getGroupBannerUploadUrl = async (contentType: string): Promise<{ uploadUrl: string; publicUrl: string; }> => {
    const response = await api.post('/groups/banner-upload-url', { contentType });
    return response.data;
};


// events
export const createEvent = async (data: {
  title: string;
  description: string;
  date: string;
  location: string;
}): Promise<Event> => {
  const response = await api.post<Event>("/events", data);
  return response.data;
};

export const rsvpToEvent = async (eventId: string): Promise<Event> => {
  const response = await api.post<Event>(`/events/${eventId}/rsvp`);
  return response.data;
};

export const unRsvpFromEvent = async (eventId: string): Promise<Event> => {
  const response = await api.post<Event>(`/events/${eventId}/un-rsvp`);
  return response.data;
};
export const updateEvent = async (
  eventId: string,
  data: { title?: string; description?: string; date?: string; location?: string; imageUrl?: string; }
): Promise<Event> => {
  const response = await api.patch<Event>(`/events/${eventId}`, data);
  return response.data;
};

export const getEventImageUploadUrl = async (contentType: string): Promise<{ uploadUrl: string; publicUrl: string; }> => {
    const response = await api.post('/events/image-upload-url', { contentType });
    return response.data;
};


// profiles
export const followProfile = async (profileId: string): Promise<Profile> => {
  const response = await api.post<Profile>(`/profiles/${profileId}/follow`);
  return response.data;
};

export const unfollowProfile = async (profileId: string): Promise<Profile> => {
  const response = await api.post<Profile>(`/profiles/${profileId}/unfollow`);
  return response.data;
};
  // messaging-related
export const searchProfiles = async (query: string): Promise<Profile[]> => {
  console.log({query})
  if (!query) return [];
  const response = await api.get(`/profiles/search?q=${query}`);
  console.log({searRes: response})
  return response.data;
};


// messaging
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get("/messaging/conversations");
  return response.data;
};

export const getMessages = async (
  conversationId: string
): Promise<Message[]> => {
  const response = await api.get(
    `/messaging/conversations/${conversationId}/messages`
  );
  return response.data;
};

export const findOrCreateConversation = async (
  otherUserId: string
): Promise<Conversation> => {
  const response = await api.post("/messaging/conversations", { otherUserId });
  return response.data;
};