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
