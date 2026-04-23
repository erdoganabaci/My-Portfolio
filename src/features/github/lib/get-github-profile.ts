import {z} from "zod";
import githubProfileSnapshot from "@/features/github/data/profile-snapshot.json";

const githubLanguageSchema = z.object({
  color: z.string(),
  name: z.string()
});

const githubRepositoryNodeSchema = z.object({
  description: z.string().nullable(),
  diskUsage: z.number().int().nonnegative(),
  forkCount: z.number().int().nonnegative(),
  id: z.string(),
  name: z.string(),
  primaryLanguage: githubLanguageSchema.nullable().optional(),
  stargazers: z.object({
    totalCount: z.number().int().nonnegative()
  }),
  url: z.string().url()
});

const githubSnapshotSchema = z.object({
  data: z.object({
    user: z.object({
      avatarUrl: z.string().url(),
      bio: z.string().nullable(),
      isHireable: z.boolean(),
      location: z.string().nullable(),
      name: z.string(),
      pinnedItems: z.object({
        edges: z.array(
          z.object({
            node: githubRepositoryNodeSchema
          })
        ),
        totalCount: z.number().int().nonnegative()
      })
    })
  })
});

export type GithubRepository = {
  description: string | null;
  diskUsage: number;
  forkCount: number;
  id: string;
  name: string;
  primaryLanguage:
    | {
        color: string;
        name: string;
      }
    | null;
  stars: number;
  url: string;
};

export type GithubProfile = {
  avatarUrl: string;
  bio: string | null;
  isHireable: boolean;
  location: string | null;
  name: string;
  pinnedProjects: GithubRepository[];
};

export function parseGithubSnapshot(snapshot: unknown): GithubProfile {
  const parsedSnapshot = githubSnapshotSchema.parse(snapshot);
  const {user} = parsedSnapshot.data;

  return {
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    isHireable: user.isHireable,
    location: user.location,
    name: user.name,
    pinnedProjects: user.pinnedItems.edges.map(({node}) => ({
      description: node.description,
      diskUsage: node.diskUsage,
      forkCount: node.forkCount,
      id: node.id,
      name: node.name,
      primaryLanguage: node.primaryLanguage ?? null,
      stars: node.stargazers.totalCount,
      url: node.url
    }))
  };
}

export function getGithubProfile() {
  return parseGithubSnapshot(githubProfileSnapshot);
}
