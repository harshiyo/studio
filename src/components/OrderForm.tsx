"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format, startOfToday, parseISO } from "date-fns"
import { Calendar as CalendarIcon, CheckCircle } from "lucide-react"
import React from 'react';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { containerSizes } from "@/lib/types"
import type { Order } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile"


const orderSchema = z.object({
  customerName: z.string().min(2, { message: "Customer name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  containerSize: z.enum(containerSizes, { required_error: "Please select a container size." }),
  quantity: z.coerce.number().int().min(1, { message: "Quantity must be at least 1." }),
  deliveryDate: z.date({
    required_error: "A delivery date is required.",
  }),
});

type OrderFormValues = z.infer<typeof orderSchema>

interface OrderFormProps {
    addOrder?: (order: Omit<Order, 'id' | 'deliveryDate' | 'status'> & { deliveryDate: Date }) => void;
    updateOrder?: (order: Order) => void;
    orderToEdit?: Order;
}

export default function OrderForm({ addOrder, updateOrder, orderToEdit }: OrderFormProps) {
  const { toast } = useToast()
  const isEditMode = !!orderToEdit;
  const isMobile = useIsMobile();
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: isEditMode ? {
        ...orderToEdit,
        deliveryDate: parseISO(orderToEdit.deliveryDate),
    } : {
      customerName: "",
      company: "",
      quantity: 1,
    },
  })

  function onSubmit(data: OrderFormValues) {
    if (isEditMode && updateOrder && orderToEdit) {
        updateOrder({
            ...orderToEdit,
            ...data,
            deliveryDate: data.deliveryDate.toISOString(),
        });
        toast({
            title: "Order Updated!",
            description: `Delivery for ${data.company} updated successfully.`,
            action: <CheckCircle className="text-green-500" />,
        })
    } else if (addOrder) {
        addOrder(data);
        toast({
            title: "Order Saved!",
            description: `Delivery for ${data.company} scheduled successfully.`,
            action: <CheckCircle className="text-green-500" />,
        })
        form.reset();
    }
  }

  const FormWrapper = isEditMode ? 'div' : 'div';
  const formProps = isEditMode ? {} : { className: "" };

  const CalendarDatePicker = ({field}: {field: any}) => (
    <Calendar
        mode="single"
        selected={field.value}
        onSelect={(date) => {
            field.onChange(date);
            if (isMobile) {
              setIsDatePickerOpen(false);
            }
        }}
        disabled={(date) =>
            date < startOfToday()
        }
        initialFocus
    />
  )

  return (
    <FormWrapper {...formProps}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={cn("space-y-4", isEditMode ? "p-0" : "p-2")}>
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acme Corporation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="containerSize"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Container Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {containerSizes.map(size => (
                                <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Delivery Date</FormLabel>
                  {isMobile ? (
                     <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                        <DialogTrigger asChild>
                           <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </DialogTrigger>
                        <DialogContent className="w-auto p-0">
                            <CalendarDatePicker field={field} />
                        </DialogContent>
                     </Dialog>
                  ) : (
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarDatePicker field={field} />
                        </PopoverContent>
                    </Popover>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cn("pt-4")}>
            <Button type="submit" className="w-full">
                {isEditMode ? "Update Delivery" : "Save Delivery"}
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  )
}
