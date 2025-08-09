"use client"

import type { Order } from "@/lib/types";
import { format, isTomorrow, parseISO, isToday } from 'date-fns';
import { Truck, Package, X, Calendar as CalendarIcon, User, Building, Pencil, Check } from 'lucide-react';
import * as React from "react";
import OrderForm from './OrderForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DashboardProps {
    orders: Order[];
    deleteOrder: (id: string) => void;
    updateOrder: (order: Order) => void;
    toggleOrderStatus: (id: string) => void;
}

const OrderCard = ({ order, deleteOrder, updateOrder, toggleOrderStatus }: { order: Order; deleteOrder: (id: string) => void; updateOrder: (order: Order) => void; toggleOrderStatus: (id: string) => void; }) => {
    const deliveryDate = parseISO(order.deliveryDate);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const isCompleted = order.status === 'completed';

    return (
        <Card className={cn("transition-all hover:shadow-md", isCompleted && "bg-muted/50")}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className={cn(isCompleted && "line-through text-muted-foreground")}>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building className="w-5 h-5 text-primary" />
                            {order.company}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                             <User className="w-4 h-4" />
                            {order.customerName}
                        </CardDescription>
                    </div>
                     <div className="flex items-center">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Delivery</DialogTitle>
                                </DialogHeader>
                                <OrderForm 
                                    orderToEdit={order} 
                                    updateOrder={(updatedOrder) => {
                                        updateOrder(updatedOrder);
                                        setIsEditDialogOpen(false);
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8">
                                <X className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this delivery record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteOrder(order.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
                <div className={cn("grid gap-2", isCompleted && "line-through text-muted-foreground")}>
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>{order.containerSize} container, Quantity: {order.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{format(deliveryDate, 'EEEE, LLL d, yyyy')}</span>
                    </div>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id={`complete-${order.id}`} checked={isCompleted} onCheckedChange={() => toggleOrderStatus(order.id)} />
                    <label
                        htmlFor={`complete-${order.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Mark as completed
                    </label>
                    {isCompleted && <Check className="w-5 h-5 text-green-600" />}
                </div>
            </CardContent>
        </Card>
    );
}

const EmptyState = ({title, description, icon: Icon}: {title: string, description: string, icon: React.ElementType}) => (
    <div className="text-center py-12 px-6 bg-card rounded-lg border border-dashed">
        <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
            {description}
        </p>
    </div>
);


export default function Dashboard({ orders, deleteOrder, updateOrder, toggleOrderStatus }: DashboardProps) {
    const sortedOrders = [...orders].sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());
    
    const todaysDeliveries = sortedOrders.filter(order => {
        const deliveryDate = parseISO(order.deliveryDate);
        return isToday(deliveryDate);
    });

    const tomorrowsDeliveries = sortedOrders.filter(order => {
        const deliveryDate = parseISO(order.deliveryDate);
        return isTomorrow(deliveryDate);
    });

    return (
        <Tabs defaultValue="today">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="today">
                    Today's Deliveries
                    {todaysDeliveries.length > 0 && <Badge className="ml-2">{todaysDeliveries.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="tomorrow">
                    Tomorrow's Deliveries
                    {tomorrowsDeliveries.length > 0 && <Badge className="ml-2">{tomorrowsDeliveries.length}</Badge>}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="mt-4">
                <div className="space-y-4">
                    {todaysDeliveries.length > 0 ? (
                        todaysDeliveries.map(order => <OrderCard key={order.id} order={order} deleteOrder={deleteOrder} updateOrder={updateOrder} toggleOrderStatus={toggleOrderStatus} />)
                    ) : (
                        <EmptyState 
                            title="No Deliveries for Today"
                            description="Check back later or add a new delivery."
                            icon={CalendarIcon}
                        />
                    )}
                </div>
            </TabsContent>
            <TabsContent value="tomorrow" className="mt-4">
                <div className="space-y-4">
                    {tomorrowsDeliveries.length > 0 ? (
                        tomorrowsDeliveries.map(order => <OrderCard key={order.id} order={order} deleteOrder={deleteOrder} updateOrder={updateOrder} toggleOrderStatus={toggleOrderStatus} />)
                    ) : (
                       <EmptyState 
                            title="No Deliveries for Tomorrow"
                            description="Check back later or add a new delivery."
                            icon={Truck}
                        />
                    )}
                </div>
            </TabsContent>
        </Tabs>
    )
}
