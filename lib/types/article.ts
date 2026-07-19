export type ArticleContentBlockType =
  | 'paragraph'
  | 'text'
  | 'heading'
  | string;

export interface ArticleContentBlock {
  type: ArticleContentBlockType;
  content: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | string;
}

export interface Article {
  id?: number | string;
  slug: string;
  title?: string;
  description?: string;
  excerpt?: string;
  content?: string | ArticleContentBlock[];
  image?: string;
  date?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
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

export type ArticleApiResponse =
  | Article
  | {
      data?: Article;
      article?: Article;
      item?: Article;
      result?: Article;
      [key: string]: unknown;
    };
