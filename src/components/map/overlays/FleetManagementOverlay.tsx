
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Clock, 
  Trash2, 
  RefreshCw, 
  Eye,
  EyeOff,
  Minimize2,
  GripVertical
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  sentAt: string;
  expiresAt: string;
}

interface FleetManagementOverlayProps {
  position: string;
  visible: boolean;
  minimized: boolean;
  draggable: boolean;
  onMinimize: () => void;
  isFleetMode: boolean;
}

const FleetManagementOverlay: React.FC<FleetManagementOverlayProps> = ({
  position,
  visible,
  minimized,
  draggable,
  onMinimize,
  isFleetMode
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [companyName, setCompanyName] = useState('HOUSIE Fleet Co.');
  const [selectedRole, setSelectedRole] = useState('Driver');

  // Mock data - in real app, this would come from props or API
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Marie Dubois',
      email: 'marie@example.com',
      role: 'Supervisor',
      status: 'online'
    },
    {
      id: '2',
      name: 'Pierre Martin',
      email: 'pierre@example.com',
      role: 'Driver',
      status: 'offline',
      lastSeen: '2h ago'
    },
    {
      id: '3',
      name: 'Sophie Tremblay',
      email: 'sophie@example.com',
      role: 'Driver',
      status: 'online'
    }
  ];

  const pendingInvitations: PendingInvitation[] = [
    {
      id: '1',
      email: 'jean@example.com',
      role: 'Driver',
      sentAt: '2024-01-15',
      expiresAt: '2024-01-22'
    }
  ];

  const handleSendInvite = () => {
    if (inviteEmail.trim()) {
      console.log('Sending invite to:', inviteEmail, 'as', selectedRole);
      // Here you would typically call an API
      setInviteEmail('');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Removing member:', memberId);
  };

  const handleResendInvite = (inviteId: string) => {
    console.log('Resending invite:', inviteId);
  };

  if (!isFleetMode || !visible) return null;

  if (minimized) {
    return (
      <div className={`absolute ${position} z-30`}>
        <Button
          variant="outline"
          size="sm"
          onClick={onMinimize}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Users className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-96 bg-cream/95 backdrop-blur-sm border-3 border-black shadow-2xl pointer-events-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-black text-black flex items-center gap-3" data-draggable-header={draggable}>
            {draggable && <GripVertical className="h-4 w-4 cursor-grab text-black" data-grip="true" />}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            Team Management
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-8 w-8 p-0 hover:bg-cream/80 text-black"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-700 font-medium">
          {teamMembers.length} active members
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Invite Team Member Section */}
        <div className="bg-cream/80 rounded-2xl p-4 border-2 border-black">
          <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-green-600" />
            Invite Team Member
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="border-2 border-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Company Name
              </label>
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="border-2 border-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Role
              </label>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-2 border-2 border-black rounded-md bg-cream font-medium"
              >
                <option value="Driver">Driver</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Coordinator">Coordinator</option>
              </select>
            </div>

            <Button
              onClick={handleSendInvite}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-cream font-bold py-3 rounded-xl border-2 border-black"
              disabled={!inviteEmail.trim()}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Invite
            </Button>
          </div>
        </div>

        {/* Current Team Members */}
        <div className="bg-cream/80 rounded-2xl p-4 border-2 border-black">
          <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Current Team ({teamMembers.length})
          </h3>
          
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-cream rounded-xl border border-black">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <div className="font-bold text-black text-sm">{member.name}</div>
                    <div className="text-xs text-gray-700">{member.email}</div>
                    <Badge 
                      variant="outline" 
                      className="text-xs mt-1 border-black text-black"
                    >
                      {member.role}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {member.status === 'offline' && member.lastSeen && (
                    <span className="text-xs text-gray-600">{member.lastSeen}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="bg-cream/80 rounded-2xl p-4 border-2 border-black">
            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Pending Invitations ({pendingInvitations.length})
            </h3>
            
            <div className="space-y-3">
              {pendingInvitations.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-3 bg-cream rounded-xl border border-black">
                  <div>
                    <div className="font-bold text-black text-sm">{invite.email}</div>
                    <div className="text-xs text-gray-700">
                      Role: {invite.role} • Expires: {invite.expiresAt}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResendInvite(invite.id)}
                    className="text-blue-600 hover:bg-blue-100"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FleetManagementOverlay;
