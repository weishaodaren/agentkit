/**
 * @agentkit/ui React Adaptor — Plugin Components
 *
 * Optional components that depend on external libraries:
 * - CodeHighlighter (requires highlight.js)
 * - Markdown (requires marked)
 *
 * Import from: @agentkit/ui/adaptor/react-plugins
 */
import React from "react";
import { createComponent } from "@lit/react";

import { AkCodeHighlighter } from "@/code-highlighter";
import { AkMarkdown } from "@/markdown";

// CodeHighlighter (requires highlight.js)
export const CodeHighlighter = createComponent({
  tagName: "ak-code-highlighter",
  elementClass: AkCodeHighlighter,
  react: React,
  events: {
    onCopy: "copy",
  },
});

// Markdown (requires marked)
export const Markdown = createComponent({
  tagName: "ak-markdown",
  elementClass: AkMarkdown,
  react: React,
  events: {},
});
