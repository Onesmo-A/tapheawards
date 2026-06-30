# TAPHE Awards: System Architecture & Technical Specification

Dokumenti hii inafafanua usanifu kamili wa mfumo (System Architecture) wa **TAPHE Awards**, ikionyesha jinsi mifumo ya mbele (Public Portal) na mifumo ya nyuma (Admin Control Center) inavyounganishwa kupitia **Decoupled React SPA + Laravel API Architecture**. Inabainisha kila eneo la mfumo, usalama wa kura, na muundo wa hifadhidata.

---

## 1. Usanifu Mkuu wa Kimsingi (System Architecture Topology)

Mfumo umehamishwa kutoka muundo wa zamani wa monolithic (Vue 3 + Inertia) na sasa unatumia usanifu wa kisasa wa **Decoupled (Separated) API-First Architecture**:

```
+--------------------------------------------------------------+
|                     React SPA Frontend                       |
|           (Vite + TS + Tailwind CSS + Framer Motion)         |
+--------------------------------------------------------------+
         |                                           ^
    API Requests                                 JSON Data
   (Axios + Auth)                              (CORS Protected)
         v                                           |
+--------------------------------------------------------------+
|                     Laravel 11 REST API                      |
|       (Sanctum Authentication + Manager/Driver Pattern)      |
+--------------------------------------------------------------+
         |                                           ^
    Read/Write                                  Data Query
         v                                           |
+--------------------------------------------------------------+
|                    MySQL / Database Layer                    |
|             (UUID Primary Keys + Integrity Hashes)           |
+--------------------------------------------------------------+
```

---

## 2. Hifadhidata & UUID Schema Design

Jedwali zote za mfumo zimesasishwa kutoka auto-increment integers kwenda **UUID (Universally Unique Identifier)** ili kuzuia mashambulizi ya kubashiri ID (ID enumeration/IDOR). Saini za database zinalindwa kwa ngazi ya database constraints.

### Jedwali na Mahusiano (Database Tables & Fields):
1. **`users`**: Hifadhi ya watumiaji (Admin & Public voters) -> `id (UUID)`, `name`, `email`, `role`, `password`.
2. **`categories`**: Kategoria za tuzo -> `id (UUID)`, `name`, `slug`, `active_season_year`.
3. **`nominees`**: Wagombea -> `id (UUID)`, `category_id (UUID FK)`, `name`, `bio`, `image_url`, `votes_count`.
4. **`vote_orders`**: Mihamala ya malipo ya kura -> `id (UUID)`, `nominee_id (UUID FK)`, `votes_count`, `amount`, `payment_status`, `payment_phone`, `provider`, `transaction_ref`.
5. **`votes`**: Kura zilizopigwa -> `id (UUID)`, `category_id (UUID FK)`, `nominee_id (UUID FK)`, `vote_order_id (UUID FK)`, `voter_phone`, `votes_count`, `integrity_hash`.
6. **`marathon_registrations`**: Washiriki wa marathon -> `id (UUID)`, `full_name`, `email`, `phone`, `race_type`, `payment_status`, `amount`, `registration_code`.
7. **`tickets`**: Tiketi za Banquet -> `id (UUID)`, `buyer_name`, `buyer_email`, `qty`, `ticket_numbers (JSON)`, `payment_status`, `amount`.
8. **`settings`**: Mipangilio ya mfumo -> `key`, `value` (JSON/Text).
9. **`posts` / `reels` / `gallery_albums` / `hero_banners` / `sponsors`**: Hifadhi ya maudhui ya tovuti.

---

## 3. Mifumo ya Public Portal (Public Site Subsystems)

Mifumo ya mbele inaruhusu umma kuingiliana na tovuti. Imehamishiwa kwenye React SPA na inawasiliana kupitia API za Laravel:

```
[Public Visitor] 
   |
   +--> /welcome/data (GET) =======> Upakiaji wa Kategoria, Wagombea na Nembo
   +--> /vote/otp/request (POST) ===> Ombi la OTP (SMS / WhatsApp Drivers)
   +--> /vote/initiate (POST) ======> Muamala wa Kura (Push USSD)
   +--> /marathon/register (POST) ==> Usajili wa Marathon (ZenoPay Integration)
   +--> /suggestions (POST) ========> Pendekeza Mgombea Mpya
```

### Orodha ya Kurasa & Utendaji (React Components / Routes):
* **Home / Categories (`/`)**: Inaonyesha Hero section, video/picha ya Trophy 3D, timeline ya gala, scrolling sponsors, na kadi za nominees.
* **Vote Modal Wizard**: Kazi ya kupiga kura (Phone -> OTP Verify -> Package select -> Push USSD -> Polling status).
* **Marathon Registration (`/marathon`)**: Fomu ya kujiandikisha mbio za hisani, kuchagua kundi, na kufanya malipo.
* **Suggest a Nominee (`/suggest`)**: Fomu ya kupendekeza wataalamu wa afya wanaostahili tuzo.
* **Get Tickets (`/tickets`)**: Fomu ya kukata tiketi za Gala Banquet.
* **Media & Editorial (`/news`, `/gallery`)**: Nyaraka za habari, picha na video za matukio ya nyuma.
* **About / Contact (`/about`, `/contact`)**: Wasifu wa bodi na fomu za mawasiliano.

---

## 4. Mifumo ya Admin Panel (Admin Backend Subsystems)

