AARADHYA FASHION - CODE-BASED CATALOG WEBSITE
================================================

FILES
-----
index.html      Customer-facing catalog
style.css       Navy theme and responsive styling
app.js          Search, category filters, product details and WhatsApp order
products.js     Starter product data; edit this file to add products
admin.html      Admin login and product management interface
admin.js        LocalStorage-based admin functions

RUN LOCALLY
-----------
1. Extract this ZIP into a folder.
2. Open the folder in Visual Studio Code.
3. Recommended: install the "Live Server" extension.
4. Right-click index.html and choose "Open with Live Server".
5. Open admin.html to manage products.

DEMO ADMIN LOGIN
----------------
Username: admin
Password: AF2026!

Change ADMIN_PASSWORD in admin.js before testing.
IMPORTANT: This is only a demo client-side login. The password is visible in source code
and is NOT secure. Do not use this setup for a public production admin account.

WHATSAPP NUMBER
---------------
Change WHATSAPP_NUMBER in app.js and the links in index.html if needed.
The current configured number is 918931911428.

ADD PRODUCTS
------------
Option A: Edit products.js and add another object to STARTER_PRODUCTS.
Option B: Open admin.html, sign in, and use the product form.
The Admin Panel stores changes in the current browser's LocalStorage.

IMPORTANT LOCALSTORAGE LIMITATION
---------------------------------
The website has no backend/database. Admin changes are saved only in the browser
where they were made. Other customers and other devices will not see those changes.
Clearing browser data can remove local changes. Use Export Backup regularly.
For a shared public catalog and secure admin panel, a backend/database is required.

PRODUCT IMAGES
--------------
Use HTTPS image URLs or local image paths such as:
assets/products/my-shirt.jpg
Put local image files in assets/products/.

FREE HOSTING
------------
You can publish the static customer site with GitHub Pages.
Create a GitHub repository, upload the files, then enable Pages in repository Settings.
For a public production site, do not publish a real admin password in client-side code.
