# 💬 Chatify

Chatify là ứng dụng nhắn tin thời gian thực (real-time chat) được xây dựng với kiến trúc monorepo gồm **backend** (Node.js + Express) và **frontend** (React + Vite + TypeScript). Ứng dụng hỗ trợ chat trực tiếp, chat nhóm, gửi ảnh, trạng thái online/offline, chỉnh sửa hồ sơ cá nhân và giao diện responsive hiện đại.

---

## ✨ Tính năng

- 🔐 **Xác thực & phân quyền**
  - Đăng ký, đăng nhập bằng username/email.
  - JWT access token + refresh token (lưu trong HTTP-only cookie).
  - Tự động refresh token khi hết hạn.

- 💬 **Nhắn tin thời gian thực**
  - Chat 1-1 và chat nhóm qua Socket.IO.
  - Gửi emoji 🎉 và gửi ảnh 📷 (upload lên Cloudinary).
  - Trạng thái tin nhắn `delivered` / `seen`.
  - Infinite scroll lịch sử tin nhắn.

- 👥 **Bạn bè & nhóm**
  - Gửi / chấp nhận / từ chối lời mời kết bạn.
  - Tạo nhóm chat, thêm bạn bè vào nhóm.

- 👤 **Hồ sơ cá nhân**
  - Upload / thay đổi ảnh đại diện.
  - Hiển thị đầy đủ thông tin người dùng (username, email, số điện thoại, bio, ngày tham gia).
  - Trạng thái online/offline theo thời gian thực.

- 🎨 **Giao diện**
  - Responsive trên desktop, tablet và mobile.
  - Dark mode / Light mode.
  - Skeleton loading cho sidebar và khung chat.

---

## 🧰 Công nghệ sử dụng

### Backend

