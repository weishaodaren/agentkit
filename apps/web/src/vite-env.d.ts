/// <reference types="vite/client" />

import type { AkButton } from "@agentkit/ui";

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
    }
  }
}
