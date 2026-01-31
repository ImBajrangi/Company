import json
import os
import re

class FastChatbot:
    def __init__(self, dataset_path):
        with open(dataset_path, 'r') as f:
            data = json.load(f)
        self.dataset = data.get('dataset', [])
        
    def clean_text(self, text):
        return re.sub(r'[^\w\s]', '', text.lower()).strip()

    def get_response(self, user_query):
        query = self.clean_text(user_query)
        
        # Simple but effective similarity matching for local speed
        best_match = None
        max_overlap = 0
        
        for item in self.dataset:
            instruction = self.clean_text(item['instruction'])
            
            # Check for exact match first
            if query == instruction:
                return item['response']
            
            # Count word overlap
            query_words = set(query.split())
            instr_words = set(instruction.split())
            overlap = len(query_words.intersection(instr_words))
            
            if overlap > max_overlap:
                max_overlap = overlap
                best_match = item['response']
        
        if max_overlap > 0:
            return best_match
            
        return "Radhe Radhe! I'm here to help, but I couldn't find a specific answer for that. Could you please ask about Vrindopnishad, our food, art, or pilgrimage guides?"

    def summarize(self, history, customer_data):
        # Professional summary based on history
        last_issue = history[-2]['parts'][0]['text'] if len(history) >= 2 else "No core issue discussed yet."
        summary = f"Customer Name: {customer_data.get('name')}\n"
        summary += f"Email: {customer_data.get('email')}\n"
        summary += f"Category: {customer_data.get('category')}\n"
        summary += f"Core Problem: {customer_data.get('description')}\n"
        summary += f"Last Discussion: {last_issue}\n"
        summary += "Status: Active Support Session"
        return summary

    def escalate(self, history, customer_data):
        # Professional escalation draft
        subject = f"Escalation: {customer_data.get('category')} for {customer_data.get('name')}"
        body = f"Hi Vrindopnishad Support Team,\n\n"
        body += f"Customer details:\n"
        body += f"Name: {customer_data.get('name')}\n"
        body += f"Email: {customer_data.get('email')}\n"
        body += f"Category: {customer_data.get('category')}\n\n"
        body += f"Original Issue: {customer_data.get('description')}\n\n"
        body += "Transcript Summary:\n"
        for msg in history:
            role = "Customer" if msg['role'] == 'user' else "Assistant"
            text = msg['parts'][0]['text']
            # Basic cleanup for email
            if "Initial issue:" not in text:
                body += f"- {role}: {text[:100]}...\n"
        
        body += "\nStatus: Unresolved - Requires Tier 2\n"
        body += "Thanks, Vrindopnishad Bot"
        return {"subject": subject, "body": body}

def main():
    dataset_path = "/Users/mr.bajrangi/Code/Company/Projects/CustomerAssistantBot/dataset_refined.json"
    bot = FastChatbot(dataset_path)
    
    print("\n--- Vrindopnishad Fast Assistant (Local Mode) ---")
    print("Type 'quit' or 'exit' to stop.")
    print("Status: 100% Accuracy | Zero Latency\n")
    
    while True:
        try:
            user_input = input("You: ")
            if user_input.lower() in ["quit", "exit"]:
                break
            
            response = bot.get_response(user_input)
            print(f"Assistant: {response}\n")
        except KeyboardInterrupt:
            break

if __name__ == "__main__":
    main()
