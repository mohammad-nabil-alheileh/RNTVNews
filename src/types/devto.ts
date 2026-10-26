export type DevtoUser = {
  name: string;
  username: string;
  profile_image_90: string;
};

export type DevtoArticle = {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  social_image: string;
  published_at: string;
  reading_time_minutes: number;
  tag_list: string[] | string;
  tags: string[] | string;
  url: string;
  user: DevtoUser;
  body_html?: string;
};
