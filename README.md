# magic-shorten-link
Shortly Link is a web application for URL shortening (URL Shortener) developed using Go (Gin), Gorm, and React. 
I build this project with a video tutorial (https://www.youtube.com/watch?v=d2AIOCAiSZE).

# Features
- URL shortening functionality
- Responsive design for various screen sizes using Tailwind CSS
- Custom link creation for personalized URLs

# Installation
1. Clone the project:
```bash
  https://github.com/Chinnasit/magic-shorten-link.git
```
2. Install Backend Dependencies:
```bash
cd backend
go get .
   ```
3. Install Frontend Dependencies:
```bash
cd ../frontend
npm install
```
4. Create a .env file in the backend folder
```bash
DB_USERNAME=<db_username>
DB_PASSWORD=<db_password>
DB_HOST=<db_host>
DB_PORT=<db_port>
DB_NAME=<db_name>
```

# Running the Application
1. Start the Backend Server:
```bash
cd backend
go run main.go
```
2. Start the Frontend Server on a different port:
```bash
cd ../frontend
npm run dev
```

# Summary
This project demonstrates the development of an application using Go (Gin), Gorm, and React. It includes enhancements to support responsive design and custom link creation for users.
