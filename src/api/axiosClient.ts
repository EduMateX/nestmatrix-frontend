import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // Quan trọng: Cho phép gửi và nhận cookie
});

// Cấu hình interceptor để tự động refresh token khi cần
axiosClient.interceptors.response.use(
    (response) => response, // Trả về response nếu thành công
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi là 401 (Unauthorized) và chưa từng thử lại request này
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu là đã thử lại để tránh lặp vô hạn

            try {
                // Gọi API để lấy accessToken mới bằng refreshToken (đã được lưu trong cookie)
                await axiosClient.post('/auth/refreshtoken');

                // Sau khi có token mới (được server tự set vào cookie), thực hiện lại request ban đầu
                return axiosClient(originalRequest);
            } catch (refreshError) {
                // Nếu refresh token thất bại (hết hạn, không hợp lệ), chuyển hướng người dùng về trang đăng nhập
                // Hoặc dispatch action logout
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Trả về lỗi nếu không phải lỗi 401 hoặc đã thử lại
        return Promise.reject(error);
    }
);

export default axiosClient;