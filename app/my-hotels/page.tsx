import { getHotelsByUserId } from "@/actions/getHotelsByUserId";
import HotelList from "@/components/hotel/HotelList";
import React from "react";

type Props = {};

const MyHotels = async (props: Props) => {
  const hotels = await getHotelsByUserId();
  if (!hotels) return <div>No hotels found</div>;
  return (
    <div>
      <h2 className="text-2xl font-semibold">Here are your properties</h2>
      <HotelList hotels={hotels} />
    </div>
  );
};

export default MyHotels;
