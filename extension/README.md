# VeriScope — Browser Extension (Manifest V3)

VeriScope is an editorial-grade proof desk extension that enables one-click fact-checking and claim verification on any active webpage without manually copying or pasting URLs.

---

## Capabilities
1. **One-Click Active Tab Scanning**: Extracts article headline, author byline, publication timestamp, domain, and body text directly from the active DOM.
2. **Claim-Level Fact Verification**: Splits the story into factual claims (English and Gujarati) and queries live public knowledge archives (Wikipedia, DuckDuckGo, Fact-Check registries).
3. **In-Page Highlighting**: Underlines supported and contradicted claims directly on the original article.
4. **Full Proof Desk Link**: One click opens the comprehensive evidence scorecard at `http://localhost:5173/result/:id`.

---

## How to Install in Chrome / Edge / Brave

1. Open your browser and navigate to:
   - **Chrome**: `chrome://extensions`
   - **Edge**: `edge://extensions`
   - **Brave**: `brave://extensions`
2. Enable **Developer mode** (toggle switch in the top-right corner).
3. Click the **Load unpacked** button.
4. Select the `extension` folder located inside this project:
   ```
   d:\B-Tech\SEM 7\fake news\extension
   ```
5. The **VeriScope** icon will appear in your browser toolbar. Pin it for quick access!

---

## Usage Workflow
1. Ensure the VeriScope backend is running on `http://localhost:5000` (`npm run server`).
2. Open any news article or website in Chrome.
3. Click the **VeriScope** extension icon.
4. Click **"Scan Current Page"**.
5. Inspect the immediate claim verdicts, and click **"Open Full Proof Report ↗"** to see citations, domain transparency, and source independence.
