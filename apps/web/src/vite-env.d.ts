/// <reference types="vite/client" />

import type { AkButton } from "@agentkit/ui";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ak-button": React.DetailedHTMLProps<
        React.HTMLAttributes<AkButton> & {
          variant?: "primary" | "secondary" | "ghost";
          size?: "sm" | "md" | "lg";
          disabled?: boolean;
        },
        AkButton
      >;
    }
  }
}
