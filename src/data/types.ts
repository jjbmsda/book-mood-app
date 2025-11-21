export type MoodType =
  | "설레요"
  | "우울해요"
  | "힐링이 필요해요"
  | "심심해요"
  | "집중하고 싶어요";

export type PlatformType = "리디북스" | "밀리의 서재" | "YES24" | "교보문고";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  link: string;
  tags: string[];
}
