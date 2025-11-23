# Farcaster Integration Notes

This application has been configured for Farcaster Frames v2 (Mini Apps).

## ⚠️ Action Required: Replace Dummy Data

The following files contain dummy data that **MUST** be replaced with your actual project information before deploying to production.

### 1. `frontend/public/manifest.json`
- **`name`**: Update to your app's full name.
- **`short_name`**: Update to a shorter version of your app's name.
- **`description`**: Update to your app's description.
- **`icons`**: Replace `/icon-192x192.png` and `/icon-512x512.png` with your actual app icons in the `public` folder.
- **`farcaster.embedded_client_notification_id`**: Replace `minth-art-notification-id` with your actual notification ID if you plan to use notifications.

### 2. `frontend/app/layout.tsx`
- **`fc:miniapp` metadata**:
    - **`imageUrl`**: Replace `https://www.minth.art/OT.png` with your actual Open Graph image URL.
    - **`button.action.splashImageUrl`**: Replace `https://www.minth.art/OT.png` with your splash screen image URL.
    - **`button.action.splashBackgroundColor`**: Update the background color if needed.

## Next Steps

1.  **Domain Verification**:
    - You may need to create a `/.well-known/farcaster.json` file for domain verification if you are not using a hosted manifest.
    - Refer to the [Farcaster Agents Checklist](https://miniapps.farcaster.xyz/docs/guides/agents-checklist) for details on "Check 1: Manifest Configuration".

2.  **Testing**:
    - Use the [Farcaster Mini App Playground](https://farcaster.xyz/~/developers/mini-apps/preview) to test your app.
    - You will need to deploy your app or use a tunnel (like ngrok) to test it in the playground.

3.  **SDK Usage**:
    - The Farcaster SDK is initialized in `frontend/app/providers.tsx`.
    - You can now use `sdk` imported from `@farcaster/miniapp-sdk` to interact with the Farcaster client (e.g., `sdk.actions.close()`, `sdk.context`, etc.).
