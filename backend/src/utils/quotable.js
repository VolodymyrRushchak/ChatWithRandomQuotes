async function getRandomMessage() {
  const response = await fetch('https://api.quotable.io/random');
  if (!response.ok) {
    console.log(`Failed to fetch a quote: ${response.status} - ${response.statusText}`);
    return; 
  }
  const data = await response.json();
  const newMessage = { text: data.content, isMine: false, timestamp: new Date().toISOString() };
  return newMessage;
}

module.exports = getRandomMessage;
