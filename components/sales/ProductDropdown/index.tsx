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

export function ProductSelect({
  onProductSelect,
}: {
  onProductSelect: (prod: IProduct | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  // Remove all search-related state and effects
  const { data: products, isLoading } = useGetAllProductsQuery({
    page: 1,
    per_page: 200,
  });

  const selectedProductData = products?.data.data.find(
    (product) => product.id === selectedProduct
  );

  // No need for filteredProducts, just use the products directly

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-md border border-black/20 bg-background pr-2 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50"
        >
          {selectedProduct ? (
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-md">
                <Image
                  src={selectedProductData?.image || ""}
                  alt={selectedProductData?.name || ""}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedProductData?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {selectedProductData?.price} ج.م
                </span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">اختر منتج</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          {/* Remove CommandInput for search */}
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading products...
              </div>
            ) : (
              <>
                <CommandEmpty>No products found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {products?.data.data.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={`${product.id}`}
                      onSelect={(currentValue) => {
                        setSelectedProduct(
                          currentValue === `${selectedProduct}`
                            ? null
                            : Number(currentValue)
                        );
                        onProductSelect(
                          currentValue === `${selectedProduct}` ? null : product
                        );
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="relative h-8 w-8 overflow-hidden rounded-md">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col items-start flex-1">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {product.price} ج.م
                          </span>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedProduct === product.id
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
