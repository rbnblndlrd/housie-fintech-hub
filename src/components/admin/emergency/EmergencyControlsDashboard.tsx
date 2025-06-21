
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useEmergencyControls } from '@/hooks/useEmergencyControls';
import EmergencyControlCard from './EmergencyControlCard';
import EmergencyNotificationDialog from './EmergencyNotificationDialog';
import { 
  Shield, 
  AlertTriangle, 
  Settings, 
  MessageSquareOff, 
  Database, 
  RotateCcw, 
  CheckCircle, 
  UserX, 
  CreditCard, 
  Globe, 
  Eye,
  Megaphone,
  Construction,
  Calendar,
  LogOut,
  Bot,
  Cpu
} from 'lucide-react';

const EmergencyControlsDashboard = () => {
  const {
    controls,
    loading,
    actionLoading,
    updateControl,
    restoreNormalOperations,
    triggerEmergencyBackup,
    emergencyDisableClaude,
    enableClaudeAccess
  } = useEmergencyControls();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-lg">Loading emergency controls...</div>
        </CardContent>
      </Card>
    );
  }

  if (!controls) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-lg text-red-600">Failed to load emergency controls</div>
        </CardContent>
      </Card>
    );
  }

  const isAnyEmergencyActive = !controls.normal_operations || 
    controls.bookings_paused || 
    controls.maintenance_mode || 
    controls.fraud_lockdown_active ||
    controls.messaging_disabled ||
    !controls.claude_api_enabled ||
    !controls.claude_access_enabled;

  const isClaudeDisabled = !controls.claude_api_enabled || !controls.claude_access_enabled;

  return (
    <div className="space-y-6">
      {/* Emergency Status Banner */}
      {isAnyEmergencyActive && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800">
                  EMERGENCY CONTROLS ACTIVE
                </span>
                <Badge variant="destructive">CRITICAL</Badge>
                {isClaudeDisabled && (
                  <Badge variant="destructive" className="bg-purple-600">
                    AI DISABLED
                  </Badge>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore Normal Operations
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restore Normal Operations</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will deactivate ALL emergency controls and restore normal platform operations. 
                      This action will be logged and all admins will be notified.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => restoreNormalOperations()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Restore Normal Operations
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Normal Operations Status */}
      {!isAnyEmergencyActive && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">
                NORMAL OPERATIONS
              </span>
              <Badge className="bg-green-600 text-white">ALL SYSTEMS OPERATIONAL</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Claude API Status
              </h4>
              <p className="text-sm text-gray-600">
                Emergency disable of all Claude API access platform-wide
              </p>
              <div className="flex items-center gap-2">
                <Badge className={controls.claude_api_enabled ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                  {controls.claude_api_enabled ? "ENABLED" : "DISABLED"}
                </Badge>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant={controls.claude_api_enabled ? "destructive" : "default"}
                      size="sm"
                      disabled={actionLoading}
                    >
                      {controls.claude_api_enabled ? "Emergency Disable" : "Enable API"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {controls.claude_api_enabled ? "Emergency Disable Claude API" : "Enable Claude API"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {controls.claude_api_enabled 
                          ? "This will immediately disable all Claude AI functionality platform-wide. This action will be logged."
                          : "This will restore Claude AI API access for all users."
                        }
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => controls.claude_api_enabled ? emergencyDisableClaude("Emergency API disable") : enableClaudeAccess()}
                        className={controls.claude_api_enabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                      >
                        {controls.claude_api_enabled ? "Emergency Disable" : "Enable API"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <EmergencyControlCard
              title="Block Claude Access"
              description="Block user access to Claude AI features"
              icon={<Bot className="h-4 w-4" />}
              isActive={!controls.claude_access_enabled}
              onToggle={(reason) => updateControl('claude_access_enabled', controls.claude_access_enabled, reason)}
              disabled={actionLoading}
              variant="security"
              lastActivated={controls.activated_at}
              activatedBy={controls.activated_by}
            />
          </div>
        </CardContent>
      </Card>

      {/* Platform Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Platform Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmergencyControlCard
            title="Pause All Bookings"
            description="Stop all new booking creation platform-wide"
            icon={<Calendar className="h-4 w-4" />}
            isActive={controls.bookings_paused}
            onToggle={(reason) => updateControl('bookings_paused', !controls.bookings_paused, reason)}
            disabled={actionLoading}
            variant="platform"
            lastActivated={controls.activated_at}
            activatedBy={controls.activated_by}
          />
          
          <EmergencyControlCard
            title="Maintenance Mode"
            description="Display maintenance message to all users"
            icon={<Construction className="h-4 w-4" />}
            isActive={controls.maintenance_mode}
            onToggle={(reason) => updateControl('maintenance_mode', !controls.maintenance_mode, reason)}
            disabled={actionLoading}
            variant="platform"
            lastActivated={controls.activated_at}
            activatedBy={controls.activated_by}
          />
          
          <EmergencyControlCard
            title="Block New Registrations"
            description="Prevent new user account creation"
            icon={<UserX className="h-4 w-4" />}
            isActive={controls.new_registrations_disabled}
            onToggle={(reason) => updateControl('new_registrations_disabled', !controls.new_registrations_disabled, reason)}
            disabled={actionLoading}
            variant="platform"
            lastActivated={controls.activated_at}
            activatedBy={controls.activated_by}
          />
          
          <EmergencyControlCard
            title="Force User Logout"
            description="Immediately log out all users from the platform"
            icon={<LogOut className="h-4 w-4" />}
            isActive={controls.force_logout_users}
            onToggle={(reason) => updateControl('force_logout_users', !controls.force_logout_users, reason)}
            disabled={actionLoading}
            variant="platform"
            lastActivated={controls.activated_at}
            activatedBy={controls.activated_by}
          />
        </CardContent>
      </Card>

      {/* Security Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmergencyControlCard
            title="Fraud Lockdown"
            description="Block all high-risk transactions and activities"
            icon={<AlertTriangle className="h-4 w-4" />}
            isActive={controls.fraud_lockdown_active}
            onToggle={(reason) => updateControl('fraud_lockdown_active', !controls.fraud_lockdown_active, reason)}
            disabled={actionLoading}
            variant="security"
            lastActivated={controls.activated_at}
            activatedBy={controls.activated_by}
          />
          
          <EmergencyControlCard
            title="Manual Review All Bookings"
            description="Require admin approval for all new bookings"
            icon={<Eye className="h-4 w-4" />}
            isActive={controls.manual_review_all_bookings}
            onToggle={(reason) => updateControl('manual_review_all_bookings', !controls.manual_review_all_bookings, reason)}
            disabled={actionLoading}
            variant="security"
            lastActivated={controls.activated_at}
            activatedBy={controls.activated_by}
          />
          
          <EmergencyControlCard
            title="Geographic Blocking"
            description="Block access from high-risk countries"
            icon={<Globe className="h-4 w-4" />}
            isActive={controls.geographic_blocking_enabled}
            onToggle={(reason) => updateControl('geographic_blocking_enabled', !controls.geographic_blocking_enabled, reason)}
            disabled={actionLoading}
            variant="security"
            lastActivated={controls.activated_at}
            activatedBy={controls.activated_by}
          />
          
          <EmergencyControlCard
            title="Payment Restrictions"
            description="Limit allowed payment methods"
            icon={<CreditCard className="h-4 w-4" />}
            isActive={controls.payment_restrictions_active}
            onToggle={(reason) => updateControl('payment_restrictions_active', !controls.payment_restrictions_active, reason)}
            disabled={actionLoading}
            variant="security"
            lastActivated={controls.activated_at}
            activatedBy={controls.activated_by}
          />
        </CardContent>
      </Card>

      {/* Communication Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareOff className="h-5 w-5" />
            Communication Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EmergencyControlCard
              title="Disable Messaging"
              description="Block all platform messaging between users"
              icon={<MessageSquareOff className="h-4 w-4" />}
              isActive={controls.messaging_disabled}
              onToggle={(reason) => updateControl('messaging_disabled', !controls.messaging_disabled, reason)}
              disabled={actionLoading}
              variant="communication"
              lastActivated={controls.activated_at}
              activatedBy={controls.activated_by}
            />
            
            <EmergencyControlCard
              title="Provider Broadcast Active"
              description="Emergency communication system for providers"
              icon={<Megaphone className="h-4 w-4" />}
              isActive={controls.provider_broadcast_active}
              onToggle={(reason) => updateControl('provider_broadcast_active', !controls.provider_broadcast_active, reason)}
              disabled={actionLoading}
              variant="communication"
              lastActivated={controls.activated_at}
              activatedBy={controls.activated_by}
            />
          </div>
          
          <Separator />
          
          <div className="flex justify-center">
            <EmergencyNotificationDialog />
          </div>
        </CardContent>
      </Card>

      {/* Recovery Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Recovery Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Emergency Database Backup</h4>
              <p className="text-sm text-gray-600">
                Trigger an immediate backup of critical platform data
              </p>
              {controls.last_backup_triggered && (
                <p className="text-xs text-gray-500">
                  Last backup: {new Date(controls.last_backup_triggered).toLocaleString()}
                </p>
              )}
              <Button 
                onClick={triggerEmergencyBackup}
                disabled={actionLoading}
                variant="outline"
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                Trigger Backup
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">System Health Status</h4>
              <p className="text-sm text-gray-600">
                Monitor critical system components
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Database:</span>
                  <Badge className="bg-green-600 text-white">Healthy</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>API Services:</span>
                  <Badge className="bg-green-600 text-white">Operational</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Payment Processing:</span>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyControlsDashboard;
