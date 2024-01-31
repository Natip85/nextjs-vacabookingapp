"use client";

import Container from "@/components/Container";
import { UserButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SearchInput from "../SearchInput";
import { ModeToggle } from "../theme-toggle";
import { NavMenu } from "../NavMenu";

const NavBar = () => {
  const router = useRouter();
  const { userId } = useAuth();
  return (
    <div className="sticky z-50 top-0 border border-b-primary/10 bg-secondary">
      <Container>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src={"/bedIcon.webp"}
              alt="logo"
              width="30"
              height="30"
              className="aspect-square"
            />
            <div className="font-bold text-xl">Booking</div>
          </div>
          <SearchInput />
          <div className="flex gap-3 items-center">
            <div className="flex">
              <ModeToggle />
              <NavMenu />
            </div>
            <UserButton afterSignOutUrl="/" />
            {!userId && (
              <>
                <Button
                  onClick={() => router.push("/sign-in")}
                  variant={"outline"}
                  size={"sm"}
                >
                  Sign in
                </Button>
                <Button onClick={() => router.push("/sign-up")} size={"sm"}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
