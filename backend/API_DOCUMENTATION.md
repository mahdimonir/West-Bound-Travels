# West Bound Travels - Complete API Documentation

## Base URL

```
Development: http://localhost:8000/api/v1
Production: https://api.westboundtravels.com/api/v1
```

## Authentication

Most endpoints require authentication using JWT Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this structure:

**Success Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 1. Authentication Endpoints

### Register User

**POST** `/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+8801234567890" // Optional
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx123456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. User Endpoints

### Get Current User Profile

**GET** `/users/me`  
**Auth:** Required

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "clxxx123456",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+8801234567890",
    "role": "CUSTOMER",
    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User Profile

**PUT** `/users/me`  
**Auth:** Required

**Request Body:**

```json
{
  "name": "John Updated",
  "phone": "+8801234567891",
  "bio": "Travel enthusiast",
  "preferences": {
    "mealType": "Vegetarian",
    "notificationsEnabled": true
  }
}
```

### Get All Users (Admin)

**GET** `/users/admin/all`  
**Auth:** Required (Admin/Moderator)

**Query Parameters:**

- `limit` (number, optional): Number of results per page
- `offset` (number, optional): Pagination offset
- `role` (string, optional): Filter by role (CUSTOMER, MODERATOR, ADMIN)
- `search` (string, optional): Search by name or email

**Response (200):**

```json
{
  "success": true,
  "data": {
    "users": [ ... ],
    "pagination": {
      "total": 100,
      "limit": 10,
      "offset": 0
    }
  }
}
```

### Update User Role (Admin)

**PATCH** `/users/admin/{userId}/role`  
**Auth:** Required (Admin only)

**Request Body:**

```json
{
  "role": "MODERATOR"
}
```

---

## 3. Boats Endpoints

### Get All Boats

**GET** `/boats`

**Query Parameters:**

- `type` (string, optional): Filter by type (AC, NON_AC)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx123456",
      "name": "Luxury Houseboat 1",
      "type": "AC",
      "images": ["https://..."],
      "features": ["WiFi", "Kitchen", "AC"],
      "totalRooms": 7,
      "rooms": [
        {
          "type": "AC with Balcony/Attach Bath",
          "count": 4,
          "maxPax": 4,
          "attachBath": true,
          "balcony": true
        },
        {
          "type": "Couple Attach Bath",
          "count": 1,
          "maxPax": 2,
          "attachBath": true,
          "balcony": false
        }
      ],
      "description": "Premium AC houseboat with balcony rooms and attached baths",
      "isActive": true
    }
  ]
}
```

### Get Boat by ID

**GET** `/boats/{id}`

**Response (200):**

```json
{
  "success": true,
  "data": { ... }
}
```

---

## Gallery Endpoints

### List Gallery

**GET** `/gallery`

**Response (200):** list of gallery items with `id`, `src`, `alt`, `category`.

### Create Gallery Item (Admin)

**POST** `/gallery` (Auth: Admin/Moderator)

Request body:

```json
{
  "src": "https://...",
  "imageLocalPath": "<server-temp-path>",
  "alt": "...",
  "category": "boat"
}
```

### Delete Gallery Item (Admin)

**DELETE** `/gallery/{id}` (Auth: Admin/Moderator)

Deletes the gallery item and removes its image from Cloudinary.

## User Avatar

### Upload/Update Avatar

**POST** `/users/me/avatar` (Auth: Required)

Request body (JSON):

```json
{ "imageLocalPath": "<server-temp-path>", "imageUrl": "https://..." }
```

If a previous avatar exists it will be deleted from Cloudinary when replaced.

## 4. Destinations Endpoints

### Get All Destinations

