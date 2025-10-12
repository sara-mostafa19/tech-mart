 "use client";
import { Button } from '@/components';
import CartProduct from '@/components/products/CartProduct';
import { cartContext } from '@/contexts/cartContext';
import { formatPrice } from '@/helpers/currency';
import { GetUserCartResponse } from '@/interfaces';
import { apiServices } from '@/services/api';
import { Separator } from '@radix-ui/react-separator';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddressList from '@/components/addresses/AddressList';
import AddressForm from '@/components/addresses/AddressForm';
import { addressContext } from '@/contexts/addressContext';

interface InnerCartProps{
    cartData:GetUserCartResponse;
}

export default function InnerCart({cartData}:InnerCartProps) {
    const [innerCartData, setInnerCartData] = useState<GetUserCartResponse>(cartData);
    const {setCartCount}=useContext(cartContext)
    const { fetchAddresses } = useContext(addressContext);

    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState<string>("");

    useEffect(()=>{
      setCartCount!(
      innerCartData.numOfCartItems)
    },[innerCartData])

    useEffect(() => {
      if (showAddressModal) {
        fetchAddresses();
      }
    }, [showAddressModal]);

      async function updateCart(){
        const newCartData= await apiServices.getUserCart()
            setInnerCartData(newCartData);
      }
    
       async function handleRemoveCartItem(productId : string, setIsRemovingProduct:(value : boolean)=> void){
        setIsRemovingProduct(true)
            const response= await apiServices.removeCartProduct(productId)
            toast.success("Product removed successfully")

            setIsRemovingProduct(false)
           updateCart();

        }

        async function handleClearCart(){
            const response= await apiServices.clearCart();
          updateCart();
        }

        async function handleUpdateProductCartCount(productId:string, count:number){
          const response= await apiServices.updateCartProductCount(productId, count);
         updateCart();
          console.log("responseeeeee", response)
        }

    const [showCheckout, setShowCheckout] = React.useState(false);

    async function fetchCheckoutSession() {
      if (!selectedAddressId) {
        toast.error("Please select an address");
        return;
      }
      try {
        const sessionData = {
          addressId: selectedAddressId,
          amount: innerCartData.data.totalCartPrice,
          cartId: innerCartData.cartId 
        };
        const response = await apiServices.createCheckoutSession(sessionData);
        console.log('Checkout session response:', response);
        if (response && response.session && response.session.url) {
          window.location.href = response.session.url;
        } else {
          toast.error("Failed to get checkout session URL.");
        }
      } catch (error) {
        toast.error("Error fetching checkout session.");
      }
    }
    

  return (
   <>
     {/* Header */}
         <div className="mb-8">
           <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
           { innerCartData.numOfCartItems>0 && <p className="text-muted-foreground">
             {innerCartData.numOfCartItems} item
             {innerCartData.numOfCartItems > 1 ? "s" : ""} in your cart
           </p>}
         </div>
   
       {innerCartData.numOfCartItems>0 ? ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Cart Items */}
           <div className="lg:col-span-2">
             <div className="space-y-4">
               {innerCartData.data.products.map((item) =>(
                 <CartProduct key={item._id} handleRemoveCartItem={handleRemoveCartItem} item={item}
                 handleUpdateProductCartCount={handleUpdateProductCartCount}
                 />)
                 )}
             </div>
   
             {/* Clear Cart */}
             <div className="mt-6">
               <Button onClick={handleClearCart} variant="outline" className="text-red-600">
                 <Trash2 className="h-4 w-4 mr-2" />
                 Clear Cart
               </Button>
             </div>
           </div>
   
           {/* Order Summary */}
           <div className="lg:col-span-1">
             <div className="border rounded-lg p-6 sticky top-40">
               <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
   
               <div className="space-y-2 mb-4">
                 <div className="flex justify-between">
                   <span>Subtotal ({innerCartData.numOfCartItems} items)</span>
                   <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Shipping</span>
                   <span className="text-green-600">Free</span>
                 </div>
               </div>
   
               <Separator className="my-4" />
   
               <div className="flex justify-between font-semibold text-lg mb-6">
                 <span>Total</span>
                 <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
               </div>
   
               <Button className="w-full bg-black text-white" size="lg" onClick={() => setShowAddressModal(true)}>
                 Proceed to Checkout
               </Button>
   
               <Button variant="outline" className="w-full mt-2" asChild>
                 <Link href="/products">Continue Shopping</Link>
               </Button>
             </div>
           </div>
         </div>
         
                ):(
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">No Products in your cart</h2>
                        <Button variant="outline" className="w-fit  mt-2" asChild>
                 <Link href="/products">Add Products to your Cart</Link>
               </Button>
                    </div>
                )}

                {showAddressModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
                      <h2 className="text-xl font-semibold mb-4">Select Shipping Address</h2>
                      {showAddForm ? (
                        <>
                          <AddressForm onClose={() => setShowAddForm(false)} />
                          <Button variant="outline" className="mt-4" onClick={() => setShowAddForm(false)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <AddressList selectedAddressId={selectedAddressId} onSelect={setSelectedAddressId} />
                          <div className="flex justify-between mt-4">
                            <Button onClick={() => setShowAddForm(true)}>Add New Address</Button>
                            <Button onClick={() => fetchCheckoutSession()} disabled={!selectedAddressId}>
                              Confirm
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {showCheckout && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
                      <h2 className="text-xl font-semibold mb-4">Checkout</h2>
                      <iframe
                        src={checkoutUrl}
                        className="w-full h-[600px]"
                        title="Checkout Session"
                      />
                    </div>
                  </div>
                )}
   </>
  )
}