| Công nghệ | Mô tả |
|-----------|--------------|
| [Node.js](https://nodejs.org) + [Express](https://expressjs.com) | API server |
| [Socket.IO](https://socket.io) | Giao tiếp thời gian thực |
| [MongoDB](https://www.mongodb.com) + [Mongoose](https://mongoosejs.com) | Cơ sở dữ liệu |
| [JWT](https://jwt.io) | Xác thực người dùng |
| [Cloudinary](https://cloudinary.com) | Lưu trữ ảnh (avatar, ảnh tin nhắn) |
| [Multer](https://github.com/expressjs/multer) | Xử lý upload file |
| [Swagger UI](https://swagger.io) | Tài liệu API |

### Frontend

| Công nghệ | Mô tả |
|-----------|--------------|
| [React](https://react.dev) + [Vite](https://vitejs.dev) | Giao diện người dùng |
| [TypeScript](https://www.typescriptlang.org) | Kiểu dữ liệu tĩnh |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [shadcn/ui](https://ui.shadcn.com) | Hệ thống component UI |
| [Zustand](https://zustand-demo.pmnd.rs) | Quản lý state |
| [Axios](https://axios-http.com) | HTTP client |
| [emoji-picker-react](https://www.npmjs.com/package/emoji-picker-react) | Chọn emoji |

---

## 📁 Cấu trúc dự án

```
Chatify/
├── backend/
│   └── src/
│       ├── controllers/     # Xử lý logic nghiệp vụ
│       ├── libs/            # Kết nối cơ sở dữ liệu
│       ├── middlewares/     # Auth, upload, friendship...
│       ├── models/          # Mongoose models
│       ├── routes/          # Định nghĩa API routes
│       ├── socket/          # Cấu hình Socket.IO
│       ├── utils/           # Helper functions
│       ├── swagger.json     # Tài liệu Swagger
│       └── server.js        # Điểm khởi chạy server
├── frontend/
│   └── src/
│       ├── components/      # React components
│       │   ├── auth/
│       │   ├── chat/
│       │   ├── Profile/
│       │   ├── sidebar/
│       │   └── ui/
│       ├── lib/             # Axios config, utils
│       ├── pages/           # Các trang
│       ├── services/        # Gọi API
│       ├── stores/          # Zustand stores
│       └── types/           # TypeScript types
└── README.md
```

---

## 🚀 Cài đặt & chạy

### Yêu cầu

- Node.js ≥ 18
- npm ≥ 9
- MongoDB (local hoặc Atlas)
- Tài khoản Cloudinary

### 1. Clone repository

```bash
git clone https://github.com/Hieukobtcode/Chatify.git
cd Chatify
```

### 2. Cài đặt backend

```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example` và điền các biến môi trường:

```bash
cp .env.example .env
```

Chạy server (chế độ development):

```bash
npm run dev
```

Server mặc định chạy tại: `http://localhost:5001`

### 3. Cài đặt frontend

```bash
cd ../frontend
npm install
```

Cấu hình biến môi trường (đã có sẵn file `.env.development` và `.env.production`):

```
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001/
```

Chạy frontend (chế độ development):

```bash
npm run dev
```

Frontend mặc định chạy tại: `http://localhost:5173`

---

## 🔧 Biến môi trường

### Backend (`backend/.env`)

| Biến | Mô tả |
|------|--------------|
| `PORT` | Cổng chạy backend (mặc định `5001`) |
| `MONGO_URI` | Chuỗi kết nối MongoDB |
| `CLIENT_URL` | URL của frontend (cho CORS) |
| `ACCESS_TOKEN_SECRET` | Secret dùng để ký access token |
| `CLOUDINARY_CLOUD_NAME` | Cloud name từ Cloudinary |
| `CLOUDINARY_API_KEY` | API key từ Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret từ Cloudinary |

---

## 📚 API Endpoints

Tài liệu Swagger có sẵn tại: `http://localhost:5001/api-docs`

### Auth

| Method | Endpoint | Mô tả |
|--------|----------|--------------|
| POST | `/api/auth/signup` | Đăng ký tài khoản |
| POST | `/api/auth/signin` | Đăng nhập |
| POST | `/api/auth/signout` | Đăng xuất |
| POST | `/api/auth/refresh` | Làm mới access token |

### Users

| Method | Endpoint | Mô tả |
|--------|----------|--------------|
| GET | `/api/users/me` | Lấy thông tin người dùng hiện tại |
| GET | `/api/users/search?username=` | Tìm kiếm người dùng |
| POST | `/api/users/uploadAvatar` | Upload ảnh đại diện |

### Friends

| Method | Endpoint | Mô tả |
|--------|----------|--------------|
| GET | `/api/friends` | Lấy danh sách bạn bè |
| GET | `/api/friends/requests` | Lấy danh sách lời mời kết bạn |
| POST | `/api/friends/requests` | Gửi lời mời kết bạn |
| POST | `/api/friends/requests/:requestId/accept` | Chấp nhận lời mời |
| POST | `/api/friends/requests/:requestId/decline` | Từ chối lời mời |

### Conversations

| Method | Endpoint | Mô tả |
|--------|----------|--------------|
| POST | `/api/conversations` | Tạo cuộc trò chuyện |
| GET | `/api/conversations` | Lấy danh sách cuộc trò chuyện |
| GET | `/api/conversations/:conversationId/messages` | Lấy tin nhắn (có phân trang) |
| PATCH | `/api/conversations/:conversationId/seen` | Đánh dấu đã đọc |

### Messages

| Method | Endpoint | Mô tả |
|--------|----------|--------------|
| POST | `/api/messages/direct` | Gửi tin nhắn trực tiếp |
| POST | `/api/messages/group` | Gửi tin nhắn nhóm |
| POST | `/api/messages/upload` | Upload ảnh tin nhắn |

---

## 🔌 Socket.IO Events

### Client → Server

| Event | Mô tả |
|-------|--------------|
| `join-conversation` | Tham gia room của cuộc trò chuyện |

### Server → Client

| Event | Mô tả |
|-------|--------------|
| `online-users` | Danh sách userId đang online |
| `new-message` | Có tin nhắn mới |
| `read-message` | Tin nhắn đã được đọc |
| `new-group` | Có cuộc trò chuyện / nhóm mới |

---

## 🛠️ Scripts

### Backend

```bash
npm run dev      # Chạy server với nodemon (auto-restart)
npm run start    # Chạy server với node
```

### Frontend

```bash
npm run dev      # Chạy dev server Vite
npm run build    # Build production (tsc + vite build)
npm run lint     # Chạy ESLint
npm run preview  # Xem trước bản build
```

---

## 📄 License

Dự án được phát hành theo giấy phép **ISC**.