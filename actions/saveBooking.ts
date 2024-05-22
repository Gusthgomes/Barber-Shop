"use server";

import { db } from "@/lib/prisma";

interface SaveBookingProps {
  barbershopId: string;
  serviceId: string;
  userId: string;
  date: string;
}

export const saveBooking = async (params: SaveBookingProps) => {
  await db.booking.create({
    data: {
      serviceId: params.serviceId,
      userId: params.userId,
      date: params.date,
      barbershopId: params.barbershopId,
    },
  });
};
