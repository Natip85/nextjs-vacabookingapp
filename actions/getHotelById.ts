import prismadb from "@/lib/prismadb";
import { ObjectId } from "mongodb";

export const getHotelById = async (hotelId: string) => {
  const newHotelId = new ObjectId().toHexString();
  try {
    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: hotelId === "new" ? newHotelId : hotelId,
      },
      include: {
        rooms: true,
      },
    });

    if (!hotel) return null;

    return hotel;
  } catch (error: any) {
    throw new Error(error);
  }
};
