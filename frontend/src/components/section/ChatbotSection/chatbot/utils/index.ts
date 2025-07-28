export function generateSessionId() {
  const randomNum = Math.random();
  const base36String = randomNum.toFixed(18).substring(2);
  return base36String;
}

const generateSession = () => {
  const newSessionId = generateSessionId();
  const timestamp = Date.now();
  localStorage.setItem('UNREAL_AI_SESSION_ID', newSessionId);
  localStorage.setItem('UNREAL_AI_SESSION_ID_TIMESTAMP', timestamp.toString());
  return newSessionId;
};

export function getSessionId() {
  const sessionId = localStorage.getItem('UNREAL_AI_SESSION_ID');
  const timestamp = localStorage.getItem('UNREAL_AI_SESSION_ID_TIMESTAMP');
  if (timestamp) {
    const currentTime = Date.now();
    const oneHourInMilliseconds = 3600000;
    if (currentTime - Number(timestamp) > oneHourInMilliseconds) {
      return generateSession();
    }
  }
  if (!sessionId) {
    return generateSession();
  }
  return sessionId;
}

export function generateUUID() {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 1000000); // Adjust the range based on your requirements

  return `${timestamp}-${randomPart}`;
}
