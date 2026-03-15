## Contributors
- @_justParrot  
- @bobmat2011  
- @guigui0246  

---

## API Overview
Our API is deployed via Cloudflare Workers:  
`https://bigstone-api.justparrot.workers.dev`

> **Note:** The API only accepts requests from our website or `localhost:8787`.

---

## Projects Endpoint: `/projects/`

### Create a Project (POST)
**Request Body:**  
```json
{
  "name": "PROJECT NAME",
  "desc": "DESCRIPTION"
}
```

**Example Fetch Request:**
```javascript
fetch('https://bigstone-api.justparrot.workers.dev/projects/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'My Project', desc: 'Project description' })
})
  .then(res => res.json())
  .then(data => {
    console.log("Full Response:", data);
    console.log("Project ID:", data.id);
  })
  .catch(err => console.error("Error:", err));
```
