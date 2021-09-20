/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 * With the results from this request, inside "content",
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should
 * be in alphabetical order.
 */

const fetch = require('node-fetch');

module.exports = async function organiseMaintainers() {
  const response = await fetch(
    'http://ambush-api.inyourarea.co.uk/ambush/intercept',
    {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://api.npms.io/v2/search/suggestions?q=react',
        method: 'GET',
        return_payload: true,
      }),
    },
  );
  const data = await response.json();

  const maintainers = [];

  data.content.forEach(npmPackage => {
    npmPackage.package.maintainers.forEach(maintainer => {
      const dupeUsername = maintainers.find(
        ({ username }) => username === maintainer.username,
      );

      if (!dupeUsername) {
        maintainers.push({
          username: maintainer.username,
          packageNames: [npmPackage.package.name],
        });
      } else {
        dupeUsername.packageNames.push(npmPackage.package.name);
        dupeUsername.packageNames.sort();
      }
    });
  });

  maintainers.sort((a, b) => {
    if (a.username < b.username) {
      return -1;
    }
    if (a.username > b.username) {
      return 1;
    }
    return 0;
  });

  return maintainers;
};
