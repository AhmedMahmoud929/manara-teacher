export function generateCoupon(length = 5, prefix = "WARQAH"): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let coupon = prefix + "_";

  for (let i = 0; i < length; i++) {
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    coupon += randomChar;
  }

  return coupon;
}
