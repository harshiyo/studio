export const containerSizes = [
  "20ft Used (WWT)",
  "20ft Used (Cargo)",
  "20ft New",
  "40ft Used (WWT)",
  "40ft Used (Cargo)",
  "40ft New",
  "40ft HC Used (WWT)",
  "40ft HC Used (Cargo)",
  "40ft HC New",
] as const;

export type ContainerSize = (typeof containerSizes)[number];

export type Order = {
  id: string;
  customerName: string;
  company: string;
  containerSize: ContainerSize;
  quantity: number;
  deliveryDate: string; // ISO 8601 string format
  status: "pending" | "completed";
};
