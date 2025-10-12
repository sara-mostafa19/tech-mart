"use client";

import { createContext, ReactNode, useState, useEffect, Dispatch, SetStateAction } from "react";
import { apiServices } from "@/services/api";
import toast from "react-hot-toast";

type Address = {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type AddressContextType = {
  addresses: Address[];
  setAddresses: Dispatch<SetStateAction<Address[]>>;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, "_id">) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
};

export const addressContext = createContext<AddressContextType>({
  addresses: [],
  setAddresses: () => {},
  fetchAddresses: async () => {},
  addAddress: async () => {},
  removeAddress: async () => {},
});

export default function AddressContextProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);

  async function fetchAddresses() {
    // Mock data since API is not available
    setAddresses([
      {
        _id: '1',
        street: '123 Main Street',
        city: 'Cairo',
        state: 'Cairo',
        postalCode: '12345',
        country: 'Egypt'
      }
    ]);
  }

  async function addAddress(address: Omit<Address, "_id">) {
    // Mock add since API is not available
    setAddresses((prev) => Array.isArray(prev) ? [...prev, { ...address, _id: Date.now().toString() }] : [{ ...address, _id: Date.now().toString() }]);
    toast.success("Address added successfully");
  }

  async function removeAddress(addressId: string) {
    // Mock remove since API is not available
    setAddresses((prev) => Array.isArray(prev) ? prev.filter((addr) => addr._id !== addressId) : []);
    toast.success("Address removed successfully");
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <addressContext.Provider value={{ addresses, setAddresses, fetchAddresses, addAddress, removeAddress }}>
      {children}
    </addressContext.Provider>
  );
}
