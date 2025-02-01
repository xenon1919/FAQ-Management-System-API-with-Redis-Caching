# FAQ Management System API with Redis Caching


## Description

This repository contains a simple **FAQ Management System API** built with **Node.js**, **Express.js**, **MongoDB**, and **Redis**. The system allows creating, updating, retrieving, and deleting frequently asked questions (FAQs) with multi-language support. Redis is used to cache FAQ data for faster retrieval.

## Features

- **Create, Update, Delete, and Retrieve FAQs** with multi-language support.
- **Redis Caching** for faster access to FAQs.
- **Multi-Language Support** for FAQs (English and Hindi in this case).
- **MongoDB** as the primary database for storing FAQ data.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **API Testing**: Postman

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/yourusername/faq-management-system.git
cd faq-management-system
```
## Configuration:

- The API is connected to MongoDB running on `localhost:27017/faq_db`.
- Redis should be running locally on the default port `6379`.

## API Endpoints

### 1. **Create FAQ**

- **Method**: `POST`
- **Endpoint**: `/api/faqs`
- **Request Body**:
  
```json
{
  "question": {
    "en": "What is Redis?",
    "hi": "Redis क्या है?"
  },
  "answer": {
    "en": "Redis is an in-memory data structure store.",
    "hi": "Redis एक इन-मेमोरी डेटा संरचना संग्रहण है।"
  }
}
```

- **Response**:
  - **Status**: 201 Created
  - **Response Body**: Created FAQ with ID and language details.

### 2. **Get FAQ by ID (With Language Support)**

- **Method**: `GET`
- **Endpoint**: `/api/faqs/:id?lang=hi`
- **Parameters**: `id` (FAQ ID), `lang` (language code: `en` or `hi`).
- **Response**:
  - **Status**: 200 OK
  - **Response Body**: FAQ data in the requested language.

### 3. **Update FAQ**

- **Method**: `PUT`
- **Endpoint**: `/api/faqs/:id`
- **Request Body**:
  
```json
{
  "question": {
    "en": "What is Redis? Updated",
    "hi": "Redis क्या है? अपडेटेड"
  },
  "answer": {
    "en": "Redis is an in-memory data structure store. Updated",
    "hi": "Redis एक इन-मेमोरी डेटा संरचना संग्रहण है। अपडेटेड"
  }
}
```

- **Response**:
  - **Status**: 200 OK
  - **Response Body**: Updated FAQ with new data.

### 4. **Delete FAQ**

- **Method**: `DELETE`
- **Endpoint**: `/api/faqs/:id`
- **Response**:
  - **Status**: 200 OK
  - **Response Body**: Confirmation message (FAQ deleted successfully).

### 5. **Get All FAQs**

- **Method**: `GET`
- **Endpoint**: `/api/faqs`
- **Response**:
  - **Status**: 200 OK
  - **Response Body**: Array of all FAQs in the system.

## Redis Caching

This application uses Redis to cache FAQ data for faster retrieval. When a FAQ is retrieved, the system first checks Redis for the requested FAQ. If it doesn't exist in Redis, it fetches it from MongoDB and stores it in Redis for future requests.

### Redis Commands:

- **Check if FAQ is in cache**:

```bash
redis-cli GET faq_translation_<id>_<lang>
```

- **Set FAQ in Redis**:

```bash
redis-cli SET faq_translation_<id>_<lang> "<faq_data>"
```

## API Testing with Postman

To test the API, you can use Postman to make requests to the endpoints. Here are a few example requests:

- **POST /api/faqs**: Create a new FAQ with a request body.
- **GET /api/faqs/:id?lang=hi**: Retrieve an FAQ by ID with language support.
- **PUT /api/faqs/:id**: Update an existing FAQ.
- **DELETE /api/faqs/:id**: Delete an FAQ.
- **GET /api/faqs**: Retrieve all FAQs.

## Running the Project

1. **Start the MongoDB server** (if not running):

```bash
mongod
```

2. **Start the Redis server** (if not running):

```bash
redis-server
```

3. **Start the application**:

```bash
npm start
```

This will start the API on `http://localhost:5000`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
