"use client"

import type { Order } from "@/lib/types";
import { format, isTomorrow, parseISO, isToday } from 'date-fns';
import { Truck, Package, X, Calendar as CalendarIcon, User, Building, Pencil, Check, MoreVertical } from 'lucide-react';
import * as React from "react";
import OrderForm from './OrderForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <Card className={cn("transition-all hover:shadow-lg", isCompleted && "bg-muted/60 dark:bg-muted/30")}>
            <CardContent className="p-4 grid gap-4">
                <div className="flex justify-between items-start">
                    <div className="grid gap-1">
                        <div className={cn("font-semibold flex items-center gap-2 text-base", isCompleted && "line-through text-muted-foreground")}>
                            <Building className="w-4 h-4 text-primary shrink-0" />
                            {order.company}
                        </div >
                        <div className={cn("text-sm text-muted-foreground flex items-center gap-2", isCompleted && "line-through")}>
                             <User className="w-4 h-4 shrink-0" />
                            {order.customerName}
                        </div>
                    </div>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
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
                             <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={(e) => e.preventDefault()}>
                                <X className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                <div className={cn("grid sm:grid-cols-2 gap-4 text-sm", isCompleted && "line-through text-muted-foreground")}>
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{order.containerSize} container, Qty: {order.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{format(deliveryDate, 'EEE, LLL d')}</span>
                    </div>
                </div>
                 <div className="flex items-center space-x-2 pt-2 border-t border-dashed -mx-4 px-4">
                    <Checkbox id={`complete-${order.id}`} checked={isCompleted} onCheckedChange={() => toggleOrderStatus(order.id)} />
                    <label
                        htmlFor={`complete-${order.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Mark as completed
                    </label>
                    {isCompleted && <Badge variant="secondary" className="text-green-600 border-green-600/20">Completed</Badge>}
                </div>
            </CardContent>
        </Card>
    );
}

const EmptyState = ({title, description, icon: Icon}: {title: string, description: string, icon: React.ElementType}) => (
    <div className="text-center py-12 px-6 bg-card rounded-lg border-2 border-dashed">
        <Icon className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
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
        <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="today">
                    Today
                    {todaysDeliveries.length > 0 && <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">{todaysDeliveries.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="tomorrow">
                    Tomorrow
                    {tomorrowsDeliveries.length > 0 && <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">{tomorrowsDeliveries.length}</Badge>}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="today">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {todaysDeliveries.length > 0 ? (
                        todaysDeliveries.map(order => <OrderCard key={order.id} order={order} deleteOrder={deleteOrder} updateOrder={updateOrder} toggleOrderStatus={toggleOrderStatus} />)
                    ) : (
                        <div className="md:col-span-2 lg:col-span-3">
                            <EmptyState 
                                title="No Deliveries for Today"
                                description="Check back later or add a new delivery."
                                icon={CalendarIcon}
                            />
                        </div>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="tomorrow">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tomorrowsDeliveries.length > 0 ? (
                        tomorrowsDeliveries.map(order => <OrderCard key={order.id} order={order} deleteOrder={deleteOrder} updateOrder={updateOrder} toggleOrderStatus={toggleOrderStatus} />)
                    ) : (
                       <div className="md:col-span-2 lg:col-span-3">
                           <EmptyState 
                                title="No Deliveries for Tomorrow"
                                description="Check back later or add a new delivery."
                                icon={Truck}
                            />
                        </div>
                    )}
                </div>
            </TabsContent>
        </Tabs>
    )
}
