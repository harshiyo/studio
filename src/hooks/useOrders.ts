"use client"
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Order, OrderInput } from "@/lib/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          customer_name,
          company,
          container_size,
          quantity,
          delivery_date,
          status,
          created_at,
          updated_at
        `)
        .order('delivery_date', { ascending: true });

      if (error) {
        throw error;
      }

      // Transform the data to match our frontend types
      const transformedOrders: Order[] = (data || []).map(order => ({
        id: order.id,
        customerName: order.customer_name,
        company: order.company,
        containerSize: order.container_size,
        quantity: order.quantity,
        deliveryDate: order.delivery_date,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      }));

      setOrders(transformedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new order
  const addOrder = async (order: OrderInput) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: order.customerName,
          company: order.company,
          container_size: order.containerSize,
          quantity: order.quantity,
          delivery_date: order.deliveryDate,
          status: order.status,
        }])
        .select(`
          id,
          customer_name,
          company,
          container_size,
          quantity,
          delivery_date,
          status,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        throw error;
      }

      // Transform the response
      const newOrder: Order = {
        id: data.id,
        customerName: data.customer_name,
        company: data.company,
        containerSize: data.container_size,
        quantity: data.quantity,
        deliveryDate: data.delivery_date,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error adding order:', err);
      throw err;
    }
  };

  // Update an existing order
  const updateOrder = async (updatedOrder: Order) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          customer_name: updatedOrder.customerName,
          company: updatedOrder.company,
          container_size: updatedOrder.containerSize,
          quantity: updatedOrder.quantity,
          delivery_date: updatedOrder.deliveryDate,
          status: updatedOrder.status,
        })
        .eq('id', updatedOrder.id)
        .select(`
          id,
          customer_name,
          company,
          container_size,
          quantity,
          delivery_date,
          status,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        throw error;
      }

      // Transform the response
      const transformedOrder: Order = {
        id: data.id,
        customerName: data.customer_name,
        company: data.company,
        containerSize: data.container_size,
        quantity: data.quantity,
        deliveryDate: data.delivery_date,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setOrders(prev => 
        prev.map(order => order.id === updatedOrder.id ? transformedOrder : order)
      );
      return transformedOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating order:', err);
      throw err;
    }
  };

  // Delete an order
  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting order:', err);
      throw err;
    }
  };

  // Toggle order status
  const toggleOrderStatus = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const newStatus = order.status === 'completed' ? 'pending' : 'completed';

      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select(`
          id,
          customer_name,
          company,
          container_size,
          quantity,
          delivery_date,
          status,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        throw error;
      }

      // Transform the response
      const transformedOrder: Order = {
        id: data.id,
        customerName: data.customer_name,
        company: data.company,
        containerSize: data.container_size,
        quantity: data.quantity,
        deliveryDate: data.delivery_date,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setOrders(prev => 
        prev.map(order => order.id === orderId ? transformedOrder : order)
      );
      return transformedOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error toggling order status:', err);
      throw err;
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    addOrder,
    updateOrder,
    deleteOrder,
    toggleOrderStatus,
    refetch: fetchOrders
  };
}
