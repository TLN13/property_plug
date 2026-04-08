export type Listing = {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
  description: string;
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  currency: "CAD",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatListingPrice(price: number) {
  return currencyFormatter.format(price);
}
