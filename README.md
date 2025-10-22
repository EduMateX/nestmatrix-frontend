# NestMatrix Admin Web

[![React Version](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-yellowgreen.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC.svg)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**NestMatrix Admin** là giao diện quản trị mạnh mẽ dành cho chủ trọ, được xây dựng để tương tác với **NestMatrix API**. Ứng dụng cung cấp một bộ công cụ đầy đủ để quản lý tòa nhà, phòng, khách thuê, hợp đồng và các hoạt động kinh doanh cho thuê một cách hiệu quả và trực quan.

## Mục lục

- [Tổng quan Tính năng](#tổng-quan-tính-năng)
- [Kiến trúc & Công nghệ](#kiến-trúc--công-nghệ)
- [Thiết lập & Cài đặt Môi trường](#thiết-lập--cài-đặt-môi-trường)
- [Cấu trúc Thư mục](#cấu-trúc-thư-mục)
- [Biến môi trường](#biến-môi-trường)
- [Hướng dẫn Chạy Dự án](#hướng-dẫn-chạy-dự-án)

## Tổng quan Tính năng

- **📈 Dashboard Trực quan:** Hiển thị các số liệu kinh doanh quan trọng, biểu đồ doanh thu, và các danh sách hành động nhanh.
- **🔑 Xác thực An toàn:** Luồng đăng nhập, đăng xuất bảo mật, tự động duy trì phiên đăng nhập.
- **🏢 Quản lý Tài sản (CRUD):** Giao diện quản lý toàn diện cho Tòa nhà và Phòng, hỗ trợ upload ảnh.
- **👥 Quản lý Khách thuê:** Quản lý thông tin khách thuê, tự động tạo tài khoản.
- **📄 Quản lý Hợp đồng Nâng cao:**
  - Quy trình từ tạo bản nháp, gửi đi ký, đến kích hoạt.
  - Hiển thị chi tiết hợp đồng, quản lý file PDF, duyệt chữ ký số từ khách hàng.
  - Quy trình yêu cầu và xác nhận chấm dứt hợp đồng.
- **⚡ Quản lý Điện & Nước:** Giao diện ghi chỉ số, tự động tạo hóa đơn và xem lịch sử.
- **🧾 Quản lý Hóa đơn & Thanh toán:** Giao diện xem danh sách hóa đơn với bộ lọc mạnh mẽ, xem chi tiết và xác nhận thanh toán.
- **🚨 Quản lý Sự cố & Yêu cầu:** Trung tâm tiếp nhận và xử lý các sự cố, yêu cầu từ khách thuê.
- **⚙️ Cấu hình Hệ thống:** Giao diện cho phép admin tự tùy chỉnh các tham số vận hành.
- **🔔 Thông báo Real-time:** Nhận thông báo tức thì qua WebSocket.
- **🚀 Trải nghiệm người dùng:** Phân trang, tìm kiếm, lọc động và skeleton loading trên tất cả các trang danh sách.

## Kiến trúc & Công nghệ

Dự án tuân thủ các thực hành tốt nhất trong phát triển frontend hiện đại.

- **Framework & Ngôn ngữ:** React 18, TypeScript, Vite.
- **Quản lý State:** Redux Toolkit với kiến trúc module hóa (feature-based).
- **Giao diện & Styling:** Component tự xây dựng trên nền tảng Tailwind CSS 3.x, Headless UI (cho logic), `react-pdf` (hiển thị PDF), `mammoth.js` (hiển thị DOCX).
- **Routing:** React Router DOM v6.
- **Form & Validation:** React Hook Form & Zod.
- **Gọi API:** Axios, với interceptor để xử lý refresh token tự động.
- **Real-time:** WebSocket API gốc của trình duyệt.

## Thiết lập & Cài đặt Môi trường

### Yêu cầu

1. Node.js v18 trở lên
2. `npm` hoặc `pnpm` (khuyến khích `pnpm`)

src/
├── api/ # Cấu hình Axios và interceptor
├── components/ # Các component React
│ └── shared/ # Component tái sử dụng (Button, DataTable, Modal...)
├── config/ # Các file cấu hình tĩnh (menu, breadcrumb...)
├── context/ # React Context (WebSocket, Toast, Breadcrumb)
├── hooks/ # Các custom hooks (useDebounce...)
├── layouts/ # Layout chính của ứng dụng (AdminLayout, AuthLayout)
├── lib/ # Các hàm tiện ích (utils, toast service)
├── pages/ # Các trang (views) của ứng dụng
├── router/ # Cấu hình routing (đã tích hợp trong App.tsx)
├── store/ # Redux Toolkit: state management
│ ├── auth/ # Module cho xác thực
│ ├── buildings/ # Module cho tòa nhà
│ └── ... # Các module khác
└── types/ # Định nghĩa kiểu dữ liệu TypeScript chung
