"use client"

import { apiServices } from "@/services/api";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";

type CartContextType={
    cartCount?:number;
    setCartCount?: Dispatch<SetStateAction<number>>;
     handleAddToCart?:(productId: string, setAddToCartLoading: any)=> Promise<void> 

}



export const cartContext= createContext<CartContextType>(
    {}
)

export default function CartContextProvider({children}:{children:ReactNode}){

    const [cartCount, setCartCount] = useState(0)

    async function getCart() {
        const response= await apiServices.getUserCart()
        setCartCount(response.numOfCartItems)
        
    }


async function handleAddToCart(productId:string, setAddToCartLoading:any){
  setAddToCartLoading(true)

    const data= await apiServices.addProductToCart(productId);
    setCartCount(data.numOfCartItems);
    toast.success(data.message)
    setAddToCartLoading(false)
  }

    useEffect(()=>{
        getCart()
    },[])

    return <cartContext.Provider value={{cartCount, setCartCount,handleAddToCart}}>
        {children}
    </cartContext.Provider>
}