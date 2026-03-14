export type Screen = "splash" | "menu" | "game" | "garage" | "gameover";

export interface CarDef {
  id: string;
  name: string;
  color: string;
  roofColor: string;
  cost: number;
  description: string;
}

export const CARS: CarDef[] = [
  {
    id: "sports",
    name: "Sports Car",
    color: "#e63946",
    roofColor: "#a02030",
    cost: 0,
    description: "Fast & free!",
  },
  {
    id: "police",
    name: "Police Car",
    color: "#2d2d44",
    roofColor: "#f8f8ff",
    cost: 50,
    description: "To serve & drive",
  },
  {
    id: "taxi",
    name: "Taxi",
    color: "#FFBE0B",
    roofColor: "#cc9900",
    cost: 100,
    description: "Fare game!",
  },
  {
    id: "supercar",
    name: "Super Car",
    color: "#f77f00",
    roofColor: "#c06000",
    cost: 200,
    description: "Pure speed",
  },
  {
    id: "truck",
    name: "Truck",
    color: "#4361ee",
    roofColor: "#2040cc",
    cost: 150,
    description: "Big & bold",
  },
];

export const CAR_MAP: Record<string, CarDef> = Object.fromEntries(
  CARS.map((c) => [c.id, c]),
);
