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
    const { conversationId } = req.query;
    if (!profile) return res.status(401).json({ error: "Unauthorised" });

    if (!conversationId)
      return res.status(400).json({ error: "Channel id is missing" });

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

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: conversationId as string,
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

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (err) {
    console.log({ err });

    return res.status(500).json({ message: "Internal server error" });
  }
}
