from python_graphql_client import GraphqlClient
import json
import pathlib
import os

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
            object(expression: "master:doap-project.ttl") {
                ... on Blob {
                    text
                }
            }
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
def fetch_doap_files(oauth_token):
    if not os.path.exists(root / '../doap-rdf'):
        os.makedirs(root / '../doap-rdf')
    repos = []
    doap_files = {}
    repo_names = set()
    has_next_page = True
    after_cursor = None

    while has_next_page:
        data = client.execute(
            query=get_projects_query(after_cursor),
            headers={"Authorization": "Bearer {}".format(oauth_token)},
        )
        # print(json.dumps(data, indent=4))
        for repo in data["data"]["node"]["repositories"]["nodes"]:
            if repo["object"] and repo["object"]["text"] and repo["name"] not in repo_names:
                repos.append(repo)
                repo_names.add(repo["name"])
                doap_file_content = repo["object"]["text"]
                
                doap_filepath = '../doap-rdf/doap-' + repo["name"] + '.ttl'
                # Write doap file in doap-rdf folder to upload later
                with open(root / doap_filepath, 'w') as f:
                    print('Write doap file ' + doap_filepath)
                    f.write(doap_file_content)
                
                doap_files[repo["name"]] = {
                        "doap-rdf": doap_file_content,
                        "repo_url": repo["url"],
                        "repo_description": repo["description"]
                    }
        has_next_page = data["data"]["node"]["repositories"]["pageInfo"][
            "hasNextPage"
        ]
        after_cursor = data["data"]["node"]["repositories"]["pageInfo"]["endCursor"]
    return doap_files


if __name__ == "__main__":
    doap_files = fetch_doap_files(TOKEN)
    # releases.sort(key=lambda r: r["published_at"], reverse=True)

    # Store retrieved data to JSON file in assets folder
    # with open(root / '../assets/ids_github_data.json', 'w') as f:
    #     json.dump({'recent_releases': releases}, f)
