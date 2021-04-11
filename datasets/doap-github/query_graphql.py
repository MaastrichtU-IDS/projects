from python_graphql_client import GraphqlClient
import json
import pathlib
import os


## DEPRECATED, now included in get_doap_files.py
# But then the releases are only retrieved for DOAP projects
# This script will get all releases in the IDS organization even if no DOAP

root = pathlib.Path(__file__).parent.resolve()
client = GraphqlClient(endpoint="https://api.github.com/graphql")

TOKEN = os.environ.get("GITHUB_TOKEN", "")

# Get all projects in MaastrichtU-IDS org (given node id)
def get_projects_query(after_cursor=None):
    return """
query {
  node(id:"MDEyOk9yZ2FuaXphdGlvbjM2MjYyNTI2") {
    ... on Organization {
        repositories(first: 100, privacy: PUBLIC, after:AFTER) {
        pageInfo {
            hasNextPage
            endCursor
        }
        nodes {
            name
            description
            url
            releases(last:1) {
                totalCount
                nodes {
                    name
                    tagName
                    publishedAt
                    url
                    description
                    shortDescriptionHTML
                    author {
                        name
                    }
                }
            }
        }
        }
    }
  }   
}
""".replace(
        "AFTER", '"{}"'.format(after_cursor) if after_cursor else "null"
    )

# Retrieve releases in projects returned by the GraphQL calls
def fetch_releases(oauth_token):
    repos = []
    releases = []
    repo_names = set()
    has_next_page = True
    after_cursor = None

    while has_next_page:
        data = client.execute(
            query=get_projects_query(after_cursor),
            headers={"Authorization": "Bearer {}".format(oauth_token)},
        )
        print(json.dumps(data, indent=4))
        for repo in data["data"]["node"]["repositories"]["nodes"]:
            if repo["releases"]["totalCount"] and repo["name"] not in repo_names:
                repos.append(repo)
                repo_names.add(repo["name"])
                releases.append(
                    {
                        "repo": repo["name"],
                        "repo_url": repo["url"],
                        "repo_description": repo["description"],
                        "release_tag": repo["releases"]["nodes"][0]["tagName"],
                        "release_name": repo["releases"]["nodes"][0]["name"]
                        .replace(repo["name"], "")
                        .strip(),
                        "published_at": repo["releases"]["nodes"][0][
                            "publishedAt"
                        ].split("T")[0],
                        "release_url": repo["releases"]["nodes"][0]["url"],
                        # "release_description": repo["releases"]["nodes"][0]["shortDescriptionHTML"],
                        "release_description": repo["releases"]["nodes"][0]["description"],
                        "release_author": repo["releases"]["nodes"][0]["author"]["name"],
                    }
                )
        has_next_page = data["data"]["node"]["repositories"]["pageInfo"][
            "hasNextPage"
        ]
        after_cursor = data["data"]["node"]["repositories"]["pageInfo"]["endCursor"]
    return releases


if __name__ == "__main__":
    releases = fetch_releases(TOKEN)
    releases.sort(key=lambda r: r["published_at"], reverse=True)

    # Store retrieved data to JSON file in assets folder
    with open(root / '../assets/ids_github_data.json', 'w') as f:
        json.dump({'recent_releases': releases}, f)
