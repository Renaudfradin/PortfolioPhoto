export interface Article {
  id?: number | string;
  slug: string;
  title?: string;
  description?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  date?: string;
  [key: string]: unknown;
}

export type ArticlesApiResponse =
  | Article[]
  | {
      data?: Article[];
      articles?: Article[];
      items?: Article[];
      results?: Article[];
      [key: string]: unknown;
    };
