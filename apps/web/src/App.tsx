import { Button } from "@agentkit/ui";
import { generateId } from "@agentkit/utils";

export function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>AgentKit</h1>
      <p>项目已就绪！Session ID: {generateId()}</p>
      <Button variant="primary">开始使用</Button>
    </div>
  );
}
