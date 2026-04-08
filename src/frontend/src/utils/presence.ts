const PREFIX = "chinnua_presence_";
const ONLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function updatePresence(username: string): void {
  if (!username) return;
  try {
    localStorage.setItem(PREFIX + username, String(Date.now()));
  } catch {}
}

export function isOnline(username: string): boolean {
  if (!username) return false;
  try {
    const ts = localStorage.getItem(PREFIX + username);
    if (!ts) return false;
    return Date.now() - Number(ts) < ONLINE_THRESHOLD_MS;
  } catch {
    return false;
  }
}

export function getOnlineUsers(): string[] {
  const online: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) {
        const username = key.slice(PREFIX.length);
        if (isOnline(username)) online.push(username);
      }
    }
  } catch {}
  return online;
}
