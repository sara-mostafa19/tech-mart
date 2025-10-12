import React from "react";
import { apiServices } from "@/services/api";
import { formatPrice } from "@/helpers/currency";

export default async function Orders() {
  async function fetchUserOrders() {
    const response = await apiServices.getUserOrders();
    return response;
  }

  const orders = await fetchUserOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order._id} className="border rounded p-4">
              <h2 className="text-xl font-semibold mb-2">Order #{order._id}</h2>
              <p>Status: {order.status}</p>
              <p>Total: {formatPrice(order.total)}</p>
              <div className="my-4 border-t" />
              <div>
                <h3 className="font-semibold mb-2">Items:</h3>
                <ul className="list-disc list-inside">
                  {order.items.map((item: any) => (
                    <li key={item.productId}>
                      {item.name} - Quantity: {item.quantity} - Price: {formatPrice(item.price)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
