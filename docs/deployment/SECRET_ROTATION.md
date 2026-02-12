# Tajne Rotirane - Akcijski Plan

## ⚠️ HITNO: Kompromitovane Vrednosti

Sledeće vrednosti su bile izložene u git history i trebale bi se rotirati **ODMAH**:

### 1. **Firebase API Key**
```
Stara: AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk
```

**Kako rotirati**:
1. Idi na Firebase Console → Project Settings
2. Klikni na "Web API Key" → "Regenerate"
3. Ažuriraj `.env.local` sa novom vrednošću
4. Ažuriraj Cloudflare Pages Environment Variables
5. Redeploy aplikaciju

**Impact**: Srednji - stari key se može koristiti dok ga ne obrišeš

---

### 2. **Cloudflare API Token**
```
Stari: hSh_h9j-1e0gWPaLR39zzBDy7wK4tIvDKG1lJIxL
```

**Kako rotirati**:
1. Idi na Cloudflare Dashboard → My Profile → API Tokens
2. Pronađi token sa istim permissions
3. **Revoke** stari token
4. **Create Token** sa istim permissions:
   - Zone.Cache Purge
   - Zone.Workers Routes Edit
   - Account.Cloudflare Pages Edit
5. Ažuriraj `.env.local` sa novim tokenom
6. Ažuriraj CI/CD secrets (ako koristi GitHub Actions)

**Impact**: Visok - stari token ima pristup svim resursima!

---

### 3. **Cloudflare Account ID**
```
Stari: 031ca9685557ca09a945ef3d0ba54f8e
```

**Kako rotirati**:
- Account ID **ne može** se rotirati, ali može se zaštititi
- Koristi **IP Access Rules** u Cloudflare da ograničiš pristup
- **User Access Audit** → proveri ko ima pristup accountu

**Impact**: Nizak - potreban je API token za korišćenje

---

### 4. **reCAPTCHA Site Key**
```
Stari: 6LdhT-ArAAAAAA93PlM7Ua3eE3TttZAjFcSpwySS
```

**Kako rotirati**:
1. Idi na Google Cloud Console → reCAPTCHA Admin
2. **Create new site key** sa istim domenom
3. Ažuriraj `.env.local` i Cloudflare Pages env vars
4. Redeploy

**Impact**: Srednji - stari key može se zloupotrebiti za spam

---

### 5. **Firebase App Check Debug Token**
```
Stari: C0D542DB-96AE-4886-A47F-6A6B7FD27D30
```

**Kako rotirati**:
1. Idi na Firebase Console → App Check
2. **Manage debug tokens**
3. Revoke stari, kreiraj novi
4. Ažuriraj `.env.local`

**Impact**: Nizak - samo debug token, ne proizvodni

---

### 6. **Cloudflare Zone ID**
```
Stari: 8e9adffbe324937621ebe15e3595b23c
```

**Kako rotirati**:
- Zone ID **ne može** se rotirati (vezan za domen)
- Ograniči pristup sa API Token permissions

**Impact**: Nizak - samo metadata

---

### 7. **KV Namespace ID**
```
Stari: 2bb2f5778aaa459382c4731b60f3405a
```

**Kako rotirati**:
1. Kreiraj novi KV namespace: `wrangler kv:namespace create "CACHE_METADATA"`
2. Migruj podatke: `wrangler kv:key list --binding=CACHE_METADATA`
3. Ukloni stari namespace
4. Ažuriraj `wrangler.workers.toml`

**Impact**: Srednji - podaci mogu biti čitani ilii izmenjeni

---

## 🔐 Dodatne Mere Bezbednosti

### 1. **Cloudflare API Token Permissions**

Kreiraj granularni token samo sa potrebnim permissions:

```
✅ Zone:Zone Settings:Read
✅ Zone:Cache Purge:Edit
✅ Zone:Workers Routes:Edit
✅ Account:Workers Scripts:Edit
✅ Account:Cloudflare Pages:Edit
❌ Account:Billing:Read (NE TREBA!)
❌ Zone:DNS:Edit (NE TREBA!)
```

### 2. **IP Whitelisting**

U Cloudflare Dashboard → Security → WAF → Tools:
- Dodaj **IP Access Rule** za CI/CD server
- Blokiraj sve ostale za `/admin` rute

### 3. **Two-Factor Authentication**

Uključi 2FA na:
- [ ] Firebase Console
- [ ] Cloudflare Dashboard
- [ ] GitHub Account
- [ ] Domain Registrar

### 4. **Service Account Isolation**

Za CI/CD deployments:
- Kreiraj **dedikovan service account** sa minimalnim permissions
- Koristi **short-lived tokens** (expire after 1 hour)
- **Audit logs** za svaku deployment akciju

---

## 🧹 Čišćenje Git History

### Ukloni Kompromitovane Tajne iz History

**PAŽNJA**: Ovo će rewrite-ovati git history!

```bash
# 1. Backup trenutnog stanja
git branch backup-before-cleanup

# 2. Ukloni .env.local iz celokupne git history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env.local' \
  --prune-empty --tag-name-filter cat -- --all

# 3. Ukloni wrangler.workers.toml sa tajnama
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch wrangler.workers.toml' \
  --prune-empty --tag-name-filter cat -- --all

# 4. Force push (PAŽLJIVO!)
git push origin --force --all
git push origin --force --tags

# 5. Očisti lokalni repo
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### BFG Repo-Cleaner (Lakše)

Brži način jako BFG tool:

```bash
# 1. Install BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# 2. Kreiraj listu tajni za uklanjanje
cat > secrets.txt << EOF
AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk
hSh_h9j-1e0gWPaLR39zzBDy7wK4tIvDKG1lJIxL
C0D542DB-96AE-4886-A47F-6A6B7FD27D30
6LdhT-ArAAAAAA93PlM7Ua3eE3TttZAjFcSpwySS
EOF

# 3. Pokreni BFG
java -jar bfg.jar --replace-text secrets.txt .git

# 4. Očisti repo
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Force push
git push origin --force --all
```

---

## 📋 Post-Rotation Checklist

Nakon rotacije tajni:

- [ ] Rotirani svi kompromitovani keys
- [ ] Ažurirani `.env.local` fajl
- [ ] Ažurirani Cloudflare Pages Environment Variables
- [ ] Git history očišćena (BFG ili filter-branch)
- [ ] Force push na GitHub
- [ ] Redeploy na Cloudflare Pages
- [ ] Test svih funkcionalnosti (Firebase, R2, Forms)
- [ ] Monitor logs za neobične aktivnosti
- [ ] Enable 2FA na svim servisima
- [ ] Audit access logs

---

## 🚨 Ako se Već Desila Zloupotreba

### Znaci kompromitacije:

- Neobični API requests u Cloudflare Analytics
- Firebase usage spike bez razloga
- Nepoznati users u Firebase Auth
- Cloudflare Worker errors
- Billing anomalije

### Odmah preduzmi:

1. **Revoke ALL API tokens**
2. **Change Firebase passwords**
3. **Enable Cloudflare Under Attack Mode**
4. **Check Firebase Firestore za neobične podatke**
5. **Contact Cloudflare Support** (ako je ozbiljno)
6. **Review access logs** (Cloudflare, Firebase)

---

## 📞 Kontakti za Podršku

**Cloudflare Support**:
- Dashboard → Support → Create Ticket
- Community: https://community.cloudflare.com

**Firebase Support**:
- Console → Help → Contact Support
- Stack Overflow: firebase tag

**GitHub Security**:
- https://github.com/security/advisories
- security@github.com (za ozbiljne incidente)
