import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import ProductAccordion from "@/components/website/products/ProductAccordion";
// import ProductDetails from "@/components/website/products/ProductDetails";
// import SimilarProducts from "@/components/website/products/SimilarProducts";
import { Button } from "@/components/ui/button";
import { Award, Truck, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { IProduct } from "@/types/(waraqah)/product";
import { useState } from "react";

interface ProductDetailsDialogProps {
  product: IProduct;
  children: React.ReactNode;
}

export default function ProductDetailsDialog({
  product,
  children,
}: ProductDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{"children"}</DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">تفاصيل المنتج</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-12">
            {/* Product Images Section */}
            <div className="">
              <div className="w-full h-[40vh] lg:h-full relative bg-[#9CCFC1]/20 rounded-2xl p-4 mb-4">
                <Image
                  src={product.image!}
                  alt={product.name!}
                  fill
                  className="mx-auto object-contain h-96 w-full"
                />
              </div>

              {/* TODO: Show product images later */}
              {/* <div className="hidden grid-cols-4 gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`bg-[#3eb489]/20 rounded-xl p-2 transition-all ${
                selectedImage === index ? "ring-2 ring-[#3eb489]" : ""
              }`}
            >
              <Image
                src={img}
                alt={`صورة ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-auto object-contain"
              />
            </button>
          ))}
        </div> */}
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col justify-between ">
              <div>
                <div className="flex-between">
                  <Link
                    href={`/products?category=${product.category.id}`}
                    className="mb-2 opacity-60 underline"
                  >
                    {product.category.name}
                  </Link>
                  <Badge variant={"secondary"} className="font-medium">
                    متوفرة بالمخزن
                  </Badge>
                </div>

                <h1 className="text-32 font-bold mb-4">{product.name}</h1>

                <div className="mb-6">
                  <div className="text-3xl font-bold mb-1">
                    {product.price} ج.م
                  </div>
                  <div className="text-xl text-gray-500 line-through">
                    {product.price_before_discount} ج.م
                  </div>
                </div>

                <div className="flex flex-wrap gap-12 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="flex-center w-12 h-12 rounded-full bg-main-yellow/30">
                      <Truck className="text-main-orange h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-20 font-medium">3 إلى 5 أيام</div>

                      <div className="text-14 opacity-50">وقت التوصيل</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-center w-12 h-12 rounded-full bg-main-yellow/30">
                      <Award className="text-main-orange h-5 w-5" />
                    </div>
                    <div>
                      <div>
                        <div className="text-20 font-medium">افضل المنتجات</div>

                        <div className="text-14 opacity-50">المنتج مضمون؟</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex-between flex-col sm:flex-row mb-6 p-4 bg-gray-50 rounded-lg cursor-pointer duration-150 hover:scale-[0.95] hover:shadow-md hover:shadow-gray-100">
                  <div>
                    <div className="font-semibold mb-2">محتاج حاجة تانية؟</div>
                    <div className="mb-2">شنطة ظهر مدرسية + مقلمة ملونة</div>
                    <div className="relative mr-2">
                      <span className="relative z-10">
                        أكثر من 130 شخص طلبوهم مع بعض!
                      </span>
                      <span className="absolute-center w-[110%] h-[105%] transform -skew-x-12 bg-main-yellow"></span>
                    </div>
                  </div>

                  <div className="flex-center flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <div className="relative w-24 h-24">
                        <Image
                          src="/images/products/blue-backpack-back-view.png"
                          alt="شنطة وردية"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <div className="text-3xl text-dark-green">+</div>

                    <div className="p-2 rounded-lg bg-primary/20">
                      <div className="relative w-24 h-24">
                        <Image
                          src="/images/red backpack.png"
                          alt="شنطة زرقاء"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
