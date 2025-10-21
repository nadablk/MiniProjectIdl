# 🚀 Deployment Guide - Philosophy Student Management System

## 📋 Architecture Overview

- **Your Device**: Spring Boot (Students & Universities) → `springboot.myappstore.live:8081`
- **Teammate's Device**: Django (Courses & Enrollments) → `django.myappstore.live:8081`
- **Teammate's Device**: React Frontend → `app.myappstore.live`

---

## 🌐 DNS Configuration (Already Done)

Make sure these A records are added in name.com:

| TYPE | HOST       | ANSWER             | TTL |
| ---- | ---------- | ------------------ | --- |
| A    | springboot | YOUR_PUBLIC_IP     | 300 |
| A    | django     | TEAMMATE_PUBLIC_IP | 300 |
| A    | app        | TEAMMATE_PUBLIC_IP | 300 |

**Check DNS Propagation**: https://dnschecker.org/

---

## 🔧 Setup Instructions

### **On Your Device (Spring Boot)**

#### 1. Configure Router Port Forwarding

- Login to your router (usually 192.168.1.1)
- Find "Port Forwarding" or "Virtual Server" section
- Add rule:
  - **External Port**: 8081
  - **Internal IP**: Your computer's local IP (find with `ipconfig` in cmd)
  - **Internal Port**: 8081
  - **Protocol**: TCP or Both

#### 2. Check Windows Firewall

```powershell
# Allow port 8081 through firewall
New-NetFirewallRule -DisplayName "Spring Boot API" -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow
```

#### 3. Start Spring Boot

```bash
cd Backend_spring
mvnw.cmd spring-boot:run
```

Or run from your IDE (IntelliJ/Eclipse)

#### 4. Test Access

- Local: http://localhost:8081/api/students
- Public: http://springboot.myappstore.live:8081/api/students

---

### **On Teammate's Device (Django + React)**

#### 1. Configure Router Port Forwarding

Add TWO rules:

**Rule 1 - Django API:**

- **External Port**: 8081
- **Internal IP**: Teammate's computer local IP
- **Internal Port**: 8081
- **Protocol**: TCP

**Rule 2 - React Frontend:**

- **External Port**: 80
- **Internal IP**: Same as above
- **Internal Port**: 5173 (or 80 if using nginx)
- **Protocol**: TCP

#### 2. Setup PostgreSQL Database

```bash
# Make sure PostgreSQL is running
# Create database
psql -U postgres
CREATE DATABASE CourseServiceDB;
\q
```

#### 3. Apply Django Migrations

```bash
cd backend
python manage.py migrate
```

#### 4. Start Django Server

```bash
# Run on all interfaces (0.0.0.0) to accept external connections
python manage.py runserver 0.0.0.0:8081
```

#### 5. Start React Frontend

```bash
cd Front-end

# For development (with hot reload)
npm run dev -- --host 0.0.0.0 --port 5173

# OR for production
npm run build
npx serve -s dist -p 80
```

#### 6. Test Access

- Django Local: http://localhost:8081/api/courses/
- Django Public: http://django.myappstore.live:8081/api/courses/
- Frontend Local: http://localhost:5173
- Frontend Public: http://app.myappstore.live:5173 (or :80)

---

## 🔒 Firewall Configuration

### **Your Device (Spring Boot - Windows)**

```powershell
New-NetFirewallRule -DisplayName "Spring Boot API" -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow
```

### **Teammate's Device (Django + React - Windows)**

```powershell
New-NetFirewallRule -DisplayName "Django API" -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "React Frontend" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
```

### **Teammate's Device (Django + React - Linux/Mac)**

```bash
# Ubuntu/Debian
sudo ufw allow 8081/tcp
sudo ufw allow 5173/tcp
sudo ufw enable

# Mac
sudo pfctl -f /etc/pf.conf
```

---

## ✅ Testing Checklist

### **Before Testing:**

- [ ] DNS records added and propagated (check dnschecker.org)
- [ ] Port forwarding configured on both routers
- [ ] Firewall rules added on both devices
- [ ] All services running

