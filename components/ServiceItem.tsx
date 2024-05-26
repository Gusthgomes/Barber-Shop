"use client";

import { Barbershop, Service, Booking } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { signIn, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Calendar } from "./ui/calendar";
import { useMemo, useState, useEffect } from "react";
import { ptBR } from "date-fns/locale";
import { generateDayTimeList } from "@/helpers/hour";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "@/actions/saveBooking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "@/actions/getDayBookings";

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem = ({
  barbershop,
  service,
  isAuthenticated,
}: ServiceItemProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>();
  const [isSubmitIsLoading, setIsSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!date) {
      return;
    }

    const refreshAvailableHours = async () => {
      const _dayBookings = await getDayBookings(barbershop.id, date);
      setDayBookings(_dayBookings);
    };

    refreshAvailableHours();
  }, [date, barbershop.id]);

  const { data } = useSession();
  const router = useRouter();

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  // removendo os horários que já estão reservados na data selecionada
  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      if (!booking) {
        return true;
      }

      return false;
    });
  }, [date, dayBookings]);

  const handleHourClick = (time: string) => {
    setHour(time);
  };

  // Criando uma reserva
  const handleBookingSubmit = async () => {
    setIsSubmitIsLoading(true);
    try {
      if (!date || !hour || !data?.user) {
        return;
      }

      const dataHour = Number(hour.split(":")[0]);
      const dataMinutes = Number(hour.split(":")[1]);

      const newDate = setMinutes(setHours(date, dataHour), dataMinutes);

      const newDateString = newDate.toISOString();

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDateString,
        userId: (data?.user as any).id,
      });
      setSheetIsOpen(false);
      setHour(undefined);
      setDate(undefined);

      toast("Reserva realizada com sucesso!", {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (error: string | any) {
      toast.error("Erro ao realizar reserva", error);
    } finally {
      setIsSubmitIsLoading(false);
    }
  };

  return (
    <Card className="">
      <CardContent className="p-3">
        <div className="flex gap-4 items-center">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              className="object-contain rounded-lg"
              fill
              priority
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    className="text-primary"
                    onClick={handleBookingClick}
                  >
                    Reservar
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-5 py-6">
                    <SheetTitle>Faça sua reserva</SheetTitle>
                    <Separator className="text-primary fill-indigo-900" />
                  </SheetHeader>
                  <div className="py-6">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      locale={ptBR}
                      fromDate={addDays(new Date(), 1)}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {/* Mostrar lista de horarios apenas se alguma data estiver selecionada*/}

                  {date && (
                    <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden py-6 px-5 border-t border-solid border-secondary">
                      {timeList.map((time) => (
                        <Button
                          variant={hour === time ? "default" : "outline"}
                          onClick={() => handleHourClick(time)}
                          className="rounded-full"
                          key={time}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3 gap-3 flex flex-col">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>

                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Data</h3>
                            <h4 className="text-sm">
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Horário</h3>
                            <h4 className="text-sm">{hour}</h4>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <h3 className="text-gray-400 text-sm">Barbearia</h3>
                          <h4 className="text-sm">{barbershop.name}</h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <SheetFooter className="px-5">
                    <Button
                      disabled={!date || !hour || isSubmitIsLoading}
                      onClick={handleBookingSubmit}
                    >
                      {isSubmitIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
