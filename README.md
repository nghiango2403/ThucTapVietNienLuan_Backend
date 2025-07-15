## 📌 Cách dùng

### 📂 Chức vụ

- **Thêm**

  - Method: `POST`
  - Endpoint: `/themchucvu`
  - Body:
    ```json
    {
      "TenChucVu": "Nhân viên"
    }
    ```

- **Xem**

  - Method: `GET`
  - Endpoint: `/laychucvu`

- **Xoá**
  - Method: `DELETE`
  - Endpoint: `/xoachucvu/:id`
  - Params:
    - `id`: ID của chức vụ cần xoá

### 📂 Quản lý hệ thống

- **Đăng nhập**

  - Method: `POST`
  - Endpoint: `/dangnhap`
  - Body:
    ```json
    {
      "TenDangNhap": "vdTenDangNhap",
      "MatKhau": 2
    }
    ```
  - Response:
    ```json
    {
      "status": 200,
      "message": "Đăng nhập thành công",
      "data": {
        "accessToken": "access token",
        "refreshToken": "refresh Token",
        "ThongTin": {
          "TenDangNhap": "vdTenDangNhap",
          "HoTen": "vdHoTen",
          "ChucVu": "vdTenChucVu",
          "MaChucVu": "vdMaChucVu",
          "MaNhanSu": "vdMaNhanSu"
        }
      }
    }
    ```

- **Đổi mật khẩu**

  - Method: `POST`
  - Endpoint: `/doimatkhau`
  - Body:
    ```json
    {
      "MatKhauCu": "vd",
      "MatKhauMoi": "vd"
    }
    ```

- **Lấy thông tin tài khoản**
  - Method: `GET`
  - Endpoint: `/laythongtintaikhoan`
  - Response:
    ```json
    {
      "HoTen": "Ngô Hữu Nghĩa",
      "SDT": "0811111111",
      "Email": "Nghia@gmail.com",
      "NgaySinh": "2004-03-24T00:00:00.000+00:00",
      "DiaChi": "Huế",
      "GioiTinh": "1"
    }
    ```
- **Đổi thông tin tài khoản**
  - Method: `PUT`
  - Endpoint: `/laythongtintaikhoan`
  - Body:
    ```json
    {
      "HoTen": "Ngô Hữu Nghĩa",
      "SDT": "0811111111",
      "Email": "Nghia@gmail.com",
      "NgaySinh": "2004-03-24T00:00:00.000+00:00",
      "DiaChi": "Huế",
      "GioiTinh": "1"
    }
    ```

### 📂 Quản lý nhân viên

- **Thêm nhân viên**

  - Method: `POST`
  - Endpoint: `/themnhanvien`
  - Body:
    ```json
    {
      "HoTen": "vd",
      "SDT": "0811111111",
      "Email": "test@gmail.com",
      "NgaySinh": "2004-03-24",
      "DiaChi": "Huế",
      "GioiTinh": 1,
      "MatKhau": "3",
      "MaChucVu": "vd"
    }
    ```

- **Tìm nhân viên**

  - Method: `GET`
  - Endpoint: `/timnhanvien`
  - Query:
    ```json
    {
      "TenNhanVien": "vd"
    }
    ```
  - Response:
    ```json
    {
      "status": 200,
      "message": "Lấy thông tin nhân viên",
      "data": [
        {
          "_id": "68748fcdc9378bed0b0bebf1",
          "TenDangNhap": "TK00002",
          "MaNhanSu": {
            "_id": "68748fcdc9378bed0b0bebee",
            "HoTen": "test",
            "SDT": "0811111111",
            "Email": "Test@gmail.com",
            "NgaySinh": "2004-03-24T00:00:00.000Z",
            "DiaChi": "Huế",
            "GioiTinh": "0",
            "__v": 0
          },
          "MaChucVu": {
            "_id": "68745f838663f5155bc95083",
            "TenChucVu": "Nhân viên",
            "__v": 0
          },
          "KichHoat": true
        }
      ]
    }
    ```

- **Lấy danh sách nhân viên**
  - Method: `GET`
  - Endpoint: `/laydanhsachnhanvien`
  - Response:
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách nhân viên",
      "data": [
        {
          "_id": "68746fb3cf43514aaadeafea",
          "TenDangNhap": "TK00001",
          "MaNhanSu": {
            "_id": "68746fb2cf43514aaadeafe7",
            "HoTen": "Ngô Hữu Nghĩa",
            "GioiTinh": "1"
          },
          "MaChucVu": {
            "_id": "68745f9b8663f5155bc95085",
            "TenChucVu": "Quản lý",
            "__v": 0
          },
          "KichHoat": true
        }
      ]
    }
    ```
- **Lấy thông tin chi tiết của nhân viên**
  - Method: `GET`
  - Endpoint: `/laythongtinchitietcuanhanvien`
  - Query:
    ```json
    {
      "MaTaiKhoan": "vd"
    }
    ```
  - Response:
    ```json
    {
      "status": 200,
      "message": "Lấy thống tin chi tiết nhân viên thành công",
      "data": {
        "_id": "68748fcdc9378bed0b0bebf1",
        "TenDangNhap": "TK00002",
        "MaNhanSu": {
          "_id": "68748fcdc9378bed0b0bebee",
          "HoTen": "test",
          "SDT": "0811111111",
          "Email": "Test@gmail.com",
          "NgaySinh": "2004-03-24T00:00:00.000Z",
          "DiaChi": "Huế",
          "GioiTinh": "0",
          "__v": 0
        },
        "MaChucVu": {
          "_id": "68745f838663f5155bc95083",
          "TenChucVu": "Nhân viên",
          "__v": 0
        },
        "KichHoat": true
      }
    }
    ```
- **Đổi thông tin của nhân viên**
  - Method: `PUT`
  - Endpoint: `/doithongtinnhanvien`
  - Query:
    ```json
    {
      "MaNhanSu": "vd",
      "HoTen": "vd",
      "SDT": "vd",
      "Email": "vd",
      "NgaySinh": "vd",
      "DiaChi": "vd",
      "GioiTinh": "vd"
    }
    ```
- **Đổi mật khẩu của nhân viên**

  - Method: `PUT`
  - Endpoint: `/doimatkhaunhanvien`
  - Query:

    ```json
    {
      "MaTaiKhoan": "a",
      "MatKhau": "a"
    }
    ```

- **Đổi chức vụ của nhân viên**

  - Method: `PUT`
  - Endpoint: `/doimatkhaunhanvien`
  - Query:

    ```json
    {
      "MaTaiKhoan": "a",
      "MaChucVu": "a"
    }
    ```

- **Mở/Khoá tài khoản của nhân viên của nhân viên**

  - Method: `PUT`
  - Endpoint: `/mohoackhoataikhoan`
  - Query:

    ```json
    {
      "MaTaiKhoan": "a"
    }
    ```
