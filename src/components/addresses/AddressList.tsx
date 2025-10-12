"use client";

import React, { useContext, useState } from "react";
import { addressContext } from "@/contexts/addressContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface AddressListProps {
  onSelect: (addressId: string) => void;
  selectedAddressId: string | null;
}

export default function AddressList({ onSelect, selectedAddressId }: AddressListProps) {
  const contextValue = useContext(addressContext);
  if (!contextValue) return <div>Loading addresses...</div>;

  const { addresses = [], removeAddress } = contextValue;
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleRemove(id: string) {
    setRemovingId(id);
    await removeAddress(id);
    setRemovingId(null);
  }

  return (
    <div>
      {/* {addresses.length === 0 && <p>No addresses found. Please add one.</p>} */}
      <ul className="space-y-4">
        {addresses.map((address) => (
          <li
            key={address._id}
            className={`border p-4 rounded cursor-pointer ${
              selectedAddressId === address._id ? "border-primary bg-primary/10" : "border-gray-300"
            }`}
            onClick={() => onSelect(address._id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(address._id);
                }}
                disabled={removingId === address._id}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
