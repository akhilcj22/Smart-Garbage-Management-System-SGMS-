# Troubleshooting Guide

## Common Errors and Solutions

### 1. GeolocationPositionError

**Error:** `Error getting location: GeolocationPositionError`

**Cause:** Browser denied location access or geolocation is not available.

**Solution:**
- The app now handles this gracefully by using a default location (Delhi)
- Users can still select centers manually from the dropdown
- To enable location access:
  1. Check browser permissions for location
  2. Allow location access when prompted
  3. Use HTTPS (geolocation requires secure context in some browsers)

**Status:** ✅ Fixed - App now has fallback behavior

---

### 2. Google Maps API Errors

#### Error: `NoApiKeys`
**Cause:** Google Maps API key is not configured in `.env` file.

**Solution:**
1. Get a Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project or select existing
   - Enable "Maps JavaScript API"
   - Create API key

2. Add to `frontend/.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your-api-key-here
   ```

3. Restart the development server

**Status:** ✅ Fixed - App shows a friendly message when API key is missing

#### Error: `ApiProjectMapError`
**Cause:** API key is invalid or billing is not enabled.

**Solution:**
- Verify API key is correct
- Enable billing in Google Cloud Console
- Check API restrictions in Google Cloud Console

#### Warning: `google.maps.Marker is deprecated`
**Cause:** Google is deprecating the old Marker API.

**Solution:**
- This is just a warning, not an error
- The app still works with the current implementation
- Future update: Will migrate to `AdvancedMarkerElement` when stable

**Status:** ⚠️ Warning only - App still functional

---

### 3. Razorpay Error: `window.Razorpay is not a constructor`

**Error:** `TypeError: window.Razorpay is not a constructor`

**Cause:** Razorpay script is not loaded before trying to use it.

**Solution:**
1. ✅ **Fixed** - Razorpay script is now loaded in `index.html`

2. If you still see the error:
   - Check if Razorpay script is blocked by ad blocker
   - Verify internet connection
   - Check browser console for script loading errors

3. Add Razorpay key to `frontend/.env`:
   ```env
   VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
   ```

**Status:** ✅ Fixed - Script is now loaded in HTML head

---

## Environment Variables Setup

Create `frontend/.env` file with:

```env
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:8000/api/

# Google Maps API Key (Optional - for map features)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Razorpay Configuration (Required for payments)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

**Note:** 
- Google Maps is optional - app works without it (shows fallback UI)
- Razorpay is required for payment functionality

---

## Quick Fixes

### If Google Maps doesn't work:
1. Check `.env` file has `VITE_GOOGLE_MAPS_API_KEY`
2. Restart dev server after adding env variable
3. Verify API key in Google Cloud Console
4. App will show a message if API key is missing (still functional)

### If Razorpay doesn't work:
1. Check `index.html` has Razorpay script (already added)
2. Add `VITE_RAZORPAY_KEY_ID` to `.env`
3. Restart dev server
4. Check browser console for script loading errors

### If Location doesn't work:
1. Allow location permissions in browser
2. Use HTTPS (or localhost works)
3. App will use default location if denied (still functional)

---

## Testing Without API Keys

The app is designed to work even without optional services:

- ✅ **Without Google Maps:** Center selection via dropdown (no map)
- ✅ **Without Razorpay:** Payment button shows error (booking still created)
- ✅ **Without Location:** Uses default location (Delhi)

All core features work without external API keys!

---

## Still Having Issues?

1. **Clear browser cache and localStorage**
2. **Restart both frontend and backend servers**
3. **Check browser console for detailed errors**
4. **Verify all environment variables are set correctly**
5. **Check network tab for API call failures**

