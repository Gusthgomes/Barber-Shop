"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  revalidatePath("/");
  revalidatePath("/bookings");
};
