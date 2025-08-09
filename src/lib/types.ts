export const containerSizes = ["Small", "Medium", "Large"] as const;

export type ContainerSize = typeof containerSizes[number];

export type Order = {
  id: string;
  customerName: string;
  company: string;
  containerSize: ContainerSize;
  quantity: number;
  deliveryDate: string; // ISO 8601 string format
  status: 'pending' | 'completed';
};
