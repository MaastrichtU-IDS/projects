from python_graphql_client import GraphqlClient
import requests
import csv
from rdflib import Graph
import json
import pathlib
import re
import os

root = pathlib.Path(__file__).parent.resolve()
client = GraphqlClient(endpoint="https://api.github.com/graphql")


TOKEN = os.environ.get("GITHUB_TOKEN", "")


def replace_chunk(content, marker, chunk, inline=False):
    r = re.compile(
        r"<!\-\- {} starts \-\->.*<!\-\- {} ends \-\->".format(marker, marker),
        re.DOTALL,
    )
    if not inline:
        chunk = "\n{}\n".format(chunk)
    chunk = "<!-- {} starts -->{}<!-- {} ends -->".format(marker, chunk, marker)
    return r.sub(chunk, content)


# Get all projects in MaastrichtU-IDS org (given node id)
def make_query(after_cursor=None):
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


def fetch_releases(oauth_token):
    repos = []
    releases = []
    repo_names = set()
    has_next_page = True
    after_cursor = None

    while has_next_page:
        data = client.execute(
            query=make_query(after_cursor),
            headers={"Authorization": "Bearer {}".format(oauth_token)},
        )
        print()
        print(json.dumps(data, indent=4))
        print()
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


def fetch_contributions(oauth_token):
    graphql_get_contributions = """
    query { 
        viewer {
            repositoriesContributedTo(first: 100, contributionTypes: [COMMIT], orderBy:{field: STARGAZERS, direction: DESC}) {
                totalCount
                nodes {
                    nameWithOwner
                    url
                    description
                    owner { id }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
    """
    contributions = []
    data = client.execute(
        query=graphql_get_contributions,
        headers={"Authorization": "Bearer {}".format(oauth_token)},
    )
    for repo in data["data"]["viewer"]["repositoriesContributedTo"]["nodes"]:
        # Do not take MaastrichtU-IDS repos 
        if repo['owner']['id'] != 'MDEyOk9yZ2FuaXphdGlvbjM2MjYyNTI2':
            contributions.append(
                {
                    "nameWithOwner": repo["nameWithOwner"],
                    "url": repo["url"],
                    "description": repo["description"]
                }
            )
    return contributions


if __name__ == "__main__":
    readme = root / "README.md"
    project_releases = root / "releases.md"
    releases = fetch_releases(TOKEN)

    releases.sort(key=lambda r: r["published_at"], reverse=True)
    # md = "\n".join(
    #     [
    #         "* [{repo} {release}]({url}) - {published_at}".format(**release)
    #         for release in releases[:8]
    #     ]
    # )
    # readme_contents = readme.open().read()
    # rewritten = replace_chunk(readme_contents, "recent_releases", md)

    # # Write out full project-releases.md file
    # project_releases_md = "\n".join(
    #     [
    #         (
    #             "* **[{repo}]({repo_url})**: [{release}]({url}) - {published_at}\n"
    #             "<br>{description}"
    #         ).format(**release)
    #         for release in releases
    #     ]
    # )
    # project_releases_content = project_releases.open().read()
    # project_releases_content = replace_chunk(
    #     project_releases_content, "recent_releases", project_releases_md
    # )
    # project_releases_content = replace_chunk(
    #     project_releases_content, "release_count", str(len(releases)), inline=True
    # )
    # project_releases.open("w").write(project_releases_content)

    # contributions = fetch_contributions(TOKEN)
    # # contributions.sort(key=lambda r: r["published_at"], reverse=True)
    # contributions_md = "\n".join(
    #     [
    #         (
    #             "* [{nameWithOwner}]({url}) - {description}"
    #         ).format(**contribution)
    #         for contribution in contributions[:11]
    #     ]
    # )

    # Store retrieved data to JSON file
    with open(root / '../assets/ids_github_data.json', 'w') as f:
        json.dump({'recent_releases': releases}, f)

    # rewritten = replace_chunk(rewritten, "contributions", contributions_md)

    # readme.open("w").write(rewritten)
