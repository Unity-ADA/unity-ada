
export interface title_and_data {
  title:   string;
  data:    string | number;
  url?:    string;
  url2?:   string;
  target?: string;
}

export interface token_information {
  name:           string;
  ticker:         string;
  description:    string;
  fingerprint:    string;
  policy_id:      string;
  policy_id_full: string;
  supply:         number;
  decimals:       number;
}

export interface pool_information {
  name:        string;
  ticker:      string;
  pool_id:     string;
  hash:        string;
  drep?:       string;
}

export interface curator_information {
  name:         string;
  description?: string;
}

export interface images {
  main:        string;
  header?:     string;
  collection?: string[];
}

export interface general_links {
  discord?:        string;
  twitter?:        string;
  website?:        string;
  reddit?:         string;
  github?:         string;
  telegram?:       string;
  discord_handle?: string;
}

export interface project_likes {
  id:           number;
  project_slug: string;
  likers:       string[];
}

export interface project_comment {
  id:              number;
  created_at:      number;
  post:         string;
  author:          string;
  post_id:         number;
  signature:       string;
  last_updated:    number;
  updated_comment: string;
  times_tipped:    number;
  ada_handle:      string;
  likers:          string[];
}

export interface forum_comment {
  id:              number;
  created_at:      number;
  post:            string;
  author:          string;
  post_id:         number;
  signature:       string;
  last_updated:    number;
  updated_comment: string;
  ada_handle:      string;
  times_tipped:    number;
  likers:          string[];
}

export interface forum_post {
  id:           number;
  created_at:   number;
  title:        string;
  post:         string;
  author:       string;
  likers:       string[];
  signature:    string;
  tag:          string;
  last_updated: number;
  updated_post: string;
  ada_handle:   string;
  times_tipped: number;

  comment_count?: number;
}