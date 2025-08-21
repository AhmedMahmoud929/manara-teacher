"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetAllProductsQuery } from "@/redux/features/products/productsApi";
import { IProduct } from "@/types/(waraqah)/product";
import { useGetAllOffersQuery } from "@/redux/features/(waraqah)/offers/offersApi";

export function OffersDropdown({
  defaultValue,
  onOfferSelect,
}: {
  defaultValue: number;
  onOfferSelect: (offer_id: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(
    defaultValue
  );

  // Remove all search-related state and effects
  const { data: offers, isLoading } = useGetAllOffersQuery({
    page: 1,
    per_page: 200,
  });

  const selectedOfferData = offers?.data.data.find(
    (offer) => offer.id === selectedOffer
  );

  // No need for filteredProducts, just use the products directly

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-md border border-black/20 bg-background pr-2 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50"
        >
          {selectedOffer ? (
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-md">
                <Image
                  src={selectedOfferData?.image || ""}
                  alt={selectedOfferData?.title || ""}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedOfferData?.title}</span>
                <span className="text-xs text-muted-foreground">
                  {selectedOfferData?.new_price} ج.م
                </span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">اختر عرض</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="!w-full">
          {/* Remove CommandInput for search */}
          <CommandList className="!w-full">
            {isLoading ? (
              <div className="py-6 text-center text-sm flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading offers...
              </div>
            ) : (
              <>
                <CommandEmpty>No offers found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {offers?.data.data.map((offer) => (
                    <CommandItem
                      key={offer.id}
                      value={`${offer.id}`}
                      onSelect={(currentValue) => {
                        setSelectedOffer(
                          currentValue === `${offer}`
                            ? null
                            : Number(currentValue)
                        );
                        onOfferSelect(
                          currentValue === `${selectedOffer}` ? null : offer.id
                        );
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="relative h-8 w-8 overflow-hidden rounded-md">
                          <Image
                            src={offer.image}
                            alt={offer.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col items-start flex-1">
                          <span className="font-medium">{offer.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {offer.new_price} ج.م
                          </span>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedOffer === offer.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
