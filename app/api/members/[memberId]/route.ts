import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidV4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get("serverId");
    if (!profile) return new NextResponse("Unauthorise", { status: 401 });
    if (!params.memberId)
      return new NextResponse("Member id is missing", { status: 400 });

    if (!serverId)
      return new NextResponse("Server id is missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server);
  } catch (err) {
    console.log({ err });
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!profile) return new NextResponse("Unauthorise", { status: 401 });
    if (!params.memberId)
      return new NextResponse("Member id is missing", { status: 400 });

    if (!serverId)
      return new NextResponse("Server id is missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server);
  } catch (err) {
    console.log({ err });
    return new NextResponse("Internal server error", { status: 500 });
  }
}