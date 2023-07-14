
# SocialNet

SocialNet is my side project that I am currently developing in my free time. The main idea was to create an app where users can communicate with each other by creating posts, groups and talk in real time chat. 



## Tech Stack

**Server:** Django, Django Rest Framework, Django Channels, boto3, Simple JWT

**Client:** React, Redux Toolkit, React-Boostrap

**Other:** Redis, PostrgreSQL, AWS S3 Bucket


## Functionalities

- Users can register an account 
- Users can log in
- Users can create posts that are displayed for them and all their friends on the main page
- Users can like posts and comment on their own and others posts
- Users can create private or public groups and invite friends to join
- Users can create posts in groups that are not only displayed on the specific group page but also on the main page, visible only to the user's friends
- Users can create clickable tags in posts that redirect to a page displaying all posts with the same tag
- Users can send friend invitations to other users
- Users can engage in real-time chat with their friends
- Users receive real-time notifications when they receive new friend invitations
- Users can view their own profile and profiles of others
- Users can edit their profiles
- Users can save posts as their favourite
- Users can view news articles and click on them to read the full content


## Screenshots
Here is a couple of screenshots of the user interface

* The main page features a vertical header and a middle column that displays posts with infinite scrolling for improved performance. It includes a create post component and a search bar for finding tags and groups. Additionally, the right column provides news sourced from a third-party API
![App Screenshot](https://snipboard.io/Ow3a8R.jpg)

* The real-time chat feature is built using the WebSocket protocol, allowing for instant and seamless communication between users. To optimize performance and reliability, I utilize a caching Redis server, ensuring efficient message delivery and synchronization in real-time
![App Screenshot](https://snipboard.io/vplPf2.jpg)

* The profile page displays essential information about the user, such as the number of posts they have created, the groups they are participating in, and the count of their friends. Users can access and modify their personal information directly from the profile page, enabling them to update and manage their details as needed
![App Screenshot](https://snipboard.io/5x4i6y.jpg)

* Users have the ability to invite each other to their own groups and remove them from groups through special modals. These modals are accessible from the profile page of their friends
![App Screenshot](https://snipboard.io/hWZica.jpg)

* Each user has their own group page that showcases all the groups in which they are either an owner or a participant. This dedicated page provides a comprehensive overview of the user's group affiliations, allowing them to easily access and manage their various group memberships
![App Screen](https://snipboard.io/X3txkD.jpg)

* Specific group pages enable participants to create and share their own posts within the group. 
![App Screen](https://snipboard.io/EIpO6Q.jpg)

* Users have the ability to save their favorite posts and access them later through a dedicated 'Favorites' page. This feature allows users to bookmark and easily revisit posts they find particularly interesting or valuable
![App Screen](https://snipboard.io/P839jp.jpg)
## TODO
At the current version, the application is functional, but there are some issues that need to be addressed in the next version:
- Improve responsiveness for better adaptability across different devices
- Implement a reconnect functionality to the WebSocket server when a user gets disconnected after a certain period of time
- Include group invitation notifications in the system notifications for enhanced user experience
- Enhance error handling on the client-side by providing more informative error messages instead of primarily relying on console.log() statements
- Create Email verification system and forgot password
- Develop unit tests for the backend to ensure its reliability and robustness
