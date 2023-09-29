# API Documentation

## Running the Application

To run this application locally, follow these steps:

1.  ```bash
    git clone git@github.com:GiorgiKalatozi/parkingperks.git
    ```

2.  ```bash
      cd parkingperks
    ```
3.  ```bash
      yarn install
    ```
4.  ```bash
      docker-compose up --build
    ```

5.  Create a PostgreSQL database named "parkingperks" manually.

6.  Create a .env file in the project root directory and copy the variables from the example.env file and paste them into .env.

## Authentication

### User Registration

Create a new user in the database.

- **Endpoint:** POST `/auth/signup`
- **Parameters:**
  - `username` (string): User's username.
  - `password` (string): User's password.

### User Login

Authenticate a user with their credentials.

- **Endpoint:** POST `/auth/signin`
- **Parameters:**
  - `userName` (string): User's username.
  - `password` (string): User's password.

### Change User Password

Change the user's password.

- **Endpoint:** POST `/auth/update-password`
- **Parameters:**
  - `password` (string): Users current password.
  - `newPassword` (string): New password.
  - `confirmNewPassword` (string): Confirm new password.

## Cars

### Get All Cars

Get a list of all cars.

- **Endpoint:** GET `/cars`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).

### Get Car by ID

Retrieve a car by its unique identifier.

- **Endpoint:** GET `/cars/:id`
- **Headers:**

  - `Authorization` (string): Bearer token (your generated token).

### Create Car

Create a new car.

- **Endpoint:** POST `/cars`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).
- **Parameters:**
  - `name` (string): The name of the car.
  - `licensePlate` (string): The license plate of the car.
  - `type` (string): The type of the car. Must be one of the following values: "Compact", "Sedan", "SUV", "Truck", "Van", "Electric".

### Update Car

Update an existing car.

- **Endpoint:** PUT `/cars/:id`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).
- **Parameters:**
  - `name` (string): The updated name of the car (optional).
  - `licensePlate` (string): The updated license plate of the car (optional).
  - `type` (string): The updated type of the car (optional). Must be one of the following values: "Compact", "Sedan", "SUV", "Truck", "Van", "Electric".
    This documentation covers both creating and updating cars using the same DTO.

### Delete Car

Delete an existing car.

- **Endpoint:** DELETE `/cars/:id`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).

## Admin

### Assign Role to User

Assign a role to a user.

- **Endpoint:** POST `/admin/assign/:userId`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).

### Revoke Role from User

Revoke a role from a user.

- **Endpoint:** DELETE `/admin/revoke/:userId`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).

## Parking Zones

### Create Parking Zone

Create a new parking zone. (Admin Only)

- **Endpoint:** POST `/parking-zone`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated admin token).
- **Parameters:**
  - `name` (string): The name of the parking zone.
  - `address` (string): The address of the parking zone.
  - `parkingFeePerHour` (number): The parking fee per hour (between 0 and 1000).

### Get All Parking Zones

Get a list of all parking zones.

- **Endpoint:** GET `/parking-zone`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).

### Get Parking Zone by ID

Retrieve a parking zone by its unique identifier.

- **Endpoint:** GET `/parking-zone/:id`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).

### Update Parking Zone

Update an existing parking zone. (Admin Only)

- **Endpoint:** PUT `/parking-zone/:id`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated admin token).
- **Parameters:**
  - `name` (string, optional): The updated name of the parking zone.
  - `address` (string, optional): The updated address of the parking zone.
  - `parkingFeePerHour` (number, optional): The updated parking fee per hour (between 0 and 1000).

## Parking Reservations

### Create Parking Reservation

Create a new parking reservation.

- **Endpoint:** POST `/parking-reservation`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).
- **Parameters:**
  - `startTime` (string): The start time of the reservation in ISO8601 format (e.g., "2023-09-30T14:00:00Z").
  - `endTime` (string): The end time of the reservation in ISO8601 format (e.g., "2023-09-30T15:00:00Z").
  - `userId` (string, UUID): The unique identifier of the user making the reservation.
  - `zoneId` (string, UUID): The unique identifier of the parking zone.
  - `carId` (string, UUID): The unique identifier of the user's car.
  - `durationInMinutes` (number): The duration of the reservation in minutes.
  - `parkingFeePerHour` (number): The parking fee per hour for the selected parking zone.

### Get All Parking Reservations

Get a list of user's parking reservation history.

- **Endpoint:** GET `/parking-reservation`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).

### Get Parking Reservation by ID

Retrieve a parking reservation by its unique identifier.

- **Endpoint:** GET `/parking-reservation/:id`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).

### Update Parking Reservation

Update an existing parking reservation.

- **Endpoint:** PUT `/parking-reservation/:id`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).
- **Parameters:**
  - Provide parameters for updating the reservation.

### Delete Parking Reservation

Delete an existing parking reservation.

- **Endpoint:** DELETE `/parking-reservation/:id`
- **Headers:**
  - `Authorization` (string): Bearer token (your generated token).
