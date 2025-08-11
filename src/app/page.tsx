"use client";

import * as React from "react";
import type { Order } from "@/lib/types";
import { useOrders } from "@/hooks/useOrders";
import OrderForm from "@/components/OrderForm";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const { orders, loading, error, addOrder, updateOrder, deleteOrder, toggleOrderStatus } = useOrders();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const handleAddOrder = async (order: Omit<Order, 'id' | 'deliveryDate' | 'status'> & { deliveryDate: Date }) => {
    try {
      const newOrder = {
        ...order,
        deliveryDate: order.deliveryDate.toISOString(),
        status: 'pending' as const,
      };
      
      await addOrder(newOrder);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Order added successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      await updateOrder(updatedOrder);
      toast({
        title: "Success",
        description: "Order updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleOrderStatus = async (orderId: string) => {
    try {
      await toggleOrderStatus(orderId);
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading orders: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Delivery Dashboard</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2">Track and manage your upcoming deliveries.</p>
        </header>
        
        <Dashboard 
          orders={orders} 
          deleteOrder={handleDeleteOrder} 
          updateOrder={handleUpdateOrder} 
          toggleOrderStatus={handleToggleOrderStatus} 
        />

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
            <OrderForm addOrder={handleAddOrder} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
