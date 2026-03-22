# GDPR Audit / Compliance Notes

Project: Bigstone Database 

Date: 2026-03-22  

## Personal Data Stored
- `username` (account identifier)  
- `password_hash` (hashed with bcrypt)  
- Projects/components tied to user ID  
- `cmpnt_creations` counter  

## Security Measures
- Passwords hashed with bcrypt  
- JWT tokens last 1 hour, minimal exposure  
- HTTPS enforced (GitHub Pages + Cloudflare)  

## GDPR Compliance Steps
1. Right to access: `GET /users/me/export` implemented  
2. Right to delete: `DELETE /users/me` implemented, cascades through DB  
3. Transparency: Privacy Policy page created (`/privacy.html`)  
4. Consent: Sign-up notice informs users what data is stored  
5. Data minimization: Only store what’s necessary for functionality  
6. Third-party processors: GitHub Pages (frontend), Cloudflare D1 (database)  
7. Retention: No backups; deleted accounts removed permanently  

## Notes
- No IPs, emails, analytics, or behavioral tracking collected  
- All personal data deletions are final due to **lack of backups**
- Document stored here as a record of GDPR compliance steps taken
