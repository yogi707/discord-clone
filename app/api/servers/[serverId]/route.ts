import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();
    if (!profile) return new NextResponse("Unauthorise", { status: 401 });
    if (!params.serverId)
      return new NextResponse("Server id is missing", { status: 400 });
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log({ err });
    return new NextResponse("Internal server error", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
  
    if (!profile) return new NextResponse("Unauthorise", { status: 401 });
    if (!params.serverId)
      return new NextResponse("Server id is missing", { status: 400 });
    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log({ err });
    return new NextResponse("Internal server error", { status: 500 });
  }
}