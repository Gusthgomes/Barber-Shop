"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

const Header = () => {
  const { data } = useSession();

  const handleSignIn = async () => {
    await signIn("google");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Card>
      <CardContent className="p-5 justify-between flex flex-row  items-center">
        <Image src="/logo.png" alt="Logo" width={120} height={18} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="w-8 h-8">
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0">
            <SheetHeader className="text-left p-5">
              <SheetTitle>Menu</SheetTitle>
              <Separator className="text-primary fill-indigo-900" />
            </SheetHeader>
            {data?.user ? (
              <div className="flex justify-between items-center px-5 py-6">
                <div className="flex items-center gap-3 ">
                  <Avatar>
                    <AvatarImage src={data?.user?.image ?? ""}></AvatarImage>
                    <AvatarFallback>B</AvatarFallback>
                  </Avatar>

                  <h2 className="font-bold">{data?.user?.name}</h2>
                </div>
                <Button size="icon" variant="secondary" onClick={handleSignOut}>
                  <LogOutIcon />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-5 py-6">
                <div className="flex items-center gap-2">
                  <UserIcon size={32} />
                  <h2 className="font-bolb">Olá, faça o seu login!</h2>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleSignIn}
                >
                  <LogInIcon className="mr-2" size={18} />
                  Fazer Login
                </Button>
              </div>
            )}
            <div className="flex flex-col gap-3 px-5">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/">
                  <HomeIcon size={18} className="mr-2" />
                  Início
                </Link>
              </Button>

              {data?.user && (
                <Button variant="outline" className="justify-start">
                  <CalendarIcon size={18} className="mr-2" />
                  Agendamentos
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Header;
