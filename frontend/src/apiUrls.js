const BACKEND_IP_ADDRESS = 'localhost:5000'
const BASE_URL = `http://${BACKEND_IP_ADDRESS}`;

export const API_URLS = {
    WS: `ws://${BACKEND_IP_ADDRESS}`,
    GET_CHATS: `${BASE_URL}/chats`,
    CREATE_CHAT: `${BASE_URL}/chats`,
    UPDATE_CHAT: (chatId) => `${BASE_URL}/chats/${chatId}`,
    DELETE_CHAT: (chatId) => `${BASE_URL}/chats/${chatId}`,
    SEND_MESSAGE: (chatId) => `${BASE_URL}/chats/${chatId}/messages`,
    EDIT_MESSAGE: (chatId, messageId) => `${BASE_URL}/chats/${chatId}/messages/${messageId}`, 
    AUTO_MESSAGING: (onOff) => `${BASE_URL}/toggle-auto-messaging/${onOff}`,
    GOOGLE_AUTH: `${BASE_URL}/auth/google`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    USER: `${BASE_URL}/auth/user`
};