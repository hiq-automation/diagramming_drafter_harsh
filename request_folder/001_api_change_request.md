# API Change Request: Message Persistence

## Status
Pending

## Requirement
As specified in REQ_ID: 3135, all sent and received messages in the architecture architect tool must be stored in the database, indexed by sender, recipient, and timestamp to ensure message durability.

## Proposed Endpoints

### POST /api/messages
Store a new message.
- **Body**: `{ sender: string, recipient: string, content: string, type: 'user' | 'ai', metadata?: any }`

### GET /api/messages
Retrieve message history.
- **Query Params**: `sender`, `recipient`, `limit`, `offset`

## Justification
Ensures architectural decisions and prompt history are preserved for audit and collaborative review.

## Reference
Current specs in `References/` do not provide a generic message storage endpoint.
