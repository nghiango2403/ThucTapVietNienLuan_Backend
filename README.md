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
    ````json
    {
      "TenDangNhap":"vdTenDangNhap",
      "MatKhau": 2
    } ```
    ````
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
    ````json
    {
    "MatKhauCu":"vd",
    "MatKhauMoi":"vd"
    }```
    ````

- **Lấy thông tin tài khoản**
  - Method: `GET`
  - Endpoint: `/laythongtintaikhoan`
  - Response:
    ````json
    {
    "HoTen":"Ngô Hữu Nghĩa",
    "SDT":"0811111111",
    "Email":"Nghia@gmail.com",
    "NgaySinh":2004-03-24T00:00:00.000+00:00,
    "DiaChi":"Huế",
    "GioiTinh":"1"
    }```
    ````
- **Đổi thông tin tài khoản**
  - Method: `PUT`
  - Endpoint: `/laythongtintaikhoan`
  - Body:
    ````json
    {
    "HoTen":"Ngô Hữu Nghĩa",
    "SDT":"0811111111",
    "Email":"Nghia@gmail.com",
    "NgaySinh":2004-03-24T00:00:00.000+00:00,
    "DiaChi":"Huế",
    "GioiTinh":"1"
    }```
    ````
