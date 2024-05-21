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

  return (
    <div>
      <div className="h-[250px] w-full relative">
        <Button
          variant="outline"
          size="icon"
          className="z-50 absolute top-3 left-3"
        >
          <ChevronLeftIcon size={18} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="z-50 absolute top-3 right-3"
        >
          <MenuIcon size={18} />
        </Button>
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          fill
          priority
          className="object-cover opacity-75"
        />
      </div>

      <div className=" px-5 py-3 pb-6 border-b border-solid border-secondary">
        <h1 className="text-xl font-bold">{barbershop.name}</h1>
        <div className="flex items-center gap-1 mt-2">
          <MapPinIcon className="text-indigo-900 fill-primary" size={18} />
          <p className="text-xm">{barbershop.address}</p>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <StarIcon className="text-indigo-900 fill-primary" size={18} />
          <p className="text-xm">4.7 (732 avaliações)</p>
        </div>
      </div>
    </div>
  );
};

export default BarberShopDetailsPage;
