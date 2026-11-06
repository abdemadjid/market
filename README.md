# Borne Admin — Plateforme de gestion centrale (Next.js 16.4)

```bash
cp .env.example .env.local
npm install && npm run dev   # http://localhost:3000
```
Comptes démo : `admin / admin123` (tout) · `superviseur / super123` (sans catalogue ni journal).

## API bornes (header `x-api-key`)
| Route | Rôle |
|---|---|
| `POST /api/kiosk/transactions` | Vente : décrémente le stock, compare poids attendu/mesuré, contrôle aléatoire (10 %), renvoie un code de sortie à usage unique |
| `POST /api/kiosk/sync` | Renvoi de la file hors-ligne ; dédoublonnage par `idempotencyKey` |
| `POST /api/kiosk/exit-code` | Validation à la porte (usage unique, expire en 10 min, seul le hash est stocké) |

## Sécurité
Aucune donnée de carte (paiement sur TPE/POS) · sessions signées HMAC, cookie HttpOnly/SameSite=Strict · rôles revérifiés côté serveur · en-têtes HSTS/anti-framing · journal d'audit.

## Extensions prévues (non développées)
- **App mobile / chariot intelligent** : réutilisent `/api/kiosk/*` ; ajouter un champ `deviceType` et une clé d'API par appareil.
- **Caméras** : l'alerte `CONTROLE` expose le point d'accroche (`kioskId` + horodatage) pour récupérer le clip.

## À faire avant production
Remplacer `lib/data.ts` par PostgreSQL (Prisma/Drizzle), hasher les mots de passe (argon2) + 2FA, TLS/mTLS pour les bornes, SSE/WebSocket pour le temps réel, i18n de l'interface.
