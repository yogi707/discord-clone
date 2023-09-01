import { currentProfilePages } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl } = req.body;
    const { serverId, channelId, messageId } = req.query;
    if (!profile) return res.status(401).json({ error: "Unauthorised" });
    if (!serverId)
      return res.status(400).json({ error: "Server id is missing" });
    if (!channelId)
      return res.status(400).json({ error: "Channel id is missing" });

    if (!messageId)
      return res.status(400).json({ error: "Message id is missing" });

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

    let message = await db.message.findFirst({
      where: {
        channelId: channelId as string,
        id: messageId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted)
      return res.status(400).json({ error: "Message not found" });

    const isMessageOwner = message.memberId === profile.id;
    const isAdmin = members.role === MemberRole.ADMIN;
    const isModerator = members.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) return res.status(403).json({ error: "Access forbidden" });

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "this message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "this message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner)
        return res.status(403).json({ error: "Access forbidden" });
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (err) {
    console.log({ err });

    return res.status(500).json({ message: "Internal server error" });
  }
}
