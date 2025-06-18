
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

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

interface AddAppointmentDialogProps {
  selectedDate: Date | undefined;
  onAddAppointment: (appointment: Omit<CalendarEvent, 'id'>) => void;
  children?: React.ReactNode;
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
  selectedDate,
  onAddAppointment,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    client: '',
    location: '',
    status: 'confirmed' as 'confirmed' | 'pending' | 'completed',
    amount: 0
  });
  const { toast } = useToast();

  // Debug logging for selected date
  useEffect(() => {
    console.log('AddAppointmentDialog - selectedDate changed:', selectedDate);
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      console.error('No date selected when trying to create appointment');
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.time || !formData.client) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Create a local date object without timezone conversion
    const appointmentDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    
    console.log('Creating appointment for date:', {
      originalSelectedDate: selectedDate,
      appointmentDate: appointmentDate,
      appointmentYear: appointmentDate.getFullYear(),
      appointmentMonth: appointmentDate.getMonth(),
      appointmentDay: appointmentDate.getDate(),
      appointmentDateString: appointmentDate.toDateString(),
      selectedDateString: selectedDate.toDateString(),
      formData: formData
    });

    const newAppointment: Omit<CalendarEvent, 'id'> = {
      title: formData.title,
      date: appointmentDate,
      time: formData.time,
      client: formData.client,
      location: formData.location,
      status: formData.status,
      amount: formData.amount,
      source: 'housie'
    };

    onAddAppointment(newAppointment);
    
    // Reset form
    setFormData({
      title: '',
      time: '',
      client: '',
      location: '',
      status: 'confirmed',
      amount: 0
    });

    setOpen(false);
    
    toast({
      title: "Rendez-vous ajouté",
      description: `Rendez-vous créé pour le ${appointmentDate.toLocaleDateString('fr-FR')}`,
    });
  };

  // Format the selected date for display
  const formatSelectedDate = (date: Date | undefined) => {
    if (!date) return 'Aucune date sélectionnée';
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un Rendez-vous
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un Rendez-vous</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Date sélectionnée: {formatSelectedDate(selectedDate)}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du service *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="ex: Nettoyage résidentiel"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Heure *</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
              placeholder="Nom du client"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Adresse</Label>
            <Textarea
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Adresse du service"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
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
              <Label htmlFor="amount">Montant ($)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={!selectedDate}
            >
              Créer le Rendez-vous
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentDialog;
