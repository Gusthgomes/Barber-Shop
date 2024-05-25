"use client";

import { useState } from "react";
import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cancelBookings } from "@/actions/cancelBookings";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const isBookingConfirmed = isFuture(booking.date);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleCancelClick = async () => {
    setIsDeleteLoading(true);
    try {
      await cancelBookings(booking.id);
      toast.success("Agendamento cancelado com sucesso");
    } catch (error: string | any) {
      toast.error("Erro ao cancelar agendamento");
      throw new Error("Erro ao cancelar agendamento");
    } finally {
      setIsDeleteLoading(false);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-full cursor-pointer">
          <CardContent className="px-0 flex py-0">
            <div className="flex flex-col gap-2 py-5 flex-[3] pl-5">
              <Badge
                className="w-fit"
                variant={isBookingConfirmed ? "default" : "secondary"}
              >
                {isBookingConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h2 className="font-bold">{booking.service.name}</h2>
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>

                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 border-l border-solid border-secondary">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl">{format(booking.date, "dd")}</p>
              <p className="text-sm">{format(booking.date, "hh:mm")}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="text-left pb-6">
          <SheetTitle>Informações da reserva:</SheetTitle>
          <Separator />
        </SheetHeader>
        <div className="relative h-[180px] w-full">
          <Image
            src="/barbershop-map.png"
            alt={booking.barbershop.name}
            fill
            className="object-cover rounded"
          />
          <div className="w-full absolute bottom-4 left-0 px-5">
            <Card className="">
              <CardContent className="p-3 flex gap-2">
                <Avatar>
                  <AvatarImage src={booking.barbershop.imageUrl} />
                </Avatar>
                <div>
                  <h2 className="font-bold">{booking.barbershop.name}</h2>
                  <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">
                    {booking.barbershop.address}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Badge
          className="w-fit my-3"
          variant={isBookingConfirmed ? "default" : "secondary"}
        >
          {isBookingConfirmed ? "Confirmado" : "Finalizado"}
        </Badge>
        <Card>
          <CardContent className="p-3 gap-3 flex flex-col">
            <div className="flex justify-between">
              <h2 className="font-bold">{booking.service.name}</h2>
              <h3 className="font-bold text-sm">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(booking.service.price))}
              </h3>
            </div>

            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm">Data</h3>
              <h4 className="text-sm">
                {format(booking.date, "dd 'de' MMMM", {
                  locale: ptBR,
                })}
              </h4>
            </div>

            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm">Horário</h3>
              <h4 className="text-sm">{format(booking.date, "hh:mm")}</h4>
            </div>

            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm">Barbearia</h3>
              <h4 className="text-sm">{booking.barbershop.name}</h4>
            </div>
          </CardContent>
        </Card>

        <SheetFooter className="flex-row gap-3 py-5">
          <SheetClose asChild>
            <Button className="w-full" variant="secondary">
              Voltar
            </Button>
          </SheetClose>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              {!isBookingConfirmed ? (
                <></>
              ) : (
                <Button className="w-full" variant="destructive">
                  Cancelar
                </Button>
              )}
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90%]">
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Uma vez cancelado, você não poderá reverter essa ação.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-3">
                <AlertDialogCancel className="w-full mt-0">
                  Voltar
                </AlertDialogCancel>
                <AlertDialogAction
                  className="w-full bg-red-500 border-red-500 hover:bg-red-500 hover:border-red-500"
                  disabled={isDeleteLoading}
                  onClick={handleCancelClick}
                >
                  {isDeleteLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
