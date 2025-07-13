# HOUSIE Fallback Service Seeding

This module provides infrastructure for creating placeholder services to ensure users can always create tickets, even for new or uncommon service types.

## Quick Start

### Browser Console (Development)
```javascript
// Run all seeding operations
await window.housieSeeding.runAll();

// Get current service statistics
const stats = await window.housieSeeding.getStats();
console.log('Service Stats:', stats);

// Create only missing fallback services
await window.housieSeeding.createFallbackServices();
```

### Programmatic Usage
```typescript
import { 
  seedFallbackServices, 
  getServiceStats, 
  findMissingServices 
} from '@/lib/seed/fallbackServices';

// Create all missing fallback services
await seedFallbackServices();

// Check what's missing before creating
const missing = await findMissingServices();
console.log(`${missing.length} services need fallback templates`);

// Get service breakdown
const stats = await getServiceStats();
console.log(`${stats.fallback}/${stats.total} services are fallbacks`);
```

## How It Works

1. **Service Matching**: When users create tickets, the system first tries to find an exact service match
2. **Fallback Creation**: If no match exists, a placeholder service is created with:
   - Generic name (e.g., "Generic Dog Walking")
   - System provider assignment 
   - Standard pricing
   - Appropriate certification requirements
3. **Graceful Handling**: Tickets with null `service_id` are displayed with visual indicators

## File Structure

- `fallbackServices.ts` - Core seeding logic
- `runSeeding.ts` - Execution utilities and browser helpers  
- `README.md` - This documentation

## Database Impact

### Tables Modified
- `services` - Creates placeholder entries for missing category/subcategory combinations
- `bookings` - Now supports `service_id = null` with category metadata fallback

### Performance Optimizations
- Added `idx_bookings_customer_id_created_at` index for dashboard queries
- Added `idx_bookings_provider_id_created_at` index for provider lookups

## Visual Indicators

The dashboard shows:
- 🔸 Orange warning triangle for tickets without formal service templates
- 💬 "Needs routing" label for pending tickets without providers
- Annette comments explaining unusual ticket states

## Best Practices

1. **Run seeding after adding new categories** to SERVICE_CATEGORIES
2. **Monitor fallback percentage** - high numbers may indicate missing real services  
3. **Use seeding in development** to test edge cases
4. **Fallback services are system-owned** and don't represent real providers

## Troubleshooting

**Q: Seeding fails with permission error**  
A: Make sure the HOUSIE System Services provider exists (UUID: 00000000-0000-4000-8000-000000000001)

**Q: Users can't create tickets for new categories**  
A: Run `await window.housieSeeding.createFallbackServices()` to generate missing templates

**Q: Dashboard shows many "mysterious" tickets**  
A: These are custom requests without service templates - this is expected behavior