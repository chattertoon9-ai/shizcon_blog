import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, ExternalLink, Play, Sparkles } from 'lucide-react';
import { BloggerSettings, GenerationConfig } from '../types';

interface PythonScriptModalProps {
  config: GenerationConfig;
  settings: BloggerSettings;
  onClose: () => void;
}

export const PythonScriptModal: React.FC<PythonScriptModalProps> = ({
  config,
  settings,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const pythonScript = `"""
BytePulse News & Blogger Auto-Publisher
Generated from BytePulse AI Studio
Uses Gemini 3.8 Flash with exponential backoff & Google Blogger API v3
"""

import os
import time
from google import genai
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

def generate_unique_news_post(angle: str):
    text_response = None
    max_retries = ${config.maxRetries}
    backoff_factor = ${config.backoffFactor}  # Wait time to resolve 503 / high load
    model_name = 'gemini-3.8-flash'

    print(f"Trying with model: {model_name}")
    for attempt in range(1, max_retries + 1):
        try:
            client = genai.Client()
            is_health = any(k in angle.lower() for k in ['health', 'wellness', 'nutrition', 'diet', 'sleep', 'stress', 'gut', 'habit', 'symptom', 'disease', 'fatigue', 'immunity'])
            role = "health, wellness, and medical science journalist" if is_health else "technology and software engineering journalist"
            prompt = (
                f"You are a premier {role} for BytePulse.\\n"
                f"Generate a detailed, publication-ready news or guide post for Google Blogger.\\n"
                f"Angle: {angle}\\n"
                f"Tone: ${config.tone}\\n"
                f"Requirements:\\n"
                f"- A catchy, SEO-friendly headline on the first line\\n"
                f"- An optimized 160-character SEO description following the title\\n"
                f"- Clean HTML markup with <h2>, <h3>, <p>, <blockquote>, and <ul><li>\\n"
                f"- Target length: ${config.targetWordCount} words\\n"
                f"{'- Include actionable daily health tips and warning signs to monitor\\n' if is_health else ''}"
            )

            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            
            if response and hasattr(response, 'text') and response.text:
                text_response = response.text
                print(f"Successfully generated content using {model_name} on attempt {attempt}")
                return text_response
                
        except Exception as e:
            print(f"Model {model_name} - Attempt {attempt} failed with error: {e}")
            if attempt < max_retries:
                sleep_time = backoff_factor * attempt
                print(f"Waiting {sleep_time} seconds before retry...")
                time.sleep(sleep_time)
            else:
                print(f"Model {model_name} max retries reached.")

    if not text_response:
        print("Warning: Model is currently experiencing high demand. Please try again later.")
        return None

    return text_response

def publish_to_blogger(title: str, content: str, is_draft: bool = ${settings.isDraftDefault ? 'True' : 'False'}):
    try:
        # Load credentials from environment or configured tokens
        refresh_token = os.environ.get("REFRESH_TOKEN", "${settings.refreshToken || ''}")
        client_id = os.environ.get("CLIENT_ID", "${settings.clientId || ''}")
        client_secret = os.environ.get("CLIENT_SECRET", "${settings.clientSecret || ''}")
        blog_id = os.environ.get("BLOG_ID", "${settings.blogId || ''}")

        if not blog_id:
            print("Error: BLOG_ID environment variable not set.")
            return

        creds = Credentials(
            token=None,
            refresh_token=refresh_token,
            client_id=client_id,
            client_secret=client_secret,
            token_uri="https://oauth2.googleapis.com/token"
        )
        
        blogger_service = build('blogger', 'v3', credentials=creds)
        
        body = {
            'kind': 'blogger#post',
            'title': title,
            'content': content,
            'labels': ['BytePulse', 'Engineering', 'Tech']
        }
        
        request = blogger_service.posts().insert(
            blogId=blog_id, 
            body=body,
            isDraft=is_draft
        )
        result = request.execute()
        print(f"Post published successfully! URL: {result.get('url')}")
        print(f"Post ID: {result.get('id')}")
        return result
        
    except Exception as e:
        print(f"Failed to publish to Blogger: {e}")
        return None

if __name__ == "__main__":
    angle = "${config.angle.replace(/"/g, '\\"')}"
    print("=" * 60)
    print("BytePulse Automated News & Blogger Publisher")
    print(f"Angle: {angle}")
    print("=" * 60)

    print("Generating post content with Gemini 3.8 Flash...")
    post_content = generate_unique_news_post(angle)
    
    if post_content:
        # Extract title from first line if formatted as heading
        lines = post_content.strip().split('\\n')
        title = lines[0].replace('#', '').strip() if lines else "BytePulse News Update"
        if len(title) > 90:
            title = "BytePulse News: " + angle[:60]

        print(f"Target Title: {title}")
        print("Publishing to Blogger...")
        publish_to_blogger(title, post_content)
    else:
        print("Skipping publish due to empty content.")
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([pythonScript], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bytepulse_publisher.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Standalone Python Script (.py)</h2>
            <p className="text-xs text-slate-400">
              Your Python script with updated angle, Gemini 3.8 Flash settings, and Blogger API integration
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-sm font-medium px-2 py-1"
        >
          ✕
        </button>
      </div>

      {/* Script setup instructions */}
      <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl mb-4 text-xs text-slate-300 space-y-1.5">
        <div className="font-semibold text-white flex items-center gap-1.5">
          <Play className="w-3.5 h-3.5 text-cyan-400" />
          How to run locally:
        </div>
        <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-cyan-300 overflow-x-auto">
          pip install google-genai google-auth google-auth-oauthlib google-api-python-client
        </div>
        <div className="text-slate-400 text-[11px]">
          Set environment variables: <code>export GEMINI_API_KEY="your-key" BLOG_ID="your-id" REFRESH_TOKEN="..." CLIENT_ID="..." CLIENT_SECRET="..."</code>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative">
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 backdrop-blur-sm transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Python Code'}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download .py
          </button>
        </div>

        <pre className="p-4 pt-12 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto max-h-[460px] leading-relaxed">
          {pythonScript}
        </pre>
      </div>
    </div>
  );
};
