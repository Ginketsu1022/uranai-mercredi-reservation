export const PRICE_LIST = [
  { minutes: 10, price: 1000 },
  { minutes: 20, price: 2000 },
  { minutes: 30, price: 3000 },
  { minutes: 40, price: 4000 },
  { minutes: 50, price: 5000 },
  { minutes: 60, price: 6000 },
];

export function getPrice(duration: number): number {
  const item = PRICE_LIST.find((p) => p.minutes === duration);
  return item?.price ?? 0;
}