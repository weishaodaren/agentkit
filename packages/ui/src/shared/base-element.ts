import { LitElement } from "lit";
import { TW } from "./tailwindMixin";

/**
 * AkElement - Base class for all AgentKit UI components.
 * Extends LitElement with Tailwind CSS Shadow DOM support via TW mixin.
 */
export class AkElement extends TW(LitElement) {}
