from pydantic import BaseModel
from typing import Optional

class ResearchReq(BaseModel):
    prompt: str
    depth: str

class SaveReportRequest(BaseModel):
    report: str
    topic: Optional[str] = None
    depth: Optional[str] = None

class AskRequest(BaseModel):
    question: str
    topic: Optional[str] = None
    depth: Optional[str] = None
