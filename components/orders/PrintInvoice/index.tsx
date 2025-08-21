import { IOrder } from "@/types/(waraqah)/order";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { ReceiptText } from "lucide-react";

interface PrintInvoiceProps {
  order: IOrder;
}

export const PrintInvoice = ({ order }: PrintInvoiceProps) => {
  const handlePrintInvoice = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    if (!printWindow)
      return alert(
        "فشل في فتح نافذة الطباعة. يرجى التحقق من إعدادات المتصفح الخاص بك."
      );

    // Format currency
    const formatCurrency = (amount: string) => {
      return `${parseFloat(amount).toLocaleString("ar-EG")} ج.م`;
    };

    // Get order status in Arabic
    const getOrderStatusInArabic = (status: string) => {
      switch (status) {
        case "pending":
          return "قيد الانتظار";
        case "confirmed":
          return "تم التأكيد";
        case "shipped":
          return "تم الشحن";
        case "cancelled":
          return "تم الإلغاء";
        default:
          return status;
      }
    };

    // Get payment status in Arabic
    const getPaymentStatusInArabic = (status: string) => {
      switch (status) {
        case "paid":
          return "مدفوع";
        case "pending":
          return "قيد الانتظار";
        default:
          return status;
      }
    };

    // Generate invoice HTML content
    const invoiceContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <title>فاتورة الطلب #${order.id}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
          
          body {
            font-family: 'Cairo', sans-serif;
            margin: 0;
            padding: 0;
            direction: rtl;
            background-color: #f9f9f9;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          
          .invoice-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
            margin-bottom: 30px;
          }
          
          .logo {
            max-width: 150px;
            margin-bottom: 15px;
          }
          
          .invoice-title {
            font-size: 24px;
            font-weight: 700;
            color: #333;
            margin: 0;
          }
          
          .invoice-number {
            font-size: 16px;
            color: #666;
            margin: 5px 0 0;
          }
          
          .invoice-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          
          .meta-section {
            flex: 1;
          }
          
          .meta-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
          }
          
          .meta-item {
            margin-bottom: 5px;
            color: #555;
          }
          
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          .invoice-table th {
            background-color: #f5f5f5;
            padding: 12px;
            text-align: right;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #ddd;
          }
          
          .invoice-table td {
            padding: 12px;
            text-align: right;
            border-bottom: 1px solid #eee;
            color: #444;
          }
          
          .invoice-table .item-name {
            width: 40%;
          }
          
          .invoice-table .text-center {
            text-align: center;
          }
          
          .invoice-table .text-left {
            text-align: left;
          }
          
          .totals {
            width: 100%;
            display: flex;
            justify-content: flex-end;
          }
          
          .totals-table {
            width: 300px;
            border-collapse: collapse;
          }
          
          .totals-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #eee;
          }
          
          .totals-table .total-row td {
            font-weight: 700;
            border-top: 2px solid #ddd;
            border-bottom: none;
            padding-top: 12px;
          }
          
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #777;
            font-size: 14px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          
          .print-button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 4px;
            font-family: 'Cairo', sans-serif;
            margin-bottom: 20px;
          }
          
          .print-button:hover {
            background-color: #45a049;
          }
          
          @media print {
            .no-print {
              display: none;
            }
            
            body {
              background-color: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .container {
              box-shadow: none;
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="no-print" style="text-align: center;">
            <button class="print-button" onclick="window.print()">طباعة الفاتورة</button>
          </div>
          
          <div class="invoice-header">
            <img src="/logo.png" alt="شعار الشركة" class="logo" onerror="this.style.display='none'">
            <h1 class="invoice-title">فاتورة طلب</h1>
            <p class="invoice-number">رقم الطلب: ${order.id}</p>
          </div>
          
          <div class="invoice-meta">
            <div class="meta-section">
              <h3 class="meta-title">معلومات العميل</h3>
              <p class="meta-item"><strong>الاسم:</strong> ${
                order.user.name || "غير متوفر"
              }</p>
              <p class="meta-item"><strong>رقم الهاتف:</strong> ${
                order.user.phone || "غير متوفر"
              }</p>
            </div>
            
            <div class="meta-section">
              <h3 class="meta-title">معلومات الطلب</h3>
              <p class="meta-item"><strong>تاريخ الطلب:</strong> ${format(
                new Date(order.created_at),
                "EEEE، dd MMMM yyyy",
                { locale: arSA }
              )}</p>
              <p class="meta-item"><strong>حالة الطلب:</strong> ${getOrderStatusInArabic(
                order.order_status
              )}</p>
              <p class="meta-item"><strong>حالة الدفع:</strong> ${getPaymentStatusInArabic(
                order.invoice_status
              )}</p>
              ${
                order.payment_time
                  ? `<p class="meta-item"><strong>تاريخ الدفع:</strong> ${format(
                      new Date(order.payment_time),
                      "EEEE، dd MMMM yyyy",
                      { locale: arSA }
                    )}</p>`
                  : ""
              }
            </div>
          </div>
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th class="item-name">المنتج</th>
                <th class="text-center">الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${order.order_items
                .map(
                  (item) => `
                <tr>
                  <td class="item-name">${item.product?.name || "منتج"}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td>${formatCurrency(item.price)}</td>
                  <td>${formatCurrency(item.total_price)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="totals">
            <table class="totals-table">
              <tr>
                <td>إجمالي المنتجات:</td>
                <td>${formatCurrency(order.total_price)}</td>
              </tr>
              <tr>
                <td>تكلفة التوصيل:</td>
                <td>${formatCurrency(order.customer_delivery_price)}</td>
              </tr>
              <tr class="total-row">
                <td>الإجمالي:</td>
                <td>${formatCurrency(
                  (
                    parseFloat(order.total_price) +
                    parseFloat(order.customer_delivery_price)
                  ).toString()
                )}</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>شكراً لتسوقك معنا!</p>
            <p>للاستفسارات، يرجى التواصل معنا على support@warqa-store.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Write the content to the new window
    printWindow.document.open();
    printWindow.document.write(invoiceContent);
    printWindow.document.close();

    // Focus on the new window
    printWindow.focus();
  };

  return (
    <div
      onClick={handlePrintInvoice}
      className="flex items-center gap-2 cursor-pointer w-full"
    >
      <ReceiptText className="h-4 w-4" />
      <span>طباعة الفاتورة</span>
    </div>
  );
};

export default PrintInvoice;
