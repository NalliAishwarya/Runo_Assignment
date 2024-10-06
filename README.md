# Runo_Assignment
Vaccine Registration App
This application allows users to register for COVID-19 vaccinations, check available slots, and manage their vaccination statuses. Admins can monitor users and vaccination slots.

Table of Contents

1.	Features
2.	APIs and Functionalities
3.	Database Models
4.	Technologies Used
5.	Installation and Setup
6.	MongoDB Atlas Credentials
7.	Low-Level Diagram

   
Features

For Users:

•	User Registration with mandatory details (Name, Phone Number, Age, Pincode, Aadhar No).
•	Login via Phone Number and Password.
•	View available time slots for vaccine registration.
•	Register for the first/second dose of the vaccine.
•	Modify or update registered slots until 24 hours before the scheduled time.

For Admins:

•	Login via predefined credentials.
•	View and filter registered users by Age, Pincode, or Vaccination Status.
•	Monitor total slots booked for the first or second dose


APIs and Functionalities

User APIs

1.	Register User
   
•	Endpoint: POST /api/auth/register
•	Functionality: Registers a new user with the provided details.
•	Request Body:
{
  "name": "User Name",
  "phoneNumber": "1234567890",
  "age": 25,
  "pincode": "560001",
  "aadharNumber": "1234-5678-9012",
  "password": "user_password"
}

2.	User Login
   
•	Endpoint: POST /api/auth/login
•	Request Body:
{
  "phoneNumber": "1234567890",
  "password": "user_password"
}
•	Functionality: Authenticates a user and returns a JWT token if successful.

3.	Get Available Vaccine Slots
   
•	Endpoint: GET /api/slots
•	Query Parameters:
o	date: Date for which the slots are required (e.g., 2024-11-01).
•	Functionality: Retrieves available time slots for vaccination on a given day

4. Register for Vaccine Slot
   
•	Endpoint: POST /api/slots/register
•	Request Body
{
  "userId": "user_id",
  "slotId": "slot_id",
  "dose": "first"  // or "second"
}
•	Functionality: Allows users to register for a specific vaccine slot for the first or second dose.

5. Update Registered Slot
   
•	Endpoint: PUT /api/slots/update
•	Request Body
{
  "userId": "user_id",
  "newSlotId": "new_slot_id"
}
•	Functionality: Updates the registered slot for a user, allowed until 24 hours before the scheduled time.




Admin APIs

1.	Admin Login
   
o	Endpoint: POST /api/admin/login
o	Request Body:
{
  "phoneNumber": "1234567890",
  "password": "admin_password"
}
•	Functionality: Authenticates an admin and returns a JWT token if successful.

2.	Get Total Registered Users
   
•	Endpoint: GET /api/admin/users
•	Query Parameters: (Optional filters)
o	age: Filter by age.
o	pincode: Filter by pincode.
o	vaccinationStatus: Filter by vaccination status (none, first, completed).
•	Functionality: Retrieves a list of all registered users, with optional filters.

3.	Get Registered Vaccine Slots
   
•	Endpoint: GET /api/admin/slots
•	Query Parameters:
o	date: Date for which to get registered slots.
•	Functionality: Retrieves all registered vaccine slots for a specified date.



Database Models

1.	User Model
   
•	name: String (Required)
•	phoneNumber: String (Required, Unique)
•	age: Number (Required)
•	pincode: String (Required)
•	aadharNumber: String (Required)
•	password: String (Hashed, Required)
•	vaccinationStatus: Enum (none, first_dose, completed)
•	firstDoseDate: Date
•	secondDoseDate: Date

2.	Slot Model
   
•	slotTime: Date (Required)
•	availableDoses: Number (Default: 10)
•	users: Array of User references (Users who booked the slot)

Technologies Used

•	Backend: Node.js, Express.js
•	Database: MongoDB Atlas
•	Authentication: JWT for user sessions
•	Libraries: Mongoose, Bcrypt, Express Validator


Installation and Setup

1.	Clone the repository: 
git clone https://github.com/NalliAishwarya/Runo_Assignment.git
cd vaccine-registration-backend
2.	Install dependencies:
npm install
3.	Set up environment variables: Create a .env file in the root directory with the following variables:
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
4.	Start the server:
node server.js

MongoDB Atlas Credentials

•	Username: aishwaryanalli2010
•	Password: aishu81
•	Database Name: test


Low-Level Diagram:
![image](https://github.com/user-attachments/assets/403bbc87-8671-443a-936f-fb60caa086ec)

