/**
 * File: script.js
 * Mô tả: Xử lý sự kiện gửi form liên hệ trên trang web.
 * Do không có server backend, chức năng này sẽ mô phỏng việc gửi thành công
 * bằng cách hiển thị một thông báo trên giao diện người dùng (UI).
 */

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const statusMessage = document.getElementById("status-message");
  const submitButton = document.getElementById("submit-button");

  // Hàm hiển thị thông báo
  function showStatus(message, type = "success") {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`; // Thêm class type (success/error/loading)
  }

  // Xử lý sự kiện khi form được gửi
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      // Ngăn chặn hành vi gửi form mặc định (tải lại trang)
      event.preventDefault();

      // 1. Hiển thị trạng thái đang tải
      showStatus("Đang gửi yêu cầu... Vui lòng chờ.", "loading");
      submitButton.disabled = true; // Vô hiệu hóa nút gửi

      // 2. Mô phỏng quá trình gửi (ví dụ: mất 1.5 giây)
      setTimeout(() => {
        // 3. Hiển thị thông báo thành công
        showStatus(
          "✅ Yêu cầu của bạn đã được gửi thành công! Sĩ Triết sẽ liên hệ lại trong vòng 24 giờ. Cảm ơn bạn.",
          "success"
        );

        // 4. Xóa nội dung form sau khi gửi
        contactForm.reset();
        submitButton.disabled = false; // Kích hoạt lại nút gửi
      }, 1500); // 1.5 giây mô phỏng độ trễ mạng
    });
  }

  // Thêm style cho khung thông báo (có thể đặt trong CSS, nhưng đặt ở đây cho tiện)
  const style = document.createElement("style");
  style.textContent = `
        .status-message {
            margin-top: 30px;
            padding: 15px;
            border-radius: 4px;
            text-align: center;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.5s ease;
            color: var(--color-primary-dark);
            font-family: var(--font-heading);
        }
        
        .status-message.success {
            background-color: var(--color-secondary-accent); /* Xanh Cyan */
            opacity: 1;
        }

        .status-message.error {
            background-color: #ff6464; /* Đỏ */
            opacity: 1;
        }
        
        .status-message.loading {
            background-color: #ffd700; /* Vàng */
            color: var(--color-primary-dark);
            opacity: 1;
        }

        .status-message.hidden {
            display: none;
        }
    `;
  document.head.appendChild(style);
});
