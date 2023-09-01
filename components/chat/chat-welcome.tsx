import { Hash } from "lucide-react";
import React from "react";

function ChatWelcome({
  type,
  name,
}: {
  type: "channel" | "conversation";
  name: string;
}) {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:text-zinc-700 flex items-center justify-center">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}

      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "Welcome to #" + name : null}{" "}
      </p>
      <p
        className=">
      text-zinc-600 dark:text-zinc-400 text-sm"
      >
        {type === "channel"
          ? "This is the start of the channel " + name
          : "This is the start of your conversation with " + name}
      </p>
    </div>
  );
}

export default ChatWelcome;
