/**
 * @agentkit/ui React Adaptor
 * Wraps Lit Web Components as React components using @lit/react
 */
import React from "react";
import { createComponent } from "@lit/react";

import {
  AkButton,
  AkWelcome,
  AkPrompts,
  AkThink,
  AkBubble,
  AkSender,
  AkActions,
  AkSources,
  AkFileCard,
  AkNotification,
  AkConversations,
  AkThoughtChain,
  AkSuggestion,
  AkXCard,
  AkSenderSwitch,
  AkXProvider,
  AkAttachments,
  AkMermaid,
  AkFolder,
} from "@/index";

// Button
export const Button = createComponent({
  tagName: "ak-button",
  elementClass: AkButton,
  react: React,
  events: {},
});

// Welcome
export const Welcome = createComponent({
  tagName: "ak-welcome",
  elementClass: AkWelcome,
  react: React,
  events: {},
});

// Prompts
export const Prompts = createComponent({
  tagName: "ak-prompts",
  elementClass: AkPrompts,
  react: React,
  events: {
    onItemClick: "item-click",
  },
});

// Think
export const Think = createComponent({
  tagName: "ak-think",
  elementClass: AkThink,
  react: React,
  events: {
    onExpand: "expand",
  },
});

// Bubble
export const Bubble = createComponent({
  tagName: "ak-bubble",
  elementClass: AkBubble,
  react: React,
  events: {
    onTyping: "typing",
    onTypingComplete: "typing-complete",
  },
});

// Sender
export const Sender = createComponent({
  tagName: "ak-sender",
  elementClass: AkSender,
  react: React,
  events: {
    onSubmit: "submit",
    onCancel: "sender-cancel",
    onChange: "change",
  },
});

// Actions
export const Actions = createComponent({
  tagName: "ak-actions",
  elementClass: AkActions,
  react: React,
  events: {
    onActionClick: "action-click",
  },
});

// Sources
export const Sources = createComponent({
  tagName: "ak-sources",
  elementClass: AkSources,
  react: React,
  events: {
    onSourceClick: "source-click",
  },
});

// FileCard
export const FileCard = createComponent({
  tagName: "ak-file-card",
  elementClass: AkFileCard,
  react: React,
  events: {
    onRemove: "remove",
  },
});

// Notification
export const Notification = createComponent({
  tagName: "ak-notification",
  elementClass: AkNotification,
  react: React,
  events: {},
});

// Conversations
export const Conversations = createComponent({
  tagName: "ak-conversations",
  elementClass: AkConversations,
  react: React,
  events: {
    onConversationClick: "conversation-click",
  },
});

// ThoughtChain
export const ThoughtChain = createComponent({
  tagName: "ak-thought-chain",
  elementClass: AkThoughtChain,
  react: React,
  events: {
    onToggle: "toggle",
  },
});

// Suggestion
export const Suggestion = createComponent({
  tagName: "ak-suggestion",
  elementClass: AkSuggestion,
  react: React,
  events: {
    onSelect: "select",
  },
});

// XCard
export const XCard = createComponent({
  tagName: "ak-x-card",
  elementClass: AkXCard,
  react: React,
  events: {
    onCardLoad: "card-load",
    onCardClose: "card-close",
  },
});

// SenderSwitch
export const SenderSwitch = createComponent({
  tagName: "ak-sender-switch",
  elementClass: AkSenderSwitch,
  react: React,
  events: {
    onChange: "change",
  },
});

// XProvider
export const XProvider = createComponent({
  tagName: "ak-x-provider",
  elementClass: AkXProvider,
  react: React,
  events: {},
});

// Attachments
export const Attachments = createComponent({
  tagName: "ak-attachments",
  elementClass: AkAttachments,
  react: React,
  events: {
    onUpload: "upload",
    onRemove: "remove",
  },
});

// Mermaid
export const Mermaid = createComponent({
  tagName: "ak-mermaid",
  elementClass: AkMermaid,
  react: React,
  events: {},
});

// Folder
export const Folder = createComponent({
  tagName: "ak-folder",
  elementClass: AkFolder,
  react: React,
  events: {
    onSelect: "select",
  },
});
