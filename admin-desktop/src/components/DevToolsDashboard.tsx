
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Wrench, 
  Users, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  Trash2, 
  RotateCcw,
  Play,
  Loader
} from 'lucide-react';
import { DevToolsService } from '../services/devToolsService';
import { toast } from 'sonner';

const DevToolsDashboard = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleGenerateTestUsers = async (count: number) => {
    try {
      setLoading('users');
      console.log(`🧪 Generating ${count} test users...`);
      await DevToolsService.generateTestUsers(count);
      toast.success(`Generated ${count} test users successfully`);
    } catch (error) {
      console.error('❌ Failed to generate test users:', error);
      toast.error('Failed to generate test users');
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateTestBookings = async (count: number) => {
    try {
      setLoading('bookings');
      console.log(`🧪 Generating ${count} test bookings...`);
      await DevToolsService.generateTestBookings(count);
      toast.success(`Generated ${count} test bookings successfully`);
    } catch (error) {
      console.error('❌ Failed to generate test bookings:', error);
      toast.error('Failed to generate test bookings');
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateTestRevenue = async () => {
    try {
      setLoading('revenue');
      console.log('🧪 Generating test revenue data...');
      await DevToolsService.generateTestRevenue();
      toast.success('Test revenue data generated successfully');
    } catch (error) {
      console.error('❌ Failed to generate test revenue:', error);
      toast.error('Failed to generate test revenue data');
    } finally {
      setLoading(null);
    }
  };

  const handleCreateVerifiedProviders = async () => {
    try {
      setLoading('providers');
      console.log('🧪 Creating verified providers...');
      await DevToolsService.createVerifiedProviders();
      toast.success('Verified providers created successfully');
    } catch (error) {
      console.error('❌ Failed to create verified providers:', error);
      toast.error('Failed to create verified providers');
    } finally {
      setLoading(null);
    }
  };

  const handleCleanupTestData = async () => {
    if (!confirm('Are you sure you want to clean up ALL test data? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading('cleanup');
      console.log('🧹 Cleaning up test data...');
      await DevToolsService.cleanupTestData();
      toast.success('Test data cleanup completed successfully');
    } catch (error) {
      console.error('❌ Failed to cleanup test data:', error);
      toast.error('Failed to cleanup test data');
    } finally {
      setLoading(null);
    }
  };

  const handleResetAnalytics = async () => {
    if (!confirm('Are you sure you want to reset analytics data?')) {
      return;
    }

    try {
      setLoading('analytics');
      console.log('📊 Resetting analytics...');
      await DevToolsService.resetAnalytics();
      toast.success('Analytics reset completed successfully');
    } catch (error) {
      console.error('❌ Failed to reset analytics:', error);
      toast.error('Failed to reset analytics');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Development Tools</h2>
        </div>
        <Badge variant="destructive" className="bg-red-600 text-white">
          PRE-LAUNCH ONLY
        </Badge>
      </div>

      {/* Warning Banner */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-800">
              Development Tools - Use with caution! These tools modify production data.
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Data Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Test Data Generator
              <Badge variant="secondary">Mock Data</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Test Users */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Test Users
              </h4>
              <p className="text-sm text-gray-600">
                Generate test users with realistic data for testing
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerateTestUsers(50)}
                  disabled={!!loading}
                >
                  {loading === 'users' ? (
                    <Loader className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Users className="h-4 w-4 mr-1" />
                  )}
                  50 Users
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerateTestUsers(100)}
                  disabled={!!loading}
                >
                  100 Users
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerateTestUsers(500)}
                  disabled={!!loading}
                >
                  500 Users
                </Button>
              </div>
            </div>

            {/* Test Bookings */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Test Bookings
              </h4>
              <p className="text-sm text-gray-600">
                Generate test bookings with random dates and amounts
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerateTestBookings(100)}
                  disabled={!!loading}
                >
                  {loading === 'bookings' ? (
                    <Loader className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Calendar className="h-4 w-4 mr-1" />
                  )}
                  100 Bookings
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerateTestBookings(500)}
                  disabled={!!loading}
                >
                  500 Bookings
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerateTestBookings(1000)}
                  disabled={!!loading}
                >
                  1000 Bookings
                </Button>
              </div>
            </div>

            {/* Financial Data */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Data
              </h4>
              <p className="text-sm text-gray-600">
                Generate test revenue and payment data
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateTestRevenue}
                disabled={!!loading}
                className="w-full"
              >
                {loading === 'revenue' ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <DollarSign className="h-4 w-4 mr-2" />
                )}
                Generate Test Revenue
              </Button>
            </div>

            {/* Verified Providers */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Verified Providers
              </h4>
              <p className="text-sm text-gray-600">
                Create verified provider profiles for testing
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCreateVerifiedProviders}
                disabled={!!loading}
                className="w-full"
              >
                {loading === 'providers' ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserCheck className="h-4 w-4 mr-2" />
                )}
                Create Verified Providers
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cleanup Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Pre-Launch Cleanup
              <Badge variant="destructive">Destructive</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Test Data Cleanup */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Remove Test Data
              </h4>
              <p className="text-sm text-gray-600">
                Clean up all test users, bookings, and related data
              </p>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleCleanupTestData}
                disabled={!!loading}
                className="w-full"
              >
                {loading === 'cleanup' ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete All Test Data
              </Button>
            </div>

            {/* Analytics Reset */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset Analytics
              </h4>
              <p className="text-sm text-gray-600">
                Reset analytics counters and cached data
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleResetAnalytics}
                disabled={!!loading}
                className="w-full"
              >
                {loading === 'analytics' ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4 mr-2" />
                )}
                Reset Analytics
              </Button>
            </div>

            {/* Production Readiness */}
            <div className="space-y-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium flex items-center gap-2 text-yellow-800">
                <Wrench className="h-4 w-4" />
                Production Readiness
              </h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>✅ Remove all test.fraud.local accounts</p>
                <p>✅ Clear analytics cache</p>
                <p>✅ Verify payment gateway settings</p>
                <p>✅ Confirm backup procedures</p>
                <p>⚠️ Disable this dev tools section</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Development Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Complete</div>
              <div className="text-sm text-gray-600">Desktop App Status</div>
              <div className="text-xs text-gray-500">All admin functions implemented</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Ready</div>
              <div className="text-sm text-gray-600">Emergency Controls</div>
              <div className="text-xs text-gray-500">Fully functional with UUID fix</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">Testing</div>
              <div className="text-sm text-gray-600">Production Migration</div>
              <div className="text-xs text-gray-500">Ready to replace web admin</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevToolsDashboard;
