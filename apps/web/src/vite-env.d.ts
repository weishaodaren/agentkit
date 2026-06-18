/// <reference types="vite/client" />

import type {
  AkButton,
  AkWelcome,
  AkPrompts,
  AkThink,
  AkBubble,
  AkSender,
} from "@agentkit/ui";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ak-button": React.DetailedHTMLProps<
        React.HTMLAttributes<AkButton> & {
          variant?:
            | "default"
            | "destructive"
            | "outline"
            | "secondary"
            | "ghost"
            | "link";
          size?: "default" | "sm" | "lg" | "icon";
          disabled?: boolean;
        },
        AkButton
      >;
      "ak-welcome": React.DetailedHTMLProps<
        React.HTMLAttributes<AkWelcome> & {
          variant?: "filled" | "borderless";
          title?: string;
          description?: string;
        },
        AkWelcome
      >;
      "ak-prompts": React.DetailedHTMLProps<
        React.HTMLAttributes<AkPrompts> & {
          title?: string;
          columns?: "1" | "2" | "3" | "4";
        },
        AkPrompts
      >;
      "ak-think": React.DetailedHTMLProps<
        React.HTMLAttributes<AkThink> & {
          title?: string;
          expanded?: boolean;
          loading?: boolean;
        },
        AkThink
      >;
      "ak-bubble": React.DetailedHTMLProps<
        React.HTMLAttributes<AkBubble> & {
          placement?: "start" | "end";
          content?: string;
          loading?: boolean;
          typing?: boolean;
          avatar?: string;
        },
        AkBubble
      >;
      "ak-sender": React.DetailedHTMLProps<
        React.HTMLAttributes<AkSender> & {
          value?: string;
          placeholder?: string;
          loading?: boolean;
          disabled?: boolean;
          "submit-type"?: "enter" | "shiftEnter";
          "max-rows"?: number;
        },
        AkSender
      >;
    }
  }
}
