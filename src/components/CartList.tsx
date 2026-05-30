
import CartItem from './Cartitem';
import type { RootState } from '../store/store';
import { useSelector } from '../hooks/useCustomRedux';
import { useCartActions, useCartInfo, useCartStore } from '../hooks/useCartStore';
import { calculateTotals } from '../slices/cartSlice';
import { useEffect } from 'react';

const CartList = () => {
    const {cartItems} = useCartInfo();
    const {calculateTotals} = useCartActions();

    useEffect(()=> {
        calculateTotals();
    }, [cartItems, calculateTotals])

    return (
        <div className='flex flex-col items-center justify-center'>
            <ul>
                {cartItems.map((item) => (
                    <CartItem key={item.id} lp={item} />
                ))}
            </ul>
        </div>
    );
};

export default CartList;