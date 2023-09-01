import { currentProfile } from "@/lib/currentProfile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");
    if (!profile) return new NextResponse("Unauthorized", { status: 403 });
    if (!channelId)
      return new NextResponse("Channel id missing", { status: 400 });

    let message: Message[] = [];

    if (cursor) {
      message = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      message = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;
    if (message.length === MESSAGES_BATCH)
      nextCursor = message[MESSAGES_BATCH - 1].id;

    return NextResponse.json({ items: message, nextCursor });
  } catch (err) {
    console.log("ServerPost", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
