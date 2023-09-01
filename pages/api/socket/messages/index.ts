import { currentProfilePages } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method! == "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;
    if (!profile) return res.status(401).json({ error: "Unauthorised" });
    if (!serverId)
      return res.status(400).json({ error: "Server id is missing" });
    if (!channelId)
      return res.status(400).json({ error: "Channel id is missing" });

    if (!content) return res.status(400).json({ error: "Content is missing" });
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) return res.status(404).json({ error: "Server not found" });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const members = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!members) return res.status(404).json({ error: "Member not found" });

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: members.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (err) {
    console.log({ err });

    return res.status(500).json({ message: "Internal server error" });
  }
}
