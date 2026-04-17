`templates/` contains all plan chunks.
`templates.txt` contains the baseline section ordering per plan type.

## Run

- `cp .env.example .env` and set the LLM variables you use (never commit `.env`; it is gitignored)
- `npm install`
- `npm start`
- Open `http://localhost:8000` (generator) or `http://localhost:8000/library.html` (read-only catalog of all template bundles)

## AI Preview (LLM)

The server loads `.env` automatically via [dotenv](https://github.com/motdotla/dotenv). You can also export variables in your shell instead of using a file.

**Backend selection**

- `LLM_BACKEND` — `gemini` (default) or `openai_compatible` for any server that exposes OpenAI-style `POST /v1/chat/completions` (e.g. [Ollama](https://ollama.com/) at `http://127.0.0.1:11434/v1`, LM Studio).

**When using Google Gemini** (`LLM_BACKEND=gemini` or unset)

- `GEMINI_API_KEY` (required)
- `GEMINI_MODEL` (optional, default: `gemini-2.5-pro`)

**When using a local / OpenAI-compatible API** (`LLM_BACKEND=openai_compatible`)

- `OPENAI_COMPATIBLE_BASE_URL` — base URL including `/v1`, e.g. `http://127.0.0.1:11434/v1`
- `OPENAI_COMPATIBLE_MODEL` — model name as shown by your runner (e.g. `qwen3`, `qwen3:latest`)
- `OPENAI_COMPATIBLE_API_KEY` — optional; omit or use a placeholder for Ollama; LM Studio may require a key
- `OPENAI_COMPATIBLE_JSON_MODE` — optional; default `true` (sends `response_format: json_object`). Set to `false` if your server rejects that field.

**Shared**

- `LLM_TIMEOUT_MS` — optional request timeout in ms (defaults: **120000** for `openai_compatible`, **20000** for Gemini). Local models often need a higher value on cold start or large prompts.
- `ENABLE_AI_PREVIEW` (optional, default: `true`)
- `PLAN_API_TOKEN` (optional bearer token for API auth)

Local models may have **smaller context windows** than cloud Gemini. If requests fail or truncate, narrow integration/event options in the UI or use a runner / quant with enough context for your template bundle.

When **AI Assist (Preview)** is enabled in the UI, the app calls `POST /api/plan/generate` and requests a structured JSON plan from the configured backend, then validates it against canonical section order rules.