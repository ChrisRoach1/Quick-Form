# AI Google Form Generator API Documentation

## Overview

The AI Google Form Generator API is an AI-powered service that automatically generates Google Forms from text content. The API analyzes your provided text and creates a comprehensive quiz or assessment form with multiple question types including fill-in-the-blank, multiple choice, and yes/no questions.

---

## ⚠️ Important Notes

### Processing Time
**This API performs complex operations and may take 30-120 seconds to complete**. The generation process involves:
- AI-powered content analysis
- Question generation and verification
- Google Form creation
- Multiple API calls to Google's Forms API

**Recommendation**: This endpoint is best consumed as a **background task** or **asynchronous job** in your application. Consider implementing:
- Queue-based processing
- Webhook callbacks for completion notifications
- Long-polling or WebSocket connections for status updates
- Client-side loading states with appropriate timeout handling

### Google Access Token Requirements
The `Google_Access_Token` header **must be a valid OAuth 2.0 access token** obtained from Google with the following requirements:

- **Required Scope**: `https://www.googleapis.com/auth/forms.body` (or broader Forms API access)
- **Token Type**: OAuth 2.0 Bearer Access Token
- **Permissions**: The token must grant permission to **create and modify Google Forms**
- **User Context**: The token represents the Google account that will own the created form

**How to obtain a valid token**:
1. Use Google's OAuth 2.0 flow to authenticate users
2. Request the `https://www.googleapis.com/auth/forms.body` scope
3. Receive the access token from Google's authorization server
4. Pass the access token in the `Google_Access_Token` header

**Note**: This is NOT a Google API key or service account key. It must be a user-specific access token with active Form creation permissions.

---

## Authentication

This API uses RapidAPI's standard authentication mechanism. The `X-RapidAPI-Proxy-Secret` header is automatically handled by RapidAPI and does not require manual configuration by API consumers.

Additionally, you must provide a valid Google OAuth access token for Form creation.

---

## Endpoint

### Generate Form

**POST** `/generatedForm`

Generates a Google Form from provided text content using AI-powered question generation.

#### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Google_Access_Token` | string | **Yes** | Valid Google OAuth 2.0 access token with Forms API permissions (`https://www.googleapis.com/auth/forms.body` scope). This token must grant permission to create and modify Google Forms. |
| `Content-Type` | string | **Yes** | Must be `application/json` or `application/x-www-form-urlencoded` |

#### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text_content` | string | **Yes** | The source text content from which questions will be generated. This can be educational material, articles, documentation, or any text you want to create a quiz from. Longer, more detailed content typically yields better results. |
| `prompt_instructions` | string | No | Additional instructions or context for the AI to consider when generating questions. Examples: "Focus on key concepts", "Create beginner-level questions", "Emphasize practical applications", "Generate questions suitable for college students". If not provided, the AI will use default question generation logic. |
| `external_id` | string (UUID) | No | An optional UUID identifier that you can provide to track this form generation in your own system. For example: Associating all generated forms with a specific user. Must be a valid UUID format (e.g., `550e8400-e29b-41d4-a716-446655440000`). |

#### Request Example

```bash
curl --request POST \
  --url https://YOUR-RAPIDAPI-HOST/api/generatedForm \
  --header 'Content-Type: application/json' \
  --header 'Google_Access_Token: ya29.a0AfH6SMBx...' \
  --data '{
    "text_content": "Photosynthesis is the process by which plants use sunlight, water and carbon dioxide to create oxygen and energy in the form of sugar. This process is essential for life on Earth as it provides oxygen for living organisms and is the foundation of most food chains.",
    "prompt_instructions": "Create questions suitable for high school biology students. Focus on understanding the process and its importance.",
    "external_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

#### Response Format

##### Success Response (200 OK)

```json
{
  "formUrl": "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `formUrl` | string | The public URL of the generated Google Form. This URL can be shared with respondents to complete the form. |

##### Error Response (400 Bad Request)

```json
{
  "status": false,
  "message": "The text content field is required."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | boolean | Always `false` for validation errors |
| `message` | string | Validation error message describing which field failed validation |

**Common validation errors:**
- `"The text content field is required."` - Missing or empty `text_content`
- `"The text content must be a string."` - Invalid data type for `text_content`
- `"The prompt instructions must be a string."` - Invalid data type for `prompt_instructions`
- `"The external id must be a valid UUID."` - `external_id` is not in valid UUID format

##### Error Response (401 Unauthorized)

```json
{
  "error": "unauthorized"
}
```

Returned when the RapidAPI authentication fails.

##### Error Response (500 Internal Server Error)

```json
{
  "error": "Error message describing what went wrong"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `error` | string | Detailed error message explaining the failure reason |

---

## Response Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success - Form created successfully, returns form URL |
| `400` | Bad Request - Validation failed (missing required fields or invalid data format) |
| `401` | Unauthorized - Invalid or missing RapidAPI authentication |
| `500` | Internal Server Error - Form generation failed (includes error message) |

---

## Best Practices

### 1. Input Validation
- Always validate that `text_content` is provided and not empty before making the API call
- If using `external_id`, ensure it's a valid UUID v4 format
- `prompt_instructions` is optional - omit if you don't have specific requirements

### 2. Content Quality
- Provide well-structured, coherent text content
- Include sufficient detail for meaningful question generation
- Ensure the content has clear concepts, facts, or processes to test

### 3. Prompt Instructions
- Be specific about the target audience (e.g., "high school students", "professionals")
- Specify difficulty level preferences
- Mention any specific topics to emphasize or avoid

### 4. Error Handling
- Implement comprehensive error handling in your application
- Handle 400 validation errors separately from 500 server errors
- Set appropriate timeout values (recommended: 180 seconds minimum)
- Log errors for debugging and monitoring

### 5. External ID Usage
- Use `external_id` to correlate generated forms with your internal systems
- Store the UUID in your database before making the API call
- This allows you to track which forms were generated for which requests/users

### 6. Performance Optimization
- Process requests asynchronously or in background jobs
- Implement retry logic with exponential backoff for transient failures
- Consider caching or storing generated forms to avoid regeneration

### 7. Token Management
- Implement token refresh logic for expired Google access tokens
- Store tokens securely
- Handle token expiration gracefully with user re-authentication prompts

---

## Rate Limiting

Rate limiting is managed by RapidAPI based on your subscription tier. Please refer to your RapidAPI plan for specific rate limits.

**Note**: Due to the long processing time of this endpoint, aggressive rate limiting is less of a concern, but be mindful of:
- Google Forms API quotas (typically 600 requests per minute per user)
- AI service rate limits
- Overall system load

---

## Support & Questions

For API-related questions or issues:
- Check the error message returned in the response
- For 400 errors, verify all required fields are provided with correct data types
- For UUID errors, ensure `external_id` follows UUID v4 format
- Verify your Google access token is valid and has the correct permissions
- Ensure your text content is substantial and well-formatted
- Confirm your timeout settings allow for long processing times (120+ seconds)

---

## Changelog

### Version 1.0
- Initial API release
- Support for fill-in-the-blank, multiple choice, and yes/no questions
- AI-powered question generation and verification
- Automatic form description generation

