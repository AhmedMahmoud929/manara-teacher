import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import SelectFormEle from "@/components/ui/form/select-form-element";
import TextFormEle from "@/components/ui/form/text-form-element";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus, User2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProductStatusBadge } from "../../shared/ProductStatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IOrder } from "@/types/(waraqah)/order";
import { OrderStatusBadge } from "../../shared/OrderStatusBadge";

function OrderDetailsSheet({
  children,
  order,
}: {
  children: React.ReactNode;
  order: IOrder;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"left"} className="pt-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 md:p-6">
          {/* Order Header */}
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-semibold text-24">طلب#{order.id}</h1>
            <OrderStatusBadge status={order.order_status} />
          </div>
          <div className="text-lg font-medium">{order.total_price} ج.م</div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-2xl p-4 my-4">
            <div className="w-full flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="w-full">
                <h2 className="font-semibold text-black/80">
                  {order.user.name}
                </h2>
                <div className="flex flex-col  text-gray-600 text-sm">
                  <span>
                    {order.user.phone} / {order.user.alternative_phone || "-"}
                  </span>
                  <span className="mr-auto">{order.user.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-6 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">المنتجات</h2>
              <div className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                <span>{order.order_items.length} منتجات</span>
              </div>
            </div>

            {order.order_items.map((item, index) => (
              <div
                key={index}
                className="border-b pb-4 mb-4 last:border-b-0 last:mb-0"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div className="relative w-14 h-14 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.product.category
                          ? item.product.category.name
                          : "لا يمكن العثور على التصنيف"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">الكمية</span>
                      <div className="bg-gray-100 px-2 py-0.5 rounded-md">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">السعر</span>
                      <div className="font-medium">{item.total_price} ج.م</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Timeline */}
          <div className="hidden border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">تاريخ الطلب</h2>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Timeline Items */}
              <div className="space-y-8">
                {/* Item 1 */}
                <div className="relative flex gap-4">
                  <div className="absolute right-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center z-10">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="mr-12 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">تم استلام الطلب</h3>
                        <p className="text-sm text-gray-600">
                          تم استلام طلبك بنجاح ويتم الآن تجهيزه للشحن.
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">10May, 2023</div>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="relative flex gap-4">
                  <div className="absolute right-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center z-10">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="mr-12 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">خرج للتوصيل</h3>
                        <p className="text-sm text-gray-600">
                          تم شحن الطلب وهو الآن في طريقه إلى عنوان التوصيل.
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">10May, 2023</div>
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="relative flex gap-4">
                  <div className="absolute right-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center z-10">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="mr-12 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">تم التوصيل</h3>
                        <p className="text-sm text-gray-600">
                          تم توصيل طلبك بنجاح. شكراً لاستخدامك خدمتنا.
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        15May, 2023{" "}
                        <span className="text-xs text-gray-400">متوقع</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default OrderDetailsSheet;
