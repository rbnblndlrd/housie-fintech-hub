import { supabase } from '@/integrations/supabase/client';

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface ImprintContext {
  actionType: 'job' | 'visit' | 'event' | 'rebook' | 'stamp_unlock';
  serviceType?: string;
  note?: string;
  userId: string;
}

export class GPSImprintEngine {
  private static instance: GPSImprintEngine;
  private watchId: number | null = null;
  private lastKnownPosition: GPSLocation | null = null;
  private imprintCallbacks: ((result: any) => void)[] = [];

  static getInstance(): GPSImprintEngine {
    if (!this.instance) {
      this.instance = new GPSImprintEngine();
    }
    return this.instance;
  }

  /**
   * Start watching GPS position for automatic imprint detection
   */
  startWatching(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.lastKnownPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          resolve();
        },
        (error) => {
          console.error('GPS watch error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000 // 1 minute
        }
      );
    });
  }

  /**
   * Stop watching GPS position
   */
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Get current GPS position
   */
  async getCurrentPosition(): Promise<GPSLocation> {
    if (this.lastKnownPosition && 
        this.lastKnownPosition.timestamp && 
        Date.now() - this.lastKnownPosition.timestamp < 30000) {
      return this.lastKnownPosition;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          this.lastKnownPosition = location;
          resolve(location);
        },
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );
    });
  }

  /**
   * Check if current position triggers any drop points
   */
  async checkForDropPointTriggers(context: ImprintContext): Promise<any> {
    try {
      const position = await this.getCurrentPosition();
      
      const result = await supabase.rpc('log_imprint', {
        p_user_id: context.userId,
        p_coordinates: `(${position.longitude},${position.latitude})`,
        p_action_type: context.actionType,
        p_service_type: context.serviceType,
        p_note: context.note
      });

      if (result.error) {
        throw result.error;
      }

      // Notify callbacks
      this.imprintCallbacks.forEach(callback => callback(result.data));

      return result.data;
    } catch (error) {
      console.error('Drop point trigger check failed:', error);
      throw error;
    }
  }

  /**
   * Manually log an imprint at current position
   */
  async logImprintAtCurrentPosition(context: ImprintContext): Promise<any> {
    return this.checkForDropPointTriggers(context);
  }

  /**
   * Manually log an imprint at specific coordinates
   */
  async logImprintAtCoordinates(
    coordinates: [number, number], 
    context: ImprintContext
  ): Promise<any> {
    try {
      const result = await supabase.rpc('log_imprint', {
        p_user_id: context.userId,
        p_coordinates: `(${coordinates[0]},${coordinates[1]})`,
        p_action_type: context.actionType,
        p_service_type: context.serviceType,
        p_note: context.note
      });

      if (result.error) {
        throw result.error;
      }

      // Notify callbacks
      this.imprintCallbacks.forEach(callback => callback(result.data));

      return result.data;
    } catch (error) {
      console.error('Manual imprint logging failed:', error);
      throw error;
    }
  }

  /**
   * Find nearby drop points without logging an imprint
   */
  async findNearbyDropPoints(maxDistance: number = 1000): Promise<any[]> {
    try {
      const position = await this.getCurrentPosition();
      
      const result = await supabase.rpc('find_nearby_drop_points', {
        p_coordinates: `(${position.longitude},${position.latitude})`,
        p_max_distance_m: maxDistance
      });

      if (result.error) {
        throw result.error;
      }

      return result.data || [];
    } catch (error) {
      console.error('Nearby drop points search failed:', error);
      throw error;
    }
  }

  /**
   * Register callback for imprint events
   */
  onImprintLogged(callback: (result: any) => void): void {
    this.imprintCallbacks.push(callback);
  }

  /**
   * Remove imprint callback
   */
  removeImprintCallback(callback: (result: any) => void): void {
    const index = this.imprintCallbacks.indexOf(callback);
    if (index > -1) {
      this.imprintCallbacks.splice(index, 1);
    }
  }

  /**
   * Get last known position without triggering new GPS request
   */
  getLastKnownPosition(): GPSLocation | null {
    return this.lastKnownPosition;
  }

  /**
   * Calculate distance between two points in meters
   */
  static calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) *
      Math.cos(this.toRadians(point2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Export singleton instance
export const gpsImprintEngine = GPSImprintEngine.getInstance();