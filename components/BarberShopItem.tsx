import { Barbershop } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

interface BarberShopItemProps {
  barbershop: Barbershop;
}

const BarberShopItem = ({ barbershop }: BarberShopItemProps) => {
  return (
    <Card className="min-w-[167px] max-w-[167px] rounded-2xl">
      <CardContent className="p-0 px-1 ">
        <div className="relative w-full h-[159px]">
          <Image
            src={barbershop.imageUrl}
            alt={barbershop.name}
            width={0}
            height={0}
            sizes="100vw"
            fill
            className="rounded-2xl object-cover"
          />
        </div>

        <div className="px-3 pb-3">
          <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap">
            {barbershop.name}
          </h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">
            {barbershop.address}
          </p>
          <Button className="w-full mt-3" variant="secondary">
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarberShopItem;
