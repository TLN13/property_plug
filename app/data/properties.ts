export type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  image: string;
};

export const defaultProperties: Property[] = [
  {
    id: "1",
    title: "Modern Condo in Calgary",
    price: "$425,000",
    location: "Downtown Calgary",
    bedrooms: 2,
    bathrooms: 2,
    description:
      "Bright corner-unit condo with a full balcony, open kitchen, and easy access to downtown transit.",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "Family House in Edmonton",
    price: "$589,000",
    location: "South Edmonton",
    bedrooms: 4,
    bathrooms: 3,
    description:
      "Spacious detached home with a finished basement, fenced yard, and room for a growing family.",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    title: "Townhome in Red Deer",
    price: "$349,000",
    location: "Clearview Ridge",
    bedrooms: 3,
    bathrooms: 2,
    description:
      "Well-kept townhome close to schools, parks, and shopping with a practical layout for daily living.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  },
];
