import { toast, ToastOptions } from 'react-toastify';

// Cấu hình chung cho tất cả toast (có thể bỏ qua nếu đã cấu hình trong ToastContainer)
const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
};

const toastService = {
    success: (message: string) => {
        toast.success(message, toastOptions);
    },
    error: (message: string) => {
        toast.error(message, toastOptions);
    },
    warn: (message: string) => {
        toast.warn(message, toastOptions);
    },
    info: (message: string) => {
        toast.info(message, toastOptions);
    },
};

export default toastService;