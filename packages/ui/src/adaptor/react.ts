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
