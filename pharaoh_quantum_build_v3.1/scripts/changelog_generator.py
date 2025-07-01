import difflib, openai, os
from datetime import datetime

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_changelog(old_file, new_file):
    with open(old_file) as f1, open(new_file) as f2:
        diff = ''.join(difflib.unified_diff(f1.readlines(), f2.readlines()))
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": "Summarize this diff into a changelog:
" + diff}]
    )
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")
    with open(f"logs/changelog_{timestamp}.md", "w") as log:
        log.write(response.choices[0].message.content)
