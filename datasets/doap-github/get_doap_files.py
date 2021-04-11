from python_graphql_client import GraphqlClient
import json
import pathlib
import os

def main():
    external_doap_repositories = []
    with open(root / '../EXTERNAL_REPOSITORIES.txt', 'r') as f:
        for line in f:
            external_doap_repositories.append(line.rstrip('\n'))

    fetch_doap_files(TOKEN)

    fetch_extra_doap_files(TOKEN, external_doap_repositories)

    releases.sort(key=lambda r: r["published_at"], reverse=True)

    # Store retrieved releases to JSON file in assets folder
    with open(root / '../assets/ids_github_data.json', 'w') as f:
        json.dump({'recent_releases': releases}, f)


def get_repo_infos(repo):
    """Get infos, releases and DOAP file from a repo JSON returned 
    by the GraphQL API
    """
    if repo["object"] and repo["object"]["text"] and repo["name"] not in repo_names:
        list_processed_repo.append(repo)
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

        # Now get the latest release
        if repo["releases"] and repo["releases"]["totalCount"]:
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
    has_next_page = True
    after_cursor = None

    while has_next_page:
        data = client.execute(
            query=get_projects_query(after_cursor),
            headers={"Authorization": "Bearer {}".format(oauth_token)},
        )
        # print(json.dumps(data, indent=4))
        for repo in data["data"]["node"]["repositories"]["nodes"]:
            get_repo_infos(repo)
        has_next_page = data["data"]["node"]["repositories"]["pageInfo"][
            "hasNextPage"
        ]
        after_cursor = data["data"]["node"]["repositories"]["pageInfo"]["endCursor"]


def get_extra_graphql_query(repo):
  """Generate GraphQL query for repos in the list EXTRA_SHAPES_REPOSITORIES
  """
  owner=repo.split('/')[0]
  repo_name=repo.split('/')[1]
  return '''query {
	repository(name:"''' + repo_name + '''", owner:"''' + owner + '''"){
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
  '''

def fetch_extra_doap_files(oauth_token, external_doap_repositories):
  """Fetch additional Shapes files from a list of GitHub repos
  """
  for extra_repo in external_doap_repositories:
    data = client.execute(
        query=get_extra_graphql_query(extra_repo),
        headers={"Authorization": "Bearer {}".format(oauth_token)},
    )
    repo_json = data["data"]["repository"]
    get_repo_infos(repo_json)


if __name__ == "__main__":
  # Scripts starts here
    TOKEN = os.environ.get("GITHUB_TOKEN", "")
    root = pathlib.Path(__file__).parent.resolve()
    client = GraphqlClient(endpoint="https://api.github.com/graphql")
    global list_processed_repo
    list_processed_repo = []
    global repo_names
    repo_names = set()
    global releases
    releases = []

    # Not really used since we store the DOAP file directly in file
    global doap_files
    doap_files = {}

    main()
