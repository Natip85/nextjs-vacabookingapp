import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const { userId } = auth();
    if (!params.Id) {
      return new NextResponse("Payment intent ID is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const booking = await prismadb.booking.update({
      where: {
        paymentIntentId: params.Id,
      },
      data: { paymentStatus: true },
    });
    return NextResponse.json(booking);
  } catch (error) {
    console.log("Error at /api/booking/Id PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const { userId } = auth();
    if (!params.Id) {
      return new NextResponse("Booking ID is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const booking = await prismadb.booking.delete({
      where: {
        id: params.Id,
      },
    });
    return NextResponse.json(booking);
  } catch (error) {
    console.log("Error at /api/booking/Id DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const { userId } = auth();
    if (!params.Id) {
      return new NextResponse("Hotel ID is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await prismadb.booking.findMany({
      where: {
        paymentStatus: true,
        roomId: params.Id,
        endDate: {
          gt: yesterday,
        },
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.log("Error at /api/booking/Id GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