**GET** `/destinations`

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx123456",
      "name": "Tanguar Haor",
      "description": "Beautiful wetland...",
      "images": ["https://..."]
    }
  ]
}
```

---

## 5. Bookings Endpoints

### Create Booking

**POST** `/bookings`  
**Auth:** Required

**Request Body:**

```json
{
  "boatId": "clxxx123456",
  "startDate": "2024-12-25T00:00:00.000Z",
  "endDate": "2024-12-27T00:00:00.000Z",
  "pax": 4,
  "roomsBooked": [
    {
      "type": "AC",
      "quantity": 2
    }
  ],
  "placesVisited": [
    "Tanguar Haor",
    "Ratargul",
    "Jaflong",
    "Srimangal",
    "Sylhet"
  ]
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "clxxx123456",
    "userId": "clxxx789012",
    "boatId": "clxxx123456",
    "startDate": "2024-12-25T00:00:00.000Z",
    "endDate": "2024-12-27T00:00:00.000Z",
    "pax": 4,
    "roomsBooked": [ ... ],
    "placesVisited": [ ... ],
    "totalPrice": "50000.00",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Invalid input or minimum stay not met
- `404`: Boat not found
- `409`: Rooms not available for selected dates

### Get My Bookings

**GET** `/bookings/my`  
**Auth:** Required

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx123456",
      "boat": {
        "name": "Luxury Houseboat 1",
        "images": ["https://..."]
      },
      "startDate": "2024-12-25T00:00:00.000Z",
      "endDate": "2024-12-27T00:00:00.000Z",
      "status": "PENDING",
      "totalPrice": "50000.00"
    }
  ]
}
```

### Get Booking by ID

**GET** `/bookings/{id}`  
**Auth:** Required

### Get All Bookings (Admin)

**GET** `/bookings/admin/all`  
**Auth:** Required (Admin/Moderator)

**Query Parameters:**

- `limit` (number, optional)
- `offset` (number, optional)
- `status` (string, optional): PENDING, CONFIRMED, PAID, CANCELLED, REFUNDED
- `userId` (string, optional): Filter by user

### Update Booking Status (Admin)

**PATCH** `/bookings/admin/{id}/status`  
**Auth:** Required (Admin/Moderator)

**Request Body:**

```json
{
  "status": "CONFIRMED",
  "message": "Booking confirmed successfully" // Optional
}
```

---

## 6. Reviews Endpoints

### Get Reviews by Boat

**GET** `/reviews/boat/{boatId}`

**Query Parameters:**

- `limit` (number, optional)
- `offset` (number, optional)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "clxxx123456",
        "rating": 5,
        "comment": "Amazing experience!",
        "user": {
          "name": "John Doe",
          "avatar": "https://..."
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "averageRating": 4.5,
    "pagination": {
      "total": 20,
      "limit": 10,
      "offset": 0
    }
  }
}
```

### Create Review

**POST** `/reviews`  
**Auth:** Required

**Request Body:**

```json
{
  "bookingId": "clxxx123456",
  "rating": 5,
  "comment": "Amazing experience! Highly recommended."
}
```

**Requirements:**

- Booking must belong to the user
- Booking status must be CONFIRMED or PAID
- Only one review per booking

### Get My Reviews

**GET** `/reviews/me`  
**Auth:** Required

### Update Review

**PUT** `/reviews/{id}`  
**Auth:** Required

**Request Body:**

```json
{
  "rating": 4, // Optional
  "comment": "Updated comment" // Optional
}
```

### Delete Review

**DELETE** `/reviews/{id}`  
**Auth:** Required

---

## 7. Notifications Endpoints

### Get Unread Notifications

**GET** `/notifications`  
**Auth:** Required

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx123456",
      "title": "Booking Confirmed",
      "message": "Your booking has been confirmed",
      "read": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 8. Static Pages Endpoints

### Get All Static Pages

**GET** `/static`

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx123456",
      "slug": "about-us",
      "title": "About Us",
      "lastUpdated": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Static Page by Slug

**GET** `/static/{slug}`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "clxxx123456",
    "slug": "about-us",
    "title": "About Us",
    "content": "<h1>About West Bound Travels</h1><p>...</p>",
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Static Page (Admin)

**POST** `/static`  
**Auth:** Required (Admin/Moderator)

**Request Body:**

