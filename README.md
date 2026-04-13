`templates/` contains all plan chunks.
`templates.txt` contains the baseline section ordering per plan type.

## Run

- `npm start`
- Open `http://localhost:8000`

## AI Preview (Gemini)

Set these environment variables before running the server:

- `GEMINI_API_KEY` (required for AI mode)
- `GEMINI_MODEL` (optional, default: `gemini-2.5-pro`)
- `ENABLE_AI_PREVIEW` (optional, default: `true`)
- `PLAN_API_TOKEN` (optional bearer token for API auth)

When **AI Assist (Preview)** is enabled in the UI, the app calls `POST /api/plan/generate` and requests a structured JSON plan generated via Gemini and validated against canonical section order rules.