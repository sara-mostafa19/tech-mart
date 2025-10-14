import { AddToCartResponse, GetUserCartResponse } from '@/interfaces/cart';
import { SingleProductResponse, BrandsResponse, CategoriesResponse } from './../types/responses';
import { ProductsResponse } from "@/types/responses";



// const baseUrl=process.env.NEXT_PUBLIC_API_BASE_URL;


class ApiServices{
    #baseUrl:string=process.env.NEXT_PUBLIC_API_BASE_URL!; 

    async getAllProducts():Promise<ProductsResponse>{
            return await fetch(
               this.#baseUrl+ "/api/v1/products/"
            ).then(res => res.json());

    }

    async getAllBrands():Promise<BrandsResponse>{
        return await fetch(
           this.#baseUrl+ "/api/v1/brands/"
        ).then(res => res.json());

    }

    async getAllCategories():Promise<CategoriesResponse>{
        return await fetch(
           this.#baseUrl+ "/api/v1/categories/"
        ).then(res => res.json());

    }

    async getProductDetails(productId:string | string[]):Promise<SingleProductResponse>{
        return await fetch( this.#baseUrl+"/api/v1/products/"+productId

        ).then(res => res.json());


    }


    #getHeaders(){
        return{
             "Content-Type":"application/json",
                token: process.env.NEXT_PUBLIC_API_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGQ3OWFiMWNiYzBiMDg3NWIxYTZiYyIsIm5hbWUiOiJqb3VkeSBtb3N0YWZhIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTk0MTAyMTYsImV4cCI6MTc2NzE4NjIxNn0.k1g_L_buhxHXO5LlPiRHk55XasaAQ25tNnx26DR77hM"
        }
    }
    async addProductToCart(productId:string):Promise<AddToCartResponse>{
        return await fetch(this.#baseUrl + "/api/v1/cart",{
            method:'post',
            body:JSON.stringify({
                productId
            }),
            headers:this.#getHeaders()
        }).then(res=> res.json())
    }

    async getUserCart():Promise<GetUserCartResponse>{
        return  await fetch(this.#baseUrl + "/api/v1/cart" , {
            headers:this.#getHeaders()
        }).then(res => res.json())

    }

    async removeCartProduct(productId:string):Promise<any>{
        return await fetch(this.#baseUrl + "/api/v1/cart/" + productId, {
            headers: this.#getHeaders(),
            method:"delete"
        }).then(res => res.json())
    }
     async clearCart():Promise<any>{
        return await fetch(this.#baseUrl + "/api/v1/cart/" , {
            headers: this.#getHeaders(),
            method:"delete"
        }).then(res => res.json())
    }

    async updateCartProductCount(productId:string, count:number):Promise<any>{
        return await fetch(this.#baseUrl + "/api/v1/cart/" + productId, {
            method:"put",
            body:JSON.stringify({
                count
            }),
            headers:this.#getHeaders()
        }).then(res=> res.json())

    }

    async getUserAddresses(): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/user/addresses", {
            headers: this.#getHeaders(),
        }).then(res => res.json());
    }

    async addUserAddress(address: any): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/user/addresses", {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify(address),
        }).then(res => res.json());
    }

    async removeUserAddress(addressId: string): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/user/addresses/" + addressId, {
            method: "DELETE",
            headers: this.#getHeaders(),
        }).then(res => res.json());
    }
    async createCashOrder(orderData: any): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/orders/cash", {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify(orderData),
        }).then(res => res.json());
    }

    async getAllOrders(): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/orders", {
            headers: this.#getHeaders(),
        }).then(res => res.json());
    }

    async getUserOrders(): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/orders/user", {
            headers: this.#getHeaders(),
        }).then(res => res.json());
    }

    async createCheckoutSession(sessionData: any): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/orders/checkout-session/" + sessionData.cartId, {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify({ addressId: sessionData.addressId, amount: sessionData.amount }),
        }).then(res => res.json());
    }

    async addToWishlist(productId: string): Promise<any> {
        const res = await fetch(this.#baseUrl + "/api/v1/wishlist", {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify({ productId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to add to wishlist');
        return data;
    }

    async removeFromWishlist(productId: string): Promise<any> {
        const res = await fetch(this.#baseUrl + "/api/v1/wishlist/" + productId, {
            method: "DELETE",
            headers: this.#getHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to remove from wishlist');
        return data;
    }

    async getUserWishlist(): Promise<any> {
        const res = await fetch(this.#baseUrl + "/api/v1/wishlist", {
            headers: this.#getHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to get wishlist');
        return data;
    }

    async signup(userData: any): Promise<any> {
        const res = await fetch(this.#baseUrl + "/api/v1/auth/signup", {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        return data;
    }

    async forgotPassword(email: string): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: this.#getHeaders()
        }).then(res => res.json());
    }

    async verifyResetCode(email: string, resetCode: string): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/auth/verify-reset-code", {
            method: "POST",
            body: JSON.stringify({ email, resetCode }),
            headers: this.#getHeaders()
        }).then(res => res.json());
    }

    async updateLoggedUserPassword(passwordData: any): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/auth/change-my-password", {
            method: "PUT",
            body: JSON.stringify(passwordData),
            headers: this.#getHeaders()
        }).then(res => res.json());
    }

    async resetPassword(resetData: any): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/auth/reset-password", {
            method: "PUT",
            body: JSON.stringify(resetData),
            headers: this.#getHeaders()
        }).then(res => res.json());
    }

    async updateLoggedUserData(userData: any): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/auth/me", {
            method: "PUT",
            body: JSON.stringify(userData),
            headers: this.#getHeaders()
        }).then(res => res.json());
    }

    async getAllUsers(): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/auth/users", {
            headers: this.#getHeaders()
        }).then(res => res.json());
    }

    async verifyToken(token: string): Promise<any> {
        return await fetch(this.#baseUrl + "/api/v1/auth/verify-token?token=" + token, {
            headers: this.#getHeaders()
        }).then(res => res.json());
    }
    async login(email: string, password: string) {
        const res = await fetch(this.#baseUrl + "/api/v1/auth/signin", {
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "post"
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        return data;
    }
}

 export const apiServices = new ApiServices()