### **Test URLs:**

**Your Device (Spring Boot):**

```
http://springboot.myappstore.live:8081/api/students
http://springboot.myappstore.live:8081/api/universities
```

**Teammate's Device (Django):**

```
http://django.myappstore.live:8081/api/courses/
http://django.myappstore.live:8081/api/enrollments/
```

**Teammate's Device (Frontend):**

```
http://app.myappstore.live:5173
```

---

## 🐛 Troubleshooting

### **Cannot Access from External Network**

1. **Check if port forwarding works:**

   ```bash
   # From another network, test if port is open
   telnet springboot.myappstore.live 8081
   ```

2. **Check DNS propagation:**

   - Visit https://dnschecker.org/
   - Enter: `springboot.myappstore.live`
   - Should show your public IP

3. **Check firewall:**

   ```powershell
   # Windows - View firewall rules
   Get-NetFirewallRule -DisplayName "*Spring*"
   ```

4. **Verify service is running:**
   ```bash
   # Check if Spring Boot is listening
   netstat -an | findstr 8081
   ```

### **CORS Errors in Browser**

- Make sure both backends are running
- Check browser console for exact error
- Verify CORS configuration is correct
- Try accessing API directly in browser first

### **Database Connection Errors (Django)**

```bash
# Check if PostgreSQL is running
# Windows:
services.msc  # Look for PostgreSQL service

# Test connection
psql -U postgres -h localhost -p 5432
```

---

## 🎯 Production Deployment (Optional)

For better security and HTTPS support:

### **Option 1: Using Nginx (Recommended)**

**On Teammate's Device:**

1. Install Nginx
2. Configure:

```nginx
# /etc/nginx/sites-available/philosophe
server {
    listen 80;
    server_name app.myappstore.live;

    # Serve React app
    root /path/to/Front-end/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy Django API
    location /api/ {
        proxy_pass http://localhost:8081/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/philosophe /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### **Option 2: Add HTTPS with Let's Encrypt**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d app.myappstore.live -d django.myappstore.live -d springboot.myappstore.live

# Auto-renewal
sudo certbot renew --dry-run
```

Then update `api.js` to use `https://`:

```javascript
const SPRING_API_BASE_URL = "https://springboot.myappstore.live:8081/api";
const DJANGO_API_BASE_URL = "https://django.myappstore.live:8081/api";
```

---

## 📞 Quick Commands Reference

### **Start All Services:**

**Your Device (Spring Boot):**

```powershell
cd "C:\Users\DELL 7540\Desktop\mini projet IDL\Backend_spring"
.\mvnw.cmd spring-boot:run
```

**Teammate's Device (Django):**

```bash
cd backend
python manage.py runserver 0.0.0.0:8081
```

**Teammate's Device (React):**

```bash
cd Front-end
npm run dev -- --host 0.0.0.0 --port 5173
```

### **Stop Services:**

- **Spring Boot**: Ctrl+C in terminal
- **Django**: Ctrl+C in terminal
- **React**: Ctrl+C in terminal

---

## 🎉 Success Indicators

When everything is working:

1. ✅ All 3 URLs accessible from external network
2. ✅ No CORS errors in browser console
3. ✅ Can create/edit students, universities, courses, enrollments
4. ✅ Data persists across page refreshes

---

## 📝 Notes

- **DNS Changes**: Can take up to 48 hours (usually 15-30 minutes)
- **Development Mode**: Keep `npm run dev` for hot reload during development
- **Production Mode**: Use `npm run build` + nginx for deployment
- **Database Backups**: Regularly backup MySQL (Spring Boot) and PostgreSQL (Django)
- **Security**: Change default passwords before production deployment

---

## 🆘 Need Help?

Check logs for errors:

**Spring Boot:**

- Console output shows all errors
- Or check `logs/spring-boot-logger.log`

**Django:**

- Console output shows all errors
- Or check Django logs in terminal

**React:**

- Browser console (F12 → Console tab)
- Network tab shows API call failures

---

**Last Updated**: October 21, 2025
**Version**: 1.0
