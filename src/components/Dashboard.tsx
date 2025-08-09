"use client"

import type { Order } from "@/lib/types";
import { format, isTomorrow, parseISO, startOfToday } from 'date-fns';
import { Truck, Package, X, Calendar as CalendarIcon, User, Building } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
}

const OrderCard = ({ order, deleteOrder }: { order: Order; deleteOrder: (id: string) => void; }) => {
    const deliveryDate = parseISO(order.deliveryDate);
    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building className="w-5 h-5 text-primary" />
                            {order.company}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                             <User className="w-4 h-4" />
                            {order.customerName}
                        </CardDescription>
                    </div>
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
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>{order.containerSize} container, Quantity: {order.quantity}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{format(deliveryDate, 'EEEE, LLL d, yyyy')}</span>
                </div>
                {isTomorrow(deliveryDate) && <Badge variant="default" className="w-fit bg-accent text-accent-foreground mt-2">Delivery Tomorrow</Badge>}
            </CardContent>
        </Card>
    );
}

const EmptyState = () => (
    <div className="text-center py-12 px-6 bg-card rounded-lg border border-dashed">
        <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Deliveries Scheduled</h3>
        <p className="mt-2 text-sm text-muted-foreground">
            Use the form to add a new delivery.
        </p>
    </div>
);


export default function Dashboard({ orders, deleteOrder }: DashboardProps) {
    const sortedOrders = [...orders].sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());
    const tomorrowsDeliveries = sortedOrders.filter(order => {
        const deliveryDate = parseISO(order.deliveryDate);
        return isTomorrow(deliveryDate);
    });

    return (
        <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Deliveries</TabsTrigger>
                <TabsTrigger value="tomorrow">
                    Tomorrow's Deliveries
                    {tomorrowsDeliveries.length > 0 && <Badge className="ml-2 bg-accent text-accent-foreground">{tomorrowsDeliveries.length}</Badge>}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
                <div className="space-y-4">
                    {sortedOrders.length > 0 ? (
                        sortedOrders.map(order => <OrderCard key={order.id} order={order} deleteOrder={deleteOrder} />)
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </TabsContent>
            <TabsContent value="tomorrow" className="mt-4">
                <div className="space-y-4">
                    {tomorrowsDeliveries.length > 0 ? (
                        tomorrowsDeliveries.map(order => <OrderCard key={order.id} order={order} deleteOrder={deleteOrder} />)
                    ) : (
                       <div className="text-center py-12 px-6 bg-card rounded-lg border border-dashed">
                            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Deliveries for Tomorrow</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Check back later or add a new delivery.
                            </p>
                        </div>
                    )}
                </div>
            </TabsContent>
        </Tabs>
    )
}
