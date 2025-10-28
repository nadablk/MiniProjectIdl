# 🎯 Quick IP Change Reference Card

## When Network Changes → Change These Files:

### 1️⃣ Frontend IP Configuration

**File:** `Front-end/src/config/apiConfig.js`
**Line:** ~13

```javascript
export const NETWORK_CONFIG = {
  GATEWAY_HOST: "192.168.117.225", // 🔧 CHANGE THIS
  GATEWAY_PORT: 8080,
};
```

### 2️⃣ Gateway Backend URLs

**File:** `Gateaway/src/main/resources/application.properties`
**Lines:** ~22-25

```properties
# Spring Boot Backend
spring.backend.url=http://localhost:8081  # 🔧 CHANGE if Spring Boot moved

# Django Backend
django.backend.url=http://localhost:9090  # 🔧 CHANGE if Django moved
```

---

## 🔍 How to Find Your IP Address:

### Windows:

```powershell
ipconfig
```

Look for: **IPv4 Address**

### Mac/Linux:

```bash
ifconfig
```

Look for: **inet** address

---

## ✅ After Changes:

1. **Frontend:** Just refresh browser (no rebuild needed)
2. **Gateway:** Restart with `mvn spring-boot:run`
3. **Test:** Open `http://YOUR_GATEWAY_IP:8080` in browser

---

## 📞 Common Scenarios:

| Scenario                 | GATEWAY_HOST  | spring.backend.url      | django.backend.url      |
| ------------------------ | ------------- | ----------------------- | ----------------------- |
| **All on same PC**       | `localhost`   | `http://localhost:8081` | `http://localhost:9090` |
| **Frontend on other PC** | `192.168.x.x` | `http://localhost:8081` | `http://localhost:9090` |
| **All on different PCs** | Gateway's IP  | Spring Boot's IP:8081   | Django's IP:9090        |

---

## 🚀 Current Setup:

- **Gateway IP:** `192.168.117.225` (change in `apiConfig.js`)
- **Spring Boot:** `localhost:8081` (same machine as Gateway)
- **Django:** `localhost:9090` (same machine as Gateway)
- **Frontend:** Connects to Gateway at `192.168.117.225:8080`

**To use localhost for everything:** Change `GATEWAY_HOST` to `"localhost"` in `apiConfig.js`
