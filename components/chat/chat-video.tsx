import React from "react";
import queryString from "query-string";
import ActionTooltip from "@/components/ui/action-tooltip";
import { Video, VideoOff } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

function ChatVideo() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();

  const isVideo = searchParams?.get("video");
  const Icon = isVideo ? VideoOff : Video;
  const tooltip = isVideo ? "End video call" : "Start video";

  const onClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      {
        skipNull: true,
      }
    );
    router.push(url);
  };

  return (
    <ActionTooltip side="bottom" label={tooltip}>
      <button className="hover:opacity-75 transition mr-4" onClick={onClick}>
        <Icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400 " />
      </button>
    </ActionTooltip>
  );
}

export default ChatVideo;
