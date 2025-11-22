Start the Database: In your backend directory, run:

pnpm run prisma:start_db
(Use pnpm as your project is configured for it). You'll see logs from Prisma; leave this terminal running.

2. Run Your Application: Open a new terminal in the backend directory. Now you can run your commands.

To validate the database connection, run:

node db-read.js
This should now work.

To run your application, use:

pnpm run start:dev
Keep pnpm run prisma:start_db running in the background while you work.


