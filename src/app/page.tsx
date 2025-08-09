"use client";

import type { Order } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import OrderForm from "@/components/OrderForm";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);

  const addOrder = (order: Omit<Order, 'id' | 'deliveryDate'> & { deliveryDate: Date }) => {
    const newOrder: Order = {
      ...order,
      id: new Date().getTime().toString(), // simple unique id
      deliveryDate: order.deliveryDate.toISOString(),
    };
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prevOrders) => 
      prevOrders.map(order => order.id === updatedOrder.id ? updatedOrder : order)
    );
  }

  const deleteOrder = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">Delivery Dashboard</h1>
        <p className="text-muted-foreground mt-2">Track and manage your upcoming deliveries.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2">
          <OrderForm addOrder={addOrder} />
        </div>
        <div className="lg:col-span-3">
          <Dashboard orders={orders} deleteOrder={deleteOrder} updateOrder={updateOrder} />
        </div>
      </div>
    </main>
  );
}
