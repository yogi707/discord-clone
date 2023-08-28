import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Video, Mic, ShieldCheck, ShieldAlert } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerChannels } from "./server-channels";
import { ServerSection } from "./server-section";
import { ServerMember } from "./server-member";

interface serverSideBarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="h-4 w-4 mr-2" />,
  [ChannelType.TEXT]: <Hash className="h-4 w-4 mr-2" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};
async function ServerSideBar(props: serverSideBarProps) {
  const { serverId } = props;
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!server) return redirect("/");
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <ServerSearch
          data={[
            {
              label: "Text channels",
              type: "channel",
              data: textChannels?.map((item) => {
                return {
                  id: item.id,
                  name: item.name,
                  icon: iconMap[item.type],
                };
              }),
            },
            {
              label: "Voice channels",
              type: "channel",
              data: audioChannels?.map((item) => {
                return {
                  id: item.id,
                  name: item.name,
                  icon: iconMap[item.type],
                };
              }),
            },
            {
              label: "Video channels",
              type: "channel",
              data: videoChannels?.map((item) => {
                return {
                  id: item.id,
                  name: item.name,
                  icon: iconMap[item.type],
                };
              }),
            },
            {
              label: "Members",
              type: "member",
              data: members?.map((item) => {
                return {
                  id: item.id,
                  name: item.profile.name,
                  icon: roleIconMap[item.role],
                };
              }),
            },
          ]}
        />
      </ScrollArea>
      <Separator className="bg-zinc-500 dark:bg-zinc-700 rounded-md my-2" />

      {!!textChannels.length && (
        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.TEXT}
            role={role}
            server={server}
            label="Text Channels"
          />
          <div className="space-y-[2px]">
            {textChannels.map((channel) => {
              return (
                <ServerChannels
                  channel={channel}
                  role={role}
                  key={channel.id}
                  server={server}
                />
              );
            })}
          </div>
        </div>
      )}

      {!!audioChannels.length && (
        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.AUDIO}
            role={role}
            server={server}
            label="Voice Channels"
          />
          <div className="space-y-[2px]">
            {audioChannels.map((channel) => {
              return (
                <ServerChannels
                  channel={channel}
                  role={role}
                  key={channel.id}
                  server={server}
                />
              );
            })}
          </div>
        </div>
      )}

      {!!videoChannels.length && (
        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.VIDEO}
            role={role}
            server={server}
            label="Video Channels"
          />
          <div className="space-y-[2px]">
            {videoChannels.map((channel) => {
              return (
                <ServerChannels
                  channel={channel}
                  role={role}
                  key={channel.id}
                  server={server}
                />
              );
            })}
          </div>
        </div>
      )}

      {!!members.length && (
        <div className="mb-2">
          <ServerSection
            sectionType="members"
            role={role}
            server={server}
            label="Members"
          />
          <div className="space-y-[2px]">
            {members.map((member) => {
              return (
                <ServerMember
                  profile={profile}
                  member={member}
                  server={server}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ServerSideBar;
