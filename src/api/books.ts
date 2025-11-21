import { Book, MoodType, PlatformType } from "../data/types";

// 백엔드 Flask 주소
// - iOS 시뮬레이터: http://localhost:5000
// - 안드로이드 에뮬레이터: http://10.0.2.2:5000
// - 실기기: http://<내 컴퓨터 IP>:5000
const BASE_URL = "http://172.29.122.165:5000";

export async function fetchRecommendations(
  mood: MoodType,
  platform: PlatformType,
  limit = 10
): Promise<Book[]> {
  const params = new URLSearchParams({
    mood,
    platform,
    limit: String(limit),
  }).toString();

  const url = `${BASE_URL}/recommendations?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const json = await res.json();
  return json.books as Book[];
}
