import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorise", { status: 401 });
    if (!serverId)
      return new NextResponse("Server id is missing", { status: 400 });
    if (!params.channelId)
      return new NextResponse("Channel id is missing", { status: 400 });
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log({ err });
    return new NextResponse("Internal server error", { status: 500 });
  }
}
