# Deploy Checklist: Niche Profit Scanner

1. **Create Repo**: Create `niche-profit-scanner` on GitHub.
2. **Push Code**:
   ```bash
   cd niche-scanner
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/niche-profit-scanner.git
   git push -u origin main
   ```
3. **Vercel**: Import Project.
4. **Env Vars**: Add `OPENAI_API_KEY`, `BREVO_API_KEY`, `BREVO_LIST_ID` (e.g. 3).
