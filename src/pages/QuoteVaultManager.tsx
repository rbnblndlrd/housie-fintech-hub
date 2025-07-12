import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  MessageSquareQuote 
} from "lucide-react";
import Header from "@/components/Header";
import QuoteGenerator from "@/components/QuoteGenerator";

interface Quote {
  id: string;
  text: string;
  page: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

const PAGE_CONTEXTS = [
  'all',
  'welcome',
  'booking', 
  'calendar',
  'dashboard',
  'general'
];

const CATEGORIES = [
  'Power Humblebrags™',
  'Calendar Roasts™',
  'Onboarding Lies™',
  'Booking Encouragements',
  'Analytics Smacktalk',
  'System Error Softens',
  'Hype Mode',
  'Sarcastic Truth Bombs'
];

export const QuoteVaultManager = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  
  // Filter states
  const [pageFilter, setPageFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add/Edit dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    page: 'general',
    category: 'Power Humblebrags™',
    is_active: true
  });

  // Preview state
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    filterQuotes();
  }, [quotes, pageFilter, categoryFilter, searchTerm]);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('annette_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quotes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterQuotes = () => {
    let filtered = quotes;

    if (pageFilter !== 'all') {
      filtered = filtered.filter(quote => quote.page === pageFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(quote => quote.category === categoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(quote =>
        quote.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuotes(filtered);
  };

  const handleSaveQuote = async () => {
    try {
      if (editingQuote) {
        // Update existing quote
        const { error } = await supabase
          .from('annette_quotes')
          .update({
            text: formData.text,
            page: formData.page,
            category: formData.category,
            is_active: formData.is_active
          })
          .eq('id', editingQuote.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Quote updated successfully!",
        });
      } else {
        // Create new quote
        const { error } = await supabase
          .from('annette_quotes')
          .insert([{
            text: formData.text,
            page: formData.page,
            category: formData.category,
            is_active: formData.is_active
          }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Quote added successfully!",
        });
      }

      fetchQuotes();
      resetForm();
      setIsAddDialogOpen(false);
      setEditingQuote(null);
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('annette_quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Quote deleted successfully!",
      });
      fetchQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        title: "Error",
        description: "Failed to delete quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setFormData({
      text: quote.text,
      page: quote.page,
      category: quote.category,
      is_active: quote.is_active
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      text: '',
      page: 'general',
      category: 'Power Humblebrags™',
      is_active: true
    });
  };

  const exportQuotes = () => {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `annette-quotes-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Power Humblebrags™': 'bg-orange-500/20 text-orange-300',
      'Calendar Roasts™': 'bg-red-500/20 text-red-300',
      'Onboarding Lies™': 'bg-blue-500/20 text-blue-300',
      'Booking Encouragements': 'bg-green-500/20 text-green-300',
      'Analytics Smacktalk': 'bg-purple-500/20 text-purple-300',
      'System Error Softens': 'bg-yellow-500/20 text-yellow-300',
      'Hype Mode': 'bg-pink-500/20 text-pink-300',
      'Sarcastic Truth Bombs': 'bg-cyan-500/20 text-cyan-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <MessageSquareQuote className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading quote vault...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquareQuote className="w-8 h-8 text-orange-500" />
              Annette Quote Vault
            </h1>
            <p className="text-muted-foreground">
              Manage Annette's witty one-liners and categorized wisdom
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={exportQuotes}
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    resetForm();
                    setEditingQuote(null);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Quote
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="manage" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="manage">Manage Quotes</TabsTrigger>
            <TabsTrigger value="generate">Generate with AI</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <QuoteGenerator />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">

        {/* Filters */}
        <Card className="mb-6 bg-card/50 border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm text-muted-foreground">Search quotes</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search quote text..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Page Context</Label>
                <Select value={pageFilter} onValueChange={setPageFilter}>
                  <SelectTrigger className="w-48 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_CONTEXTS.map((page) => (
                      <SelectItem key={page} value={page}>
                        {page === 'all' ? 'All Pages' : page.charAt(0).toUpperCase() + page.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">{quotes.length}</div>
              <div className="text-sm text-muted-foreground">Total Quotes</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">
                {quotes.filter(q => q.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Quotes</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-400">
                {new Set(quotes.map(q => q.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-400">
                {filteredQuotes.length}
              </div>
              <div className="text-sm text-muted-foreground">Filtered Results</div>
            </CardContent>
          </Card>
        </div>

        {/* Quotes Table */}
        <Card className="bg-card/50 border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-white">Quote</TableHead>
                  <TableHead className="text-white">Page</TableHead>
                  <TableHead className="text-white">Category</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="border-border">
                    <TableCell className="max-w-md">
                      <p className="text-white text-sm leading-relaxed">
                        "{quote.text}"
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                        {quote.page}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(quote.category)}>
                        {quote.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={quote.is_active ? "default" : "secondary"}
                        className={quote.is_active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}
                      >
                        {quote.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewQuote(quote)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuote(quote)}
                          className="text-orange-400 hover:text-orange-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete Quote</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this quote? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteQuote(quote.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-8">
            <MessageSquareQuote className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quotes found matching your filters.</p>
          </div>
        )}

          </TabsContent>
        </Tabs>

        {/* Add/Edit Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingQuote ? 'Edit Quote' : 'Add New Quote'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="quote-text" className="text-white">Quote Text</Label>
                <Textarea
                  id="quote-text"
                  placeholder="Enter Annette's witty quote..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="bg-background/50 text-white"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Page Context</Label>
                  <Select 
                    value={formData.page} 
                    onValueChange={(value) => setFormData({ ...formData, page: value })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_CONTEXTS.filter(p => p !== 'all').map((page) => (
                        <SelectItem key={page} value={page}>
                          {page.charAt(0).toUpperCase() + page.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is-active" className="text-white">
                  Active (will appear in rotation)
                </Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingQuote(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveQuote}
                  disabled={!formData.text.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {editingQuote ? 'Update Quote' : 'Add Quote'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={!!previewQuote} onOpenChange={() => setPreviewQuote(null)}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-white">Quote Preview</DialogTitle>
            </DialogHeader>
            {previewQuote && (
              <div className="bg-background/50 p-6 rounded-lg">
                <div className="text-center">
                  <p className="text-base md:text-xl text-white/90 font-medium leading-relaxed px-4 mb-2">
                    "{previewQuote.text}"
                  </p>
                  <p className="text-xs md:text-sm text-orange-400/80 font-serif">
                    — <span className="font-medium">Annette</span> 🦉
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {previewQuote.category}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};