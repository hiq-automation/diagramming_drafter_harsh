# API Change Request: Fetch Component by Title

## Goal
To allow dynamic resolution of component IDs based on their business title, avoiding hardcoded IDs in the frontend.

## Proposed Endpoint

### `GET /app-builder/components/by-title`

**Summary**: Fetch component by title
**Description**: Retrieves the component record matching the provided title string.

**Parameters**:
- `title` (query, string, required): The business title of the component (e.g., "HARSH_DIAGRAM_PROMPT").

**Responses**:
- `200 OK`: Component found.
  - Content: `application/json`
  - Body: `ProjectComponent` object.
- `404 Not Found`: No component found with the matching title.
- `400 Bad Request`: Missing title parameter.