```json
{
  "slug": "privacy-policy",
  "title": "Privacy Policy",
  "content": "<h1>Privacy Policy</h1><p>...</p>"
}
```

### Update Static Page (Admin)

**PUT** `/static/{slug}`  
**Auth:** Required (Admin/Moderator)

**Request Body:**

```json
{
  "title": "Updated Title", // Optional
  "content": "<p>Updated content</p>" // Optional
}
```

### Delete Static Page (Admin)

**DELETE** `/static/{slug}`  
**Auth:** Required (Admin only)

---

## 9. Contact Endpoints

### Submit Contact Form

**POST** `/contact`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+8801234567890", // Optional
  "message": "I would like to know more about your services."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Your message has been sent successfully. We will get back to you soon!"
}
```

---

## 10. Payments Endpoints

### Initiate bKash Payment

**POST** `/payments/bkash/initiate`  
**Auth:** Required

**Request Body:**

```json
{
  "bookingId": "clxxx123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "paymentId": "bkash_1234567890_clxxx123456",
    "paymentUrl": "http://localhost:3000/payment/bkash?paymentId=...",
    "amount": 50000,
    "currency": "BDT"
  }
}
```

### Initiate SSLCommerz Payment

**POST** `/payments/sslcommerz/initiate`  
**Auth:** Required

**Request Body:**

```json
{
  "bookingId": "clxxx123456"
}
```

### Verify Payment

**GET** `/payments/verify/{paymentId}`  
**Auth:** Required

**Response (200):**

```json
{
  "success": true,
  "data": {
    "paymentId": "bkash_1234567890_clxxx123456",
    "paymentMethod": "bkash",
    "status": "PAID",
    "amount": 50000,
    "bookingId": "clxxx123456"
  }
}
```

### Get Payment History

**GET** `/payments/history`  
**Auth:** Required

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx123456",
      "paymentId": "bkash_1234567890",
      "paymentMethod": "bkash",
      "status": "PAID",
      "totalPrice": "50000.00",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "boat": {
        "name": "Luxury Houseboat 1"
      }
    }
  ]
}
```

### Payment Callback (Webhook)

**POST** `/payments/callback`

**Request Body:**

```json
{
  "paymentId": "bkash_1234567890_clxxx123456",
  "status": "success",
  "transactionId": "TXN123456",
  "amount": 50000
}
```

**Note:** This endpoint is called by payment gateways. In production, verify the webhook signature.

---

## Error Codes

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| 200         | Success                                              |
| 201         | Created                                              |
| 400         | Bad Request - Invalid input                          |
| 401         | Unauthorized - Missing or invalid token              |
| 403         | Forbidden - Insufficient permissions                 |
| 404         | Not Found - Resource doesn't exist                   |
| 409         | Conflict - Resource conflict (e.g., booking overlap) |
| 500         | Internal Server Error                                |

---

## Rate Limiting

- **General API:** 100 requests per 15 minutes per IP
- **Authentication:** 5 requests per 15 minutes per IP
- **Payments:** 10 requests per hour per IP
- **Contact Form:** 3 requests per hour per IP

Rate limit headers are included in responses:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets

---

## Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:8000/api/v1/api-docs
```

---

## Testing with cURL

### Register User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Booking (with auth)

```bash
curl -X POST http://localhost:8000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "boatId": "clxxx123456",
    "startDate": "2024-12-25T00:00:00.000Z",
    "endDate": "2024-12-27T00:00:00.000Z",
    "pax": 4,
    "roomsBooked": [{"type": "AC", "quantity": 2}],
    "placesVisited": ["Tanguar Haor", "Ratargul", "Jaflong", "Srimangal", "Sylhet"]
  }'
```

---

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Handle errors gracefully** - Check `success` field in responses
3. **Use pagination** for list endpoints to avoid large payloads
4. **Validate input** on client side before sending requests
5. **Store tokens securely** - Never expose JWT tokens in client-side code
6. **Handle rate limits** - Implement retry logic with exponential backoff
7. **Use HTTPS in production** - Never send sensitive data over HTTP
