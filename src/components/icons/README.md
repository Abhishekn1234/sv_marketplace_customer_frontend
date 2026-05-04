# Icons Directory

## Available Icons
All icons are exported from `index.ts` for easy reuse.

### SVG Icons (React components via Vite)
- `GoogleIcon` - from google.svg
- `FacebookIcon` - from facebook.svg
- `MoneyIcon` - from moneybill.svg
- `ReactIcon` - React logo
- `ViteIcon` - Vite logo

### TSX Icons
- ArrowRight
- BackArrowIcon
- BillingIcon
- DangerZoneIcon
- DeleteAccountIcon
- EmailNotificationIcon
- HelpIcon
- LogoIcon
- PreferencesIcon
- PrivacyIcon
- QuickActionsIcon
- SaveIcon
- SecurityIcon
- SmsNotificationIcon
- TwoFactorAuthIcon
- UserIcon

## Usage
```tsx
import { GoogleIcon, ReactIcon, BackArrowIcon } from '@/components/icons';

<GoogleIcon className="w-6 h-6" />
<ReactIcon />
<BackArrowIcon />
```

All SVGs support Tailwind classes for sizing/coloring.

