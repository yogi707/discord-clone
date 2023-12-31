import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidV4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorise", { status: 401 });
    if (!params.serverId)
      return new NextResponse("Server id is missing", { status: 400 });
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidV4(),
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log({ err });
    return new NextResponse("Internal server error", { status: 500 });
  }
}
