import BarbershopInfo from "@/components/BarbershopInfo";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
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
  if (!params.id) {
    // TODO: redirecionar para home page
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!barbershop) {
    return notFound();
  }

  return <BarbershopInfo barbershop={barbershop} />;
};

export default BarberShopDetailsPage;
