import { useDispatch } from "../hooks/useCustomRedux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/cartSlice";
import { useCartActions } from "../hooks/useCartStore";

const Modal = () => {
  const dispatch = useDispatch();
  const {clearCart} = useCartActions();

  return (
    <aside className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg text-center max-w-sm w-full mx-4">
        <h4 className="text-xl font-bold mb-6 text-black">정말 삭제하시겠습니까?</h4>
        <div className="flex justify-around">
          <button
            onClick={() => {
              clearCart();
              dispatch(closeModal());
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            네
          </button>
          <button
            onClick={() => dispatch(closeModal())}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            아니요
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Modal;
