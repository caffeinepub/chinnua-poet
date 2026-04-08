import { isOnline } from "../utils/presence";

interface OnlineDotProps {
  username: string;
  size?: number;
}

export default function OnlineDot({ username, size = 10 }: OnlineDotProps) {
  const online = isOnline(username);
  return (
    <span
      title={online ? "Online" : "Offline"}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: online ? "#4CAF50" : "#9E9E9E",
        flexShrink: 0,
        border: "1.5px solid rgba(255,255,255,0.7)",
      }}
    />
  );
}
