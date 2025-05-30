document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Thêm tin nhắn ban đầu từ bot
    addBotMessage("Xin chào! Tôi là Web Copilot đơn giản. Tôi có thể giúp gì cho bạn?");

    // Xử lý khi nhấn nút gửi
    sendButton.addEventListener('click', handleUserMessage);

    // Xử lý khi nhấn phím Enter (Shift+Enter để xuống dòng)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    });

    function handleUserMessage() {
        const message = userInput.value.trim();
        if (message) {
            // Thêm tin nhắn người dùng vào cuộc trò chuyện
            addUserMessage(message);
            
            // Xóa nội dung ô nhập liệu
            userInput.value = '';
            
            // Hiển thị trạng thái đang nhập
            showTypingIndicator();
            
            // Xử lý tin nhắn và nhận phản hồi (giả lập độ trễ)
            setTimeout(() => {
                // Xóa trạng thái đang nhập
                removeTypingIndicator();
                
                // Thêm phản hồi từ bot
                const response = generateResponse(message);
                addBotMessage(response);
                
                // Cuộn xuống dưới cùng
                scrollToBottom();
            }, 1000 + Math.random() * 1000); // Độ trễ ngẫu nhiên từ 1-2 giây
        }
    }

    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingIndicator.appendChild(dot);
        }
        
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateResponse(message) {
        // Đây là hệ thống phản hồi dựa trên quy tắc đơn giản
        // Trong ứng dụng thực tế, bạn có thể kết nối với một API
        message = message.toLowerCase();
        
        if (message.includes('xin chào') || message.includes('hello') || message.includes('hi') || message.includes('chào')) {
            return "Xin chào! Rất vui được gặp bạn.";
        }
        else if (message.includes('tên') && (message.includes('bạn') || message.includes('là gì'))) {
            return "Tôi là Web Copilot, một trợ lý AI đơn giản.";
        }
        else if (message.includes('thời tiết')) {
            return "Tôi không thể kiểm tra thời tiết hiện tại. Đây chỉ là một demo đơn giản.";
        }
        else if (message.includes('giúp') || message.includes('help')) {
            return "Tôi có thể trả lời các câu hỏi đơn giản. Hãy thử hỏi tôi về một chủ đề nào đó!";
        }
        else if (message.includes('cảm ơn')) {
            return "Không có gì! Tôi luôn sẵn sàng giúp đỡ.";
        }
        else if (message.includes('làm gì')) {
            return "Tôi là một trợ lý ảo đơn giản có thể trò chuyện với bạn. Trong phiên bản thực tế, tôi có thể được kết nối với API để cung cấp thông tin hoặc thực hiện các tác vụ.";
        }
        else if (message.includes('code') || message.includes('lập trình')) {
            return "Đây là một ví dụ về code JavaScript:\n\nfunction xinChao() {\n    console.log('Xin chào thế giới!');\n}\n\nxinChao();";
        }
        else if (message.includes('ngày') || message.includes('giờ')) {
            const now = new Date();
            return `Hôm nay là ngày ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.`;
        }
        else {
            return "Tôi không chắc mình hiểu câu hỏi này. Bạn có thể diễn đạt lại theo cách khác được không?";
        }
    }
});
