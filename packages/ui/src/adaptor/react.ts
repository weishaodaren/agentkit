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
  AkCodeHighlighter,
} from "../index";

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
    onToggle: "toggle",
  },
});

// Bubble
export const Bubble = createComponent({
  tagName: "ak-bubble",
  elementClass: AkBubble,
  react: React,
  events: {},
});

// Sender
export const Sender = createComponent({
  tagName: "ak-sender",
  elementClass: AkSender,
  react: React,
  events: {
    onSubmit: "submit",
    onCancel: "cancel",
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

// CodeHighlighter
export const CodeHighlighter = createComponent({
  tagName: "ak-code-highlighter",
  elementClass: AkCodeHighlighter,
  react: React,
  events: {
    onCopy: "copy",
  },
});
