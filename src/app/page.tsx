"use client";

import * as React from "react";
import type { Order } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import OrderForm from "@/components/OrderForm";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Home() {
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const addOrder = (order: Omit<Order, 'id' | 'deliveryDate' | 'status'> & { deliveryDate: Date }) => {
    const newOrder: Order = {
      ...order,
      id: new Date().getTime().toString(), // simple unique id
      deliveryDate: order.deliveryDate.toISOString(),
      status: 'pending',
    };
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setIsAddDialogOpen(false);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prevOrders) => 
      prevOrders.map(order => order.id === updatedOrder.id ? updatedOrder : order)
    );
  }

  const deleteOrder = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
  }
  
  const toggleOrderStatus = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: order.status === 'completed' ? 'pending' : 'completed' }
          : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Delivery Dashboard</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2">Track and manage your upcoming deliveries.</p>
        </header>
        
        <Dashboard orders={orders} deleteOrder={deleteOrder} updateOrder={updateOrder} toggleOrderStatus={toggleOrderStatus} />

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
              <Plus className="h-7 w-7" />
              <span className="sr-only">Add New Delivery</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Delivery</DialogTitle>
            </DialogHeader>
            <OrderForm addOrder={addOrder} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
