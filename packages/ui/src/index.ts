/**
 * @agentkit/ui - Web Components library built with Lit + Tailwind CSS
 */

// Shared
export { cn } from "@/shared/cn";
export { TW, tailwind } from "@/shared/tailwindMixin";
export { AkElement } from "@/shared/base-element";
export { icon, iconSvg } from "@/shared/icons";

// Components
export { AkButton, buttonVariants } from "@/button";
export type { ButtonVariants } from "@/button";

export { AkWelcome } from "@/welcome";

export { AkPrompts } from "@/prompts";
export type { PromptsItem } from "@/prompts";

export { AkThink } from "@/think";

export { AkBubble } from "@/bubble";

export { AkSender } from "@/sender";
export { AkSenderHeader } from "@/sender";

export { AkActions } from "@/actions";
export type { ActionsItem } from "@/actions";

export { AkSources } from "@/sources";
export type { SourceItem } from "@/sources";

export { AkFileCard } from "@/file-card";

export { AkNotification } from "@/notification";
export type { NotificationOptions } from "@/notification";

export { AkConversations } from "@/conversations";
export type { ConversationItem } from "@/conversations";

export { AkThoughtChain } from "@/thought-chain";
export type { ThoughtChainItem } from "@/thought-chain";

export { AkSuggestion } from "@/suggestion";
export type { SuggestionItem } from "@/suggestion";

export { AkXCard } from "@/x-card";
export type { XCardItem } from "@/x-card";

export { AkSenderSwitch } from "@/sender-switch";
export { AkXProvider } from "@/x-provider";
export { xProviderContext, defaultXProviderConfig } from "@/x-provider";
export type { XProviderConfig } from "@/x-provider";
export { AkAttachments } from "@/attachments";
export type { AttachmentFile } from "@/attachments";
export { AkMermaid } from "@/mermaid";
export { AkFolder } from "@/folder";
export type { FolderItem } from "@/folder";

// Locale
export { zhCN, enUS } from "@/locale";
export type { Locale } from "@/locale";
