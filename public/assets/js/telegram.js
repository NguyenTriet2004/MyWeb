/**
 * File: assets/js/telegram_notifier.js
 * Mô tả: Xử lý sự kiện gửi form liên hệ (Contact Form) và gửi thông báo
 * đến Telegram Bot API. Form được gửi trực tiếp từ frontend.
 */

document.addEventListener("DOMContentLoaded", () => {
  // === CẤU HÌNH CÁ NHÂN (ĐÃ CẬP NHẬT CHAT ID CHÍNH XÁC) ===
  const BOT_TOKEN = "8444089828:AAFKPwaRov-ALU1p7CTEgrgCb0yY8sE_5Lk";
  // CHAT_ID: Anh đã điền 5739867711
  const CHAT_ID = "5739867711";
  // ===========================================

  const contactForm = document.getElementById("contact-form");
  const statusMessage = document.getElementById("status-message");

  if (!contactForm) {
    console.error("LỖI: Không tìm thấy form liên hệ.");
    return;
  }

  // CHÚ THÍCH CẬP NHẬT: SỬA LỖI LOGIC. Bỏ điều kiện kiểm tra cũ bị sai.
  // Kiểm tra cấu hình chỉ để xem các biến có bị trống hay không.
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error(
      "LỖI CẤU HÌNH: BOT_TOKEN hoặc CHAT_ID bị trống. Form sẽ không gửi tin nhắn."
    );
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showStatus(
        "❌ Lỗi cấu hình: Vui lòng điền BOT_TOKEN và CHAT_ID chính xác.",
        "error"
      );
      hideStatusAfterDelay(5000);
    });
    return;
  }

  const submitButton = contactForm.querySelector("#submit-button");

  // URL API đã được sửa đúng định dạng
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  // Hàm hiển thị thông báo
  function showStatus(message, type = "success") {
    statusMessage.classList.remove("hidden", "success", "error", "loading");
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.opacity = "1";
  }

  // Ẩn thông báo sau 5 giây
  function hideStatusAfterDelay(delay = 5000) {
    setTimeout(() => {
      statusMessage.style.opacity = "0";
      setTimeout(() => {
        statusMessage.classList.add("hidden");
        statusMessage.textContent = "";
      }, 500); // Đợi transition kết thúc
    }, delay);
  }

  // Xử lý sự kiện khi form được gửi
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    showStatus("Đang gửi yêu cầu và thông báo qua Telegram...", "loading");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Đang xử lý...";
    }

    // Lấy dữ liệu từ form
    const formData = new FormData(contactForm);
    const name = formData.get("name") || "Không có tên";
    const phone = formData.get("phone") || "Không có SĐT";
    const email = formData.get("email") || "Không có email";
    const message = formData.get("message") || "Không có mô tả";

    // Tạo nội dung tin nhắn Markdown
    const textMessage = `
*--- YÊU CẦU BÁO GIÁ MỚI TỪ WEBSITE SĨ TRIẾT ---*

*Người gửi:* ${name}
*SĐT (Zalo):* ${phone}
*Email:* ${email}

*Nội dung chi tiết:*
${message}

*Thời gian:* ${new Date().toLocaleString("vi-VN")}
        `.trim();

    try {
      // Gửi tin nhắn đến Telegram API
      const response = await fetch(TELEGRAM_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: textMessage,
          parse_mode: "Markdown",
        }),
      });

      // Log phản hồi để dễ dàng gỡ lỗi
      const responseData = await response.json();
      console.log("Phản hồi Telegram API:", responseData);

      if (response.ok) {
        showStatus(
          "✅ Yêu cầu đã được gửi thành công! Thông báo đã gửi đến Telegram của Sĩ Triết. Cảm ơn anh.",
          "success"
        );
        contactForm.reset();
      } else {
        // Xử lý lỗi từ Telegram API
        let errorMessage =
          responseData.description ||
          "Lỗi không xác định từ Telegram. Vui lòng kiểm tra Console.";
        // Ghi lỗi chi tiết từ Telegram API ra console
        showStatus(
          `❌ Lỗi gửi tin: ${errorMessage}. Vui lòng kiểm tra lại CHAT_ID.`,
          "error"
        );
      }
    } catch (error) {
      // Xử lý lỗi mạng
      showStatus(
        "❌ Lỗi kết nối: Vui lòng kiểm tra lại mạng hoặc thử lại.",
        "error"
      );
      console.error("Lỗi khi gửi form đến Telegram:", error);
    } finally {
      // Khôi phục trạng thái nút
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Gửi Yêu Cầu →";
      }
      hideStatusAfterDelay(8000);
    }
  });
});
