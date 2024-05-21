import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BarbershopInfo from "@/components/BarbershopInfo";
import ServiceItem from "@/components/ServiceItem";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface BarberShopDetailsPageProps {
  params: {
    id?: string;
  };
}

export const metadata = {
  title: "Detalhes da Barbearia",
  description: "Detalhes da Barbearia",
};

const BarberShopDetailsPage = async ({
  params,
}: BarberShopDetailsPageProps) => {
  const session = await getServerSession(authOptions);

  if (!params.id) {
    // TODO: redirecionar para home page
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    return notFound();
  }

  return (
    <div className="">
      <BarbershopInfo barbershop={barbershop} />
      <div className="flex flex-col px-5 gap-4 py-6">
        {barbershop.services.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            isAuthenticated={!!session?.user}
          />
        ))}
      </div>
    </div>
  );
};

export default BarberShopDetailsPage;
