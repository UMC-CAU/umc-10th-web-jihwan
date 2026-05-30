// slices/cartSlice
import type { CartItems } from "../types/cart";
import cartItems from "../constant/cartitems";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
    cartItems: CartItems;
    amount: number;
    total: number;
}

const initialState: CartState = {
    cartItems: cartItems,
    amount: 0,
    total: 0,
}


// cartSlice 생성
// createSLice -> reduxToolkit에서 제공
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        //증가
        increase: (state, action: PayloadAction<{id: string}>) => {
            const itemId = action.payload.id;
            //이 아이디를 통해서 내가 클릭한 음반을 찾기
            const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
            if (item){
                item.amount += 1;
            }
        },
        //감소
        decrease: (state, action: PayloadAction<{id: string}>) => {
            const itemId = action.payload.id;
            //이 아이디를 통해서 내가 클릭한 음반을 찾기
            const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
            if (item){
                item.amount -= 1;
            }
        },

        //삭제
        removeItem: (state, action: PayloadAction<{id: string}>) => {
            const itemId = action.payload.id;
            state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== itemId);
        },

        //장바구니 비우기
        clearCart: (state) => {
            state.cartItems = [];
        },

        //총 가격과 수량 계산
        calculateTotals: (state) => {
            let amount =0;
            let total = 0;

            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.amount * item.price;
            });

            state.amount = amount;
            state.total = total;
        }
    },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;

const cartReducer = cartSlice.reducer;

export default cartReducer;