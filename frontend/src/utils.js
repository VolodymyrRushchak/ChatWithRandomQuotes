export function formatTimestamp(timestamp, fullDate = false) {
    const date = new Date(timestamp);

    // Get date components
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Get time components
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    // const seconds = date.getSeconds().toString().padStart(2, '0');

    if (fullDate) {
        return `${day}/${(date.getMonth()+1).toString().padStart(2, '0')}/${year}, ${hours}:${minutes}`;
    }
    return `${month} ${day}, ${hours}:${minutes}`;
}