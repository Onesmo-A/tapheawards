# TAPHE Deployment Checklist

## Environment

- Copy `.env.example` to `.env` on the server and fill production values.
- Set:
  - `APP_ENV=production`
  - `APP_DEBUG=false`
  - `APP_URL=https://your-production-domain`
  - `OTP_DRIVER=africastalking` or `beem`
  - `PAYMENT_DRIVER=azampay` or `malipopay`
  - `MAIL_MAILER=smtp` or another production mail driver
- Confirm gateway webhook URLs point to:
  - `${APP_URL}/api/v1/webhooks/zenopay`
  - `${APP_URL}/api/v1/webhooks/azampay`
  - `${APP_URL}/api/v1/webhooks/malipopay`

## Install

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run typecheck
npm run build
php artisan migrate --force
php artisan storage:link
```

## Optimize

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Workers

- Run queue workers with Supervisor or the hosting platform worker manager:

```bash
php artisan queue:work --tries=3 --timeout=120
```

- Run Laravel scheduler every minute:

```bash
php artisan schedule:run
```

## Smoke Test

- Visit `/` and confirm the public site renders.
- Visit `/admin/login` and confirm MFA login works.
- Submit a local/sandbox paid vote and confirm:
  - transaction becomes `completed`
  - vote order becomes `completed`
  - nominee vote count increments once
  - duplicate webhook does not double-count votes
- Run admin vote integrity audit from the dashboard.

## Security

- Keep `.env` private.
- Rotate any credentials that were ever shared outside the server.
- Restrict webhook IPs where supported.
- Ensure `public/hot` is not present on production.
