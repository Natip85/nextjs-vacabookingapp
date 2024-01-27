"use client";

import useBookRoom from "@/hooks/useBookRoom";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Separator } from "../ui/separator";
import moment from "moment";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { Booking } from "@prisma/client";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
interface RoomPaymentFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

type DateRangesType = {
  startDate: Date;
  endDate: Date;
};
const RoomPaymentForm = ({
  clientSecret,
  handleSetPaymentSuccess,
}: RoomPaymentFormProps) => {
  const { bookingRoomData, resetBookRoom } = useBookRoom();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    handleSetPaymentSuccess(false);
    setIsLoading(false);
  }, [stripe]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements || !bookingRoomData) {
      return;
    }
    try {
      //date overlap check
      const bookings = await axios.get(
        `/api/booking/${bookingRoomData.room.id}`
      );
      const roomBookingDates = bookings.data.map((booking: Booking) => {
        return { startDate: booking.startDate, endDate: booking.endDate };
      });
      const overlapFound = hasOverlap(
        bookingRoomData.startDate,
        bookingRoomData.endDate,
        roomBookingDates
      );

      if (overlapFound) {
        setIsLoading(false);
        return toast({
          variant: "destructive",
          description:
            "Oops! Some of the dates you are trying to book have already been reserved for this room. Please go back and select different dates or rooms",
        });
      }
      //process payemnt
      stripe
        .confirmPayment({ elements, redirect: "if_required" })
        .then((result) => {
          if (!result.error) {
            axios
              .patch(`/api/booking/${result.paymentIntent.id}`)
              .then(() => {
                toast({
                  variant: "success",
                  description: "Room reserved",
                });
                router.refresh();
                resetBookRoom();
                handleSetPaymentSuccess(true);
                setIsLoading(false);
              })
              .catch((error) => {
                console.log(error);
                toast({
                  variant: "destructive",
                  description: "Something went wrong",
                });
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  if (!bookingRoomData?.startDate || !bookingRoomData.endDate)
    return <div>Error: Missing reservation dates...</div>;
  const startDate = moment(bookingRoomData?.startDate).format("MMM do YYYY");
  const endDate = moment(bookingRoomData?.endDate).format("MMM do YYYY");

  const hasOverlap = (
    startDate: Date,
    endDate: Date,
    dateRanges: DateRangesType[]
  ) => {
    const targetInterval = {
      start: startOfDay(new Date(startDate)),
      end: endOfDay(new Date(endDate)),
    };
    for (const range of dateRanges) {
      const rangeStart = startOfDay(new Date(range.startDate));
      const rangeEnd = endOfDay(new Date(range.endDate));

      if (
        isWithinInterval(targetInterval.start, {
          start: rangeStart,
          end: rangeEnd,
        }) ||
        isWithinInterval(targetInterval.end, {
          start: rangeStart,
          end: rangeEnd,
        }) ||
        (targetInterval.start < rangeStart && targetInterval.end > rangeEnd)
      ) {
        return true;
      }
    }
    return false;
  };
  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <h2 className="font-semibol mb-2 text-lg">Billing Address</h2>
      <AddressElement
        options={{
          mode: "billing",
        }}
      />
      <h2 className="font-semibol mb-2 mt-4 text-lg">Payment Information</h2>
      <PaymentElement options={{ layout: "tabs" }} />
      <div className="flex flex-col gap-1 mb-4">
        <Separator />
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold mb-1 text-lg">Your Booking Summary</h2>
          <div>You will check in on {startDate} at 3PM</div>
          <div>You will check out on {endDate} at 3PM</div>
          {bookingRoomData?.breakFastIncluded && (
            <div>Breakfast will be served between 8AM-10AM each day</div>
          )}
        </div>
        <Separator />
        <div className="font-bold text-lg">
          {bookingRoomData?.breakFastIncluded && (
            <div className="mb-2">
              Breakfast Price: ${bookingRoomData.room.breakfastPrice}
            </div>
          )}
          Total Price: ${bookingRoomData?.totalPrice}
        </div>
      </div>
      {isLoading && (
        <Alert className="bg-indigo-600 text-white my-4">
          <Terminal className="h-4 w-4 stroke-white" />
          <AlertTitle>Payment Processing...</AlertTitle>
          <AlertDescription>Please wait until complete</AlertDescription>
        </Alert>
      )}
      <Button disabled={isLoading}>
        {isLoading ? "Processing Payment..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default RoomPaymentForm;
