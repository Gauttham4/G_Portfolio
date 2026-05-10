export type Project = {
  slug: string;
  title: string;
  summary?: string;
  body?: string;
};

export function getAllSlugs(): string[] {
  return [];
}

export function getProjectBySlug(_slug: string): Project | null {
  return null;
}

export function getAllProjects(): Project[] {
  return [];
}
