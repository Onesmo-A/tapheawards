# Mwongozo wa Kujumuisha NextSMS kwenye TAPHE Awards

Umekagua na kupanga kubadilisha mfumo wako wa **TAPHE Awards** ili utumie **NextSMS** kama lango la kutuma namba za siri za OTP na SMS. Chini ni mwongozo wa kina utakaoeleza jinsi mfumo wako wa sasa unavyofanya kazi na hatua ambazo tutazichukua kufanikisha mabadiliko haya bila kuharibu mfumo uliopo.

---

## 1. Usanifu wa Sasa wa OTP & SMS kwenye Mfumo wako
Mfumo wa TAPHE Awards umetengenezwa kwa kufuata mbinu bora za usanifu (design patterns), hasa **Laravel Manager Pattern**. Hii inamaanisha kuwa huduma ya kutuma SMS haikushonwa moja kwa moja kwenye controllers, bali imetenganishwa:

1. **Kiunganishi cha Dereva (Interface)**:
   Mfumo unatumia interface iitwayo [OtpDriverInterface.php](file:///c:/xampp/htdocs/taphe_online/app/Services/OTP/Contracts/OtpDriverInterface.php). Kila dereva wa SMS (kama vile Beem, Africa's Talking) lazima atekeleze interface hii yenye method moja tu:
   ```php
   public function send(string $phone, string $code, string $channel = 'sms'): bool;
   ```

2. **Msimamizi wa Madereva (OtpManager)**:
   Faili la [OtpManager.php](file:///c:/xampp/htdocs/taphe_online/app/Services/OTP/OtpManager.php) ndilo linaloamua dereva gani atumike kwa sasa kulingana na usanidi ulio kwenye faili la `config/otp.php` au variable ya `.env` (`OTP_DRIVER`).

3. **Madereva Waliopo**:
   - **LogOtpDriver**: Inatumika wakati wa maendeleo (local development). Badala ya kutuma SMS halisi na kukata salio, inaandika tu OTP kwenye faili la log la Laravel (`laravel.log`).
   - **BeemOtpDriver**: Inatumika kutuma SMS kupitia mtandao wa Beem Africa.
   - **AfricasTalkingOtpDriver**: Inatumika kutuma SMS kupitia mtandao wa Africa's Talking.

---

## 2. Jinsi NextSMS API Inavyofanya Kazi
Kulingana na nyaraka (documentation) ulizoweka kwenye maombi yako, hivi ndivyo tutakavyowasiliana na NextSMS:

- **Base URL**: `https://messaging-service.co.tz`
- **Njia (Endpoint)**: 
  - Kwa uzalishaji (Production): `POST /api/sms/v1/text/single`
  - Kwa majaribio (Sandbox/Test): `POST /api/sms/v1/test/text/single`
- **Mbinu ya Kujitambulisha (Authentication)**: 
  Basic Authentication kwa kutumia `username:password` iliyogeuzwa kuwa format ya Base64.
- **Umbizo la Namba ya Simu (Phone Format)**: 
  Namba lazima zianze na **255** (mfano: `255716718040`), bila alama ya kujumlisha (`+`).
- **Mwili wa Ombi (Request Payload)**:
  ```json
  {
    "from": "SENDER_ID",
    "to": "255716718040",
    "text": "Ujumbe wako wa OTP hapa",
    "reference": "id_ya_pekee_kwa_kila_sms"
  }
  ```

---

## 3. Hatua za Utekelezaji (Mabadiliko ya Kificho)

Ili kukamilisha mabadiliko haya, tutafanya hatua zifuatazo:

### Hatua ya A: Kuweka Creadentials kwenye `.env`
Tutaongeza taarifa za NextSMS kwenye faili lako la `.env`:
```env
OTP_DRIVER=nextsms

NEXTSMS_USERNAME=username_wako_wa_nextsms
NEXTSMS_PASSWORD=password_yako_wa_nextsms
NEXTSMS_SENDER_ID=N-SMS
NEXTSMS_USE_TEST_MODE=false # Weka true kama unataka kutumia test environment ya NextSMS
```

### Hatua ya B: Kusasisha `config/otp.php`
Tutahariri faili la [otp.php](file:///c:/xampp/htdocs/taphe_online/config/otp.php) ili kuongeza usanidi mpya wa NextSMS chini ya orodha ya `drivers`:
```php
'nextsms' => [
    'username' => env('NEXTSMS_USERNAME'),
    'password' => env('NEXTSMS_PASSWORD'),
    'sender_id' => env('NEXTSMS_SENDER_ID', 'N-SMS'),
    'use_test_mode' => env('NEXTSMS_USE_TEST_MODE', false),
],
```

### Hatua ya C: Kutengeneza Dereva wa NextSMS
Tutatengeneza faili jipya la dereva litakaloitwa **`NextSmsOtpDriver.php`** kwenye saraka ya `app/Services/OTP/Drivers/`. Dereva huyu atakuwa na muundo huu:

```php
<?php

namespace App\Services\OTP\Drivers;

use App\Services\OTP\Contracts\OtpDriverInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NextSmsOtpDriver implements OtpDriverInterface
{
    protected string $username;
    protected string $password;
    protected string $senderId;
    protected bool $useTestMode;

    public function __construct(array $config)
    {
        $this->username = $config['username'] ?? '';
        $this->password = $config['password'] ?? '';
        $this->senderId = $config['sender_id'] ?? 'N-SMS';
        $this->useTestMode = $config['use_test_mode'] ?? false;
    }

    /**
     * Tuma OTP kupitia NextSMS.
     */
    public function send(string $phone, string $code, string $channel = 'sms'): bool
    {
        // 1. Format namba ya simu iende kulingana na matakwa ya NextSMS (255XXXXXXXXX)
        $formattedPhone = $this->formatPhoneNumber($phone);
        
        $message = "Your TAPHE OTP is:: $code. Usishiriki na mtu yeyote. Inatumika kwa dakika 5 tu.";

        if (empty($this->username) || empty($this->password)) {
            Log::error("NextSMS credentials are not configured. Logging OTP instead: $code");
            return false;
        }

        // Amua URL ya kutumia (Test vs Production)
        $baseUrl = 'https://messaging-service.co.tz';
        $endpoint = $this->useTestMode 
            ? '/api/sms/v1/test/text/single' 
            : '/api/sms/v1/text/single';
        $url = $baseUrl . $endpoint;

        try {
            // 2. Tuma ombi la HTTP POST kwa NextSMS
            $response = Http::withBasicAuth($this->username, $this->password)
                ->withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($url, [
                    'from' => $this->senderId,
                    'to' => $formattedPhone,
                    'text' => $message,
                    'reference' => uniqid('otp_', true)
                ]);

            if ($response->successful()) {
                Log::info("NextSMS sent successfully to $formattedPhone. Status: " . $response->status());
                return true;
            }

            Log::error("NextSMS failed to send. Code: " . $response->status() . " Response: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("NextSMS HTTP Exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Husafisha na kubadilisha namba kuwa format ya 255xxxxxxxxx
     */
    protected function formatPhoneNumber(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone); // Ondoa alama zote zisizo namba

        if (str_starts_with($phone, '0')) {
            $phone = '255' . substr($phone, 1);
        } elseif (str_starts_with($phone, '7') || str_starts_with($phone, '6')) {
            $phone = '255' . $phone;
        }

        return $phone;
    }
}
```

### Hatua ya D: Kusajili Dereva Kwenye `OtpManager.php`
Kwenye [OtpManager.php](file:///c:/xampp/htdocs/taphe_online/app/Services/OTP/OtpManager.php), tutaongeza method ya kumtengeneza dereva wa `nextsms`:

```php
    /**
     * Tengeneza dereva wa NextSMS.
     */
    protected function createNextsmsDriver(): Drivers\NextSmsOtpDriver
    {
        return new Drivers\NextSmsOtpDriver($this->container['config']->get('otp.drivers.nextsms'));
    }
```

---

## 4. Faida za Njia Hii ya Utekelezaji
- **Hakuna Kuvuruga Mifumo Mingine**: Kwa sababu controllers zetu zote (`VoteController`, `AdminAuthController`) zinatumia `OtpManager` kupitia interface ya kawaida, hakuna mstari wowote wa code kwenye controllers unaohitaji kubadilishwa.
- **Urahisi wa Kubadili (Switching)**: Kama siku za usoni ukitaka kurudi kwenye Beem au Africa's Talking, utahitaji tu kubadilisha neno moja kwenye `.env`: `OTP_DRIVER=beem` au `OTP_DRIVER=africastalking`. Mfumo utabadilika papo hapo.
- **Urahisi wa Kujaribu (Testing)**: Unaweza kuweka `NEXTSMS_USE_TEST_MODE=true` kwenye `.env` ili kufanya majaribio ya API bila kutumia salio lako la SMS (NextSMS itatoa dummy data).

---

## Hatua inayofuata?
Tafadhali kagua mwongozo huu. Pindi utakapokuwa tayari nianze kufanya mabadiliko haya kwenye codebase yako, nijulishe ili nianze kuandika code na kufanya majaribio!
