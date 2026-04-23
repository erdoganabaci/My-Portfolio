import {describe, expect, it} from "vitest";
import {
  getGithubProfile,
  parseGithubSnapshot
} from "@/features/github/lib/get-github-profile";

describe("parseGithubSnapshot", () => {
  it("normalizes the stored snapshot into portfolio-friendly data", () => {
    const profile = getGithubProfile();

    expect(profile.name).toBe("Erdogan Abacı");
    expect(profile.pinnedProjects.length).toBeGreaterThan(0);
    expect(typeof profile.pinnedProjects[0]?.id).toBe("string");
    expect(typeof profile.pinnedProjects[0]?.stars).toBe("number");
  });

  it("accepts missing optional fields on repositories", () => {
    const profile = parseGithubSnapshot({
      data: {
        user: {
          avatarUrl: "https://example.com/avatar.png",
          bio: null,
          isHireable: false,
          location: null,
          name: "Example User",
          pinnedItems: {
            edges: [
              {
                node: {
                  description: null,
                  diskUsage: 0,
                  forkCount: 0,
                  id: "repo-1",
                  name: "example-repo",
                  primaryLanguage: null,
                  stargazers: {
                    totalCount: 0
                  },
                  url: "https://github.com/example/example-repo"
                }
              }
            ],
            totalCount: 1
          }
        }
      }
    });

    expect(profile.pinnedProjects[0]?.description).toBeNull();
    expect(profile.pinnedProjects[0]?.primaryLanguage).toBeNull();
  });

  it("supports an empty pinned-project set", () => {
    const profile = parseGithubSnapshot({
      data: {
        user: {
          avatarUrl: "https://example.com/avatar.png",
          bio: "Example bio",
          isHireable: true,
          location: "Brussels",
          name: "Example User",
          pinnedItems: {
            edges: [],
            totalCount: 0
          }
        }
      }
    });

    expect(profile.pinnedProjects).toEqual([]);
  });
});
