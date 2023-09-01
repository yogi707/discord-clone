import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/ui/media-room";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

async function ChannelPage(props: ChannelPageProps) {
  const profile = await currentProfile();
  const { params } = props;
  const { channelId, serverId } = params;
  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <div className="flex-1">
            <ChatMessages
              member={member}
              name={channel.name}
              type="conversation"
              apiUrl="/api/messages"
              socketUrl="/api/socket/messages"
              socketQuery={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
              paramsKey="channelId"
              paramValue={channel.id}
              chatId={channel.id}
            />
          </div>
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              serverId: channel.id,
              channelId: channel.serverId,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channelId} video={false} audio={true} />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channelId} video={true} audio={true} />
      )}
    </div>
  );
}

export default ChannelPage;
