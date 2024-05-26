import BarberShopItem from "@/components/BarberShopItem";
import BookingItem from "@/components/BookingItem";
import Header from "@/components/Header";
import Search from "@/components/Search";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        {session ? (
          <h2 className="text-xl font-bold">Olá, {session?.user?.name}</h2>
        ) : (
          <h2 className="text-xl font-bold">Olá, Bom te ver aqui!</h2>
        )}
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="mt-6">
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="pl-5 text-xs uppercase text-gray-400 font-bold mb-3">
              Agendamentos
            </h2>
            <div className="px-5 flex gap-3">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="my-6 px-5">
        <h2 className="px-0 text-xs uppercase text-gray-400 font-bold mb-3">
          Recomendados
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {barbershops.map((barbershop) => (
            <div className="min-w-full max-w-full" key={barbershop.id}>
              <BarberShopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
