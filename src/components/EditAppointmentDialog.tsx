
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  client: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
  amount: number;
  source: 'housie' | 'google';
}

interface EditAppointmentDialogProps {
  appointment: CalendarEvent | null;
  open: boolean;
  onClose: () => void;
  onUpdateAppointment: (appointment: CalendarEvent) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

const EditAppointmentDialog: React.FC<EditAppointmentDialogProps> = ({
  appointment,
  open,
  onClose,
  onUpdateAppointment,
  onDeleteAppointment
}) => {
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    client: '',
    location: '',
    status: 'confirmed' as const,
    amount: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title,
        time: appointment.time,
        client: appointment.client,
        location: appointment.location,
        status: appointment.status,
        amount: appointment.amount
      });
    }
  }, [appointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appointment) return;

    if (!formData.title || !formData.time || !formData.client) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const updatedAppointment: CalendarEvent = {
      ...appointment,
      title: formData.title,
      time: formData.time,
      client: formData.client,
      location: formData.location,
      status: formData.status,
      amount: formData.amount
    };

    onUpdateAppointment(updatedAppointment);
    onClose();
    
    toast({
      title: "Rendez-vous modifié",
      description: "Le rendez-vous a été mis à jour avec succès",
    });
  };

  const handleDelete = () => {
    if (!appointment) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      onDeleteAppointment(appointment.id);
      onClose();
      
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès",
      });
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le Rendez-vous</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Titre du service *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="ex: Nettoyage résidentiel"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-time">Heure *</Label>
            <Input
              id="edit-time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-client">Client *</Label>
            <Input
              id="edit-client"
              value={formData.client}
              onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
              placeholder="Nom du client"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-location">Adresse</Label>
            <Textarea
              id="edit-location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Adresse du service"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Statut</Label>
              <Select value={formData.status} onValueChange={(value: 'confirmed' | 'pending' | 'completed') => 
                setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En Attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Montant ($)</Label>
              <Input
                id="edit-amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="flex justify-between gap-2 pt-4">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Sauvegarder
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentDialog;
