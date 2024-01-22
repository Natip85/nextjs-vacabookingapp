import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await request.json();
    const { userId } = auth();
    if (!params.roomId) {
      return new NextResponse("RoomID is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const room = await prismadb.room.update({
      where: {
        id: params.roomId,
      },
      data: { ...body },
    });
    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at /api/room/hotelId PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { userId } = auth();
    if (!params.roomId) {
      return new NextResponse("Room ID is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const room = await prismadb.room.delete({
      where: {
        id: params.roomId,
      },
    });
    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at /api/room/roomId DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
