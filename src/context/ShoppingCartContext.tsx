import { createContext, ReactNode, useContext, useReducer } from "react";
import { useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number 
    quantity: number
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void 
    getItemQuantity: (id: number ) => number
    increaseCartQuantity: (id: number ) => void
    decreaseCartQuantity: (id: number ) => void
    removeFromCart: (id: number ) => void
    cartQuantity: number
    cartItems: cartItem[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}



export function ShoppingCartProvider({children}:
    ShoppingCartProviderProps) {
        const [isOpen, setIsOpen] = useState(false)
        const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[])

        const cartQuantity = cartItems.reduce(
            (quantity, item) => item.quantity + quantity, 0)
        
        const openCart = () => setIsOpen(true)
        const closeCart = () => setIsOpen(false)

        function getItemQuantity(id: number){
            return cartItems.find(item => item.id === id)?.quantity || 0
        }
        function increaseCartQuantity(id: number){
            // if we can find an items inside of our cart, then we have an item, so we want to check to see if we dont have an item, because 
            // if our item doesn't already exist in the cart, then we need to add it to cart.
            setCartItems(currItems => {
                if (currItems.find(item => item.id === id) == null){
                    return [...currItems, {id, quantity: 1}] // return all of our current items and we can add in a new item which has an id and a quantity of 1
                } else { // otherwise, if the item exists, all we need to do is increment the quantity by 1
                    return currItems.map(item => {
                        if (item.id === id) { // if we found our item
                            return {...item, quantity: item.quantity + 1} // keep everything the same and increment quantity by 1
                        } else {
                            return item 
                        }
                    })
                }
            })
        }
        function decreaseCartQuantity(id: number){
          
            setCartItems(currItems => {
                if (currItems.find(item => item.id === id)?.quantity === 1){ // if the quantity in our cart is 1, get rid of it
                    return currItems.filter(item => item.id !== id) // this will return a new list of all our items and all of them are going to be exactly the same but whichever one we pass the id of in the function param, we're going to remove that from our list of items. and if we pass the id of an item that doesnt exist, this is still just going to return us the current list so it doesnt matter 

                } else { // otherwise, if the item exists, all we need to do is increment the quantity by 1
                    return currItems.map(item => {
                        if (item.id === id) { // if we found our item
                            return {...item, quantity: item.quantity - 1} // keep everything the same and increment quantity by 1
                        } else {
                            return item 
                        }
                    })
                }
            })
        }
        function removeFromCart(id:number){
            setCartItems(currItems => {
                return currItems.filter(item => item.id !== id) // all we are doing is filtering out items where the id does not equal our current item id
            })
        }

    return (
    <ShoppingCartContext.Provider value={{getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, openCart, closeCart, cartItems, cartQuantity}}>
        {children}
        <ShoppingCart isOpen={isOpen}/>
    </ShoppingCartContext.Provider>
    )
}