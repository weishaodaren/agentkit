import "@agentkit/ui";
import { generateId } from "@agentkit/utils";

export function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>AgentKit</h1>
      <p>项目已就绪！Session ID: {generateId()}</p>
      <ak-button variant="default">开始使用</ak-button>
    </div>
  );
}
