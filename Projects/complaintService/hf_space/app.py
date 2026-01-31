from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from assistant import FastChatbot
import os

app = FastAPI()

# Enable CORS for local HTML development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the chatbot with the refined dataset
current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(current_dir, "dataset_refined.json")
bot = FastChatbot(dataset_path)

@app.get("/")
async def root():
    return {"status": "online", "message": "Vrindopnishad Assistant API is running on Hugging Face."}

class ChatRequest(BaseModel):
    query: str
    history: list = None
    customer_data: dict = None

class ChatResponse(BaseModel):
    response: str
    subject: str = None

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response_text = bot.get_response(request.query)
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize", response_model=ChatResponse)
async def summarize_endpoint(request: ChatRequest):
    try:
        summary = bot.summarize(request.history, request.customer_data)
        return ChatResponse(response=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/escalate", response_model=ChatResponse)
async def escalate_endpoint(request: ChatRequest):
    try:
        result = bot.escalate(request.history, request.customer_data)
        return ChatResponse(response=result['body'], subject=result['subject'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