Admin Panel inasimamia mchakato mzima na sasa inawasiliana na Laravel API kwa kutumia token iliyolindwa (`Sanctum auth`).

### A. Dashibodi Kuu (Dashboard Metrics)
- **Active Season Switcher**: Ubadilishaji wa msimu unaoendelea (e.g. 2026) ili kuonyesha data husika pekee.
- **Kadi za Takwimu (Live Metrics)**: Pending/Approved Nominee Applications, Suggestions Count, Total posts, transactions, votes cast, tickets sold, na marathon statistics.

### B. Usimamizi wa Maudhui (Content Management Subsystem)
- **Categories & Nominees Admin**: CRUD ya kategoria na wagombea (kuweka picha, bios, na viungo vya kijamii).
- **Gallery & Media Admin**: Kupakia albamu za picha, video, posts, na reels.
- **Hero Banners & Sponsors**: Kudhibiti banners zinazoonekana juu na nembo za sponsors za chini.

### C. Usimamizi wa Shughuli za Watumiaji (User Activity & Registration Audits)
- **Applications Manager**: Kupitia maombi ya kujiunga na tuzo (Approve/Reject).
- **Transactions Logger**: Orodha ya malipo yote ya kura na tiketi ikiwa na Payment Status (completed, pending, failed) na Order IDs.
- **Suggestions Viewer**: Kuona na kuchakata mapendekezo ya nominees yaliyotumwa na umma.

### D. Marathon & Tickets Management
- **Marathon Registry**: Orodha ya wakimbiaji, utafutaji wa namba za siri (Unique codes), na kusafirisha ripoti (Export to PDF/Excel).
- **Tickets Dashboard**: Kusimamia tiketi zilizouzwa na mfumo wa kukagua tiketi (Scan & Check-in).

### E. Ukaguzi wa Kura na Mipangilio (Voting Audit & System Configuration)
- **Vote Attempt Logs & Archives**: Kurekodi majaribio yote ya kupiga kura ili kugundua mashambulizi ya kiusalama.
- **Winners Panel**: Mfumo wa kupanga washindi kulingana na kura zilizothibitishwa na HMAC signatures.
- **System Settings Grid**:
  - *Winners Settings*: Show/Hide winners page, show visitors statistics.
  - *Voting Settings*: Kura kufunguliwa/kufungwa, na deadline picker.
  - *Nomination Settings*: Kufungua/kufunga applications na kuweka tarehe.
  - *Event Settings*: Mchanganuo wa timeline (timeline steps) na ramani ya ukumbi (Google Map location settings).

---

## 5. Mifumo ya Usalama & Uthibitishaji (Security & Verification Services)

Mfumo umejengwa kwa kuzingatia ulinzi wa hali ya juu:

### A. Cryptographic Vote Verification Service (`VoteIntegrityService`)
Ili kuhakikisha hakuna kura iliyoingizwa moja kwa moja kwenye database au kubadilishwa thamani yake, kura zote zinasainiwa kwa ufunguo wa siri wa App Key kwa kutumia algorithm ya **HMAC-SHA256**:
$$\text{Hash} = \text{HMAC-SHA256}(\text{vote\_id} + \text{nominee\_id} + \text{category\_id} + \text{votes\_count} + \text{voter\_phone}, \text{AppKey})$$
Ukaguzi unarun kiotomatiki wakati wa kujumlisha matokeo; kura yoyote isiyo na saini inayolingana inafutwa kwenye hesabu ya jumla.

### B. Modular Gateway Driver Pattern
Huduma zote za nje (SMS, WhatsApp, Payments) zimetenganishwa (low coupling) kwa kutumia madereva:
- **OTP Gateway Driver**: `LogOtpDriver` (kwa dev env) na `BeemOtpDriver` (kwa production SMS/WA).
- **Payment Gateway Driver**: `LogPaymentDriver`, `AzamPayDriver`, na `MalipoPayDriver`.
- **Signature Webhook Protection**: Kila webhook inapokelewa ikiwa imesainiwa na token ya siri kutoka kwa watoa huduma, ikihakikiwa kabla ya kutoa kura.

---

## 6. Hali ya Uhamiaji (Migration Status Map)

| Mfumo (Subsystem) | Hali Kwenye Laravel Backend (API) | Hali Kwenye React Frontend (SPA) |
| :--- | :--- | :--- |
| **Welcome / Hero / Nominees** | Tayari (Controllers & Seeders zote zipo) | Tayari (Imekamilika kwa 100% kwa White/Red Luxury Theme) |
| **Paid Voting & OTP Validation** | Tayari (Drivers & Webhooks zote zipo) | Tayari (VoteModal wizard imekamilika) |
| **Nominee Suggestions** | Tayari (`SuggestionController` ipo) | Tayari (`SuggestNominee.tsx` ipo) |
| **Banquet Tickets Purchase** | Tayari (`TicketController` ipo) | Tayari (`GetTickets.tsx` ipo) |
| **Marathon Registration** | Tayari (`MarathonController` ipo) | Inasubiri kuandikwa kwenye React (Controller ipo) |
| **News / Posts / Gallery** | Tayari (`NewsController`/`GalleryController` ipo) | Inasubiri kuandikwa kwenye React (Controllers zipo) |
| **Admin Dashboard & Settings** | Tayari (Controllers zote zipo chini ya `Admin/`) | Inasubiri kuandikwa kwenye React (Controllers zipo) |
