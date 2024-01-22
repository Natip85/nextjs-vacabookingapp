"use client";

import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  Loader2,
  MountainSnow,
  Pencil,
  Plus,
  Ship,
  Trash,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  VolumeX,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { useToast } from "../ui/use-toast";

interface RoomCarProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}
const RoomCard = ({ hotel, room, bookings = [] }: RoomCarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const isHotelDetailsPage = pathname.includes("hotel-details");
  const handleDialogOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleRoomDelete = (room: Room) => {
    setIsLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            router.refresh();
            toast({
              variant: "success",
              description: "Room deleted",
            });
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              description: "Something went wrong deleting",
            });
          });
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Something went wrong deleting",
        });
      });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="h-4 w-4" />
            {room.bedCount} Bed{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <Users className="h-4 w-4" />
            {room.guestCount} Guest{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" />
            {room.bedCount} Bathroom{"(s)"}
          </AmenityItem>
          {!!room.kingBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.kingBed} King Bed{"(s)"}
            </AmenityItem>
          )}
          {!!room.queenBed && (
            <AmenityItem>
              <Bed className="h-4 w-4" />
              {room.queenBed} Queen Bed{"(s)"}
            </AmenityItem>
          )}
          {room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-4" />
              {room.roomService} Room service
            </AmenityItem>
          )}
          {room.TV && (
            <AmenityItem>
              <Tv className="h-4 w-4" />
              TV
            </AmenityItem>
          )}
          {room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-4" />
              Balcony
            </AmenityItem>
          )}
          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free WIFI
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <Castle className="h-4 w-4" />
              City view
            </AmenityItem>
          )}
          {room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean view
            </AmenityItem>
          )}
          {room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" />
              Forest view
            </AmenityItem>
          )}
          {room.mountainView && (
            <AmenityItem>
              <MountainSnow className="h-4 w-4" />
              Mountain view
            </AmenityItem>
          )}
          {room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Air condition
            </AmenityItem>
          )}
          {room.soundProofed && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" />
              Sound proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between">
          <div>
            Room price: <span className="font-bold">${room.roomPrice}</span>
            <span className="text-xs">/24hrs</span>
          </div>
          {!!room.breakfastPrice && (
            <div>
              Breakfast price:{" "}
              <span className="font-bold">${room.breakfastPrice}</span>
            </div>
          )}
        </div>
        <Separator />
        <CardFooter>
          {isHotelDetailsPage ? (
            <div>Hotel details page</div>
          ) : (
            <div className="flex w-full justify-between">
              <Button
                onClick={() => handleRoomDelete(room)}
                disabled={isLoading}
                type="button"
                variant={"ghost"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </>
                )}
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button
                    type="button"
                    variant={"outline"}
                    className="max-w-[150px]"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Update room
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[900px] w-[90%]">
                  <DialogHeader className="px-2">
                    <DialogTitle>Update room</DialogTitle>
                    <DialogDescription>
                      Make changes top this room
                    </DialogDescription>
                  </DialogHeader>
                  <AddRoomForm
                    hotel={hotel}
                    handleDialogOpen={handleDialogOpen}
                    room={room}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
