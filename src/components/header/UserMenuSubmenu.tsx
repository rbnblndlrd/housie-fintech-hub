
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, Zap, Clock, AlertTriangle, Minus, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useNavigate } from 'react-router-dom';

interface UserMenuSubmenuProps {
  providerStatus: string;
  onStatusChange: (status: string) => void;
}

const UserMenuSubmenu: React.FC<UserMenuSubmenuProps> = ({
  providerStatus,
  onStatusChange
}) => {
  const { user } = useAuth();
  const { currentRole, switchRole } = useRoleSwitch();
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'Available', label: 'Available', icon: Zap, color: 'text-green-600' },
    { value: 'Busy', label: 'Busy', icon: Clock, color: 'text-yellow-600' },
    { value: 'Away', label: 'Away', icon: Minus, color: 'text-orange-600' },
    { value: 'DnD', label: 'Do Not Disturb', icon: AlertTriangle, color: 'text-red-600' }
  ];

  const currentStatus = statusOptions.find(status => status.value === providerStatus);
  const StatusIcon = currentStatus?.icon || Zap;

  const handleRoleToggle = async () => {
    const newRole = currentRole === 'provider' ? 'customer' : 'provider';
    try {
      await switchRole(newRole);
      if (window.location.pathname === '/dashboard') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to switch role:', error);
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.profile_image || undefined} alt={user.user_metadata?.full_name || user.email} />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {user.user_metadata?.full_name && (
              <p className="font-medium text-gray-900 truncate">{user.user_metadata.full_name}</p>
            )}
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="start" side="right">
        {/* Profile Access */}
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer p-3"
        >
          <span className="mr-2">👤</span>
          <div>
            <div className="font-medium">Profile & Groups</div>
            <div className="text-xs text-gray-500">Manage profile, crews & collectives</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Provider Status - only show for providers */}
        {currentRole === 'provider' && (
          <>
            <div className="px-3 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <div className="flex items-center gap-1">
                  <StatusIcon className={`h-3 w-3 ${currentStatus?.color}`} />
                  <span className={`text-xs font-medium ${currentStatus?.color}`}>
                    {currentStatus?.label}
                  </span>
                </div>
              </div>
              <Select value={providerStatus} onValueChange={onStatusChange}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => {
                    const Icon = status.icon;
                    return (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-3 w-3 ${status.color}`} />
                          <span>{status.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Role Toggle */}
        <DropdownMenuItem
          onClick={handleRoleToggle}
          className="cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100 p-3"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          <div>
            <div className="font-medium">
              Switch to {currentRole === 'provider' ? 'Customer' : 'Provider'}
            </div>
            <div className="text-xs text-blue-600">
              {currentRole === 'provider' ? 'Book services' : 'Provide services'}
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuSubmenu;
