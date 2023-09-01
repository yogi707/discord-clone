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
    const { directMessageId, conversationId } = req.query;
    if (!profile) return res.status(401).json({ error: "Unauthorised" });

    if (!conversationId)
      return res.status(400).json({ error: "Channel id is missing" });

    if (!directMessageId)
      return res.status(400).json({ error: "Message id is missing" });

    if (!content) return res.status(400).json({ error: "Content is missing" });

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res.status(404).json({ error: "conversation not found" });

    const members =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!members) return res.status(404).json({ error: "Member not found" });

    let message = await db.directMessage.findFirst({
      where: {
        conversationId: conversationId as string,
        id: directMessageId as string,
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
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
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
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
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
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
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
    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (err) {
    console.log({ err });

    return res.status(500).json({ message: "Internal server error" });
  }
}
