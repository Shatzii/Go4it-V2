import fetch from 'node-fetch';

export async function sendSmsKannel({
  to,
  text,
  kannelUrl,
  username,
  password,
}: {
  to: string;
  text: string;
  kannelUrl: string;
  username: string;
  password: string;
}) {
  const url = `${kannelUrl}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&to=${encodeURIComponent(to)}&text=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Kannel SMS failed: ${res.status} ${await res.text()}`);
  }
  return true;
}
