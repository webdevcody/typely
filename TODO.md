- finish deleting an account functionality which should include deleting the user and all their associated data
- finish the delete site functionality which should delete the user's site and all data associated with it
- create the javascript chat widget which should connect to convex using a unique site id
- add a page in the dashboard to show all chat history for every user in the dashboard
- on the pages route, add the ability for a site admin to click on a page and view more information about it, such as last time indexed, the markdown context of the site, the crawling status, etc.
- truncate the hostname of the displayed "crawled" urls so it's easier for a user to understand which page it crawled
- add a link inside the page view route which a user can click to navigate to the page in a new tab
- add the ability for a site admin to upload a custom document for the site which will get indexed and included in the agent chat context for all questions
- add in stripe with basic subscriptions

## Chat Widget

- we should probably find a way to style the returned info better, like maybe markdown?
- refactor the widget to take in a ?siteId which will inject the siteId into the code that is returned from my backend. <script src="/widget.js?siteId=ABC"></script>

## Clean up

- refactor any old auth approach in convex to use the `isSiteAdmin` aka `const userId = await getAuthUserId(ctx);`
