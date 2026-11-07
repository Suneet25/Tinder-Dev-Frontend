import { createSelector } from "@reduxjs/toolkit";
import { fullName } from "../../lib/avatar";

const EMPTY = [];

export const selectThread = (state, userId) => state.chat.threads[userId] ?? EMPTY;

// One entry per friend with their latest message: most recent chats first,
// friends you haven't messaged yet after them, alphabetically.
export const selectConversations = createSelector([(s) => s.connections.list, (s) => s.chat.threads], (friends, threads) =>
  friends
    .map((friend) => ({ friend, lastMessage: threads[friend._id]?.at(-1) ?? null }))
    .sort((a, b) => {
      const byTime = (b.lastMessage?.createdAt ?? "").localeCompare(a.lastMessage?.createdAt ?? "");
      return byTime || fullName(a.friend).localeCompare(fullName(b.friend));
    }),
);
