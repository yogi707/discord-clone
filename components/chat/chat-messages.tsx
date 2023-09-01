import { Member, Message, Profile } from "@prisma/client";
import React, { ElementRef, Fragment, useRef } from "react";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";
interface chatMessagesProps {
  member: Member;
  name: string;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  paramsKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
  socketQuery: Record<string, any>;
}

type MessageWithProfileWithType = Message & {
  member: Member & { profile: Profile };
};

function ChatMessages({
  apiUrl,
  chatId,
  member,
  name,
  paramValue,
  paramsKey,
  socketUrl,
  type,
  socketQuery,
}: chatMessagesProps) {
  const queryKey = `chat:${chatId}`;
  const ref = useRef<ElementRef<"div">>(null);

  const bottomRef = useRef<ElementRef<"div">>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey: paramsKey,
      paramValue,
    });

  useChatSocket({
    queryKey: `chat:${chatId}`,
    addKey: `chat:${chatId}:messages`,
    updateKey: `chat:${chatId}:messages:update`,
  });

  useChatScroll({
    ref,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "error")
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );

  if (status === "loading")
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );

  return (
    <div ref={ref} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}

      {!hasNextPage && <ChatWelcome type={type} name={name} />}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600  text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}{" "}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto ">
        {data?.pages?.map((group, i) => {
          return (
            <Fragment key={i}>
              {group.items.map((message: MessageWithProfileWithType) => {
                return (
                  <ChatItem
                    currentMember={member}
                    member={message.member}
                    key={message.id}
                    content={message.content}
                    fileUrl={message.fileUrl}
                    deleted={message.deleted}
                    timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                    isUpdated={message.updatedAt! == message.createdAt}
                    socketUrl={socketUrl}
                    socketQuery={socketQuery}
                    id={message.id}
                  />
                );
              })}
            </Fragment>
          );
        })}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
