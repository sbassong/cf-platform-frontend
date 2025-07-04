import axios from "axios";
import { Post } from "@/types";
import { Group } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL,
  withCredentials: true,
});

// A generic fetcher function for SWR.
// It takes a URL, makes a request using our configured axios instance,
export const fetcher = (url: string) => api.get(url).then((res) => res.data);

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

/**
 * Updates a group's details.
 * @param groupId - The ID of the group to update.
 * @param data - The data to update.
 */
export const updateGroup = async (
  groupId: string,
  data: { name?: string; description?: string; avatarUrl?: string; bannerUrl?: string }
): Promise<Group> => {
  const response = await api.patch<Group>(`/groups/${groupId}`, data);
  return response.data;
};

/**
 * Gets a pre-signed URL for a group avatar.
 */
export const getGroupAvatarUploadUrl = async (contentType: string): Promise<{ uploadUrl: string; publicUrl: string; }> => {
    const response = await api.post('/groups/avatar-upload-url', { contentType });
    return response.data;
};

/**
 * Gets a pre-signed URL for a group banner.
 */
export const getGroupBannerUploadUrl = async (contentType: string): Promise<{ uploadUrl: string; publicUrl: string; }> => {
    const response = await api.post('/groups/banner-upload-url', { contentType });
    return response.data;
};

/**
 * Updates an event's details.
 */
export const updateEvent = async (
  eventId: string,
  data: { title?: string; description?: string; date?: string; location?: string; imageUrl?: string; }
): Promise<Event> => {
  const response = await api.patch<Event>(`/events/${eventId}`, data);
  return response.data;
};

/**
 * Gets a pre-signed URL for an event image.
 */
export const getEventImageUploadUrl = async (contentType: string): Promise<{ uploadUrl: string; publicUrl: string; }> => {
    const response = await api.post('/events/image-upload-url', { contentType });
    return response.data;
};