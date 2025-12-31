import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { UploadCloud, Mic, FileText, AlertTriangle, MapPin, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const { toast } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleUpload = () => {
    toast({
      title: "Content Uploaded",
      description: "Your subscribers have been notified.",
    });
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    toast({
      title: "Checked In Successfully",
      description: "Verified at UNZA Lecture Theatre 1",
      variant: "default", 
    });
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-serif text-primary">Creator Studio</h1>
          <p className="text-sm text-muted-foreground">Share knowledge, earn revenue.</p>
        </div>

        {/* Proof of Presence Card */}
        <div className="bg-secondary/30 rounded-xl p-4 border border-secondary relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <h3 className="font-semibold text-primary">Proof of Presence</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-3">You must be at the lecture hall to upload.</p>
              
              {!isCheckedIn ? (
                <Button size="sm" onClick={handleCheckIn} className="gap-2 bg-primary hover:bg-primary/90">
                  <MapPin className="h-4 w-4" /> Check-in at Venue
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 font-medium text-sm bg-green-100 px-3 py-1.5 rounded-full w-fit">
                  <CheckCircle className="h-4 w-4" /> Verified Present
                </div>
              )}
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="update">Update</TabsTrigger>
            <TabsTrigger value="urgent">Alert</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-accent/5 transition-colors cursor-pointer bg-card">
              <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mb-3">
                <UploadCloud className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-medium">Upload PDF or Image</h4>
              <p className="text-xs text-muted-foreground mt-1">Scan your handwritten notes or upload slides.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Lecture Title</Label>
              <Input placeholder="e.g. Intro to Calculus II" />
            </div>
            
            <Button onClick={handleUpload} className="w-full" disabled={!isCheckedIn}>Publish Notes</Button>
          </TabsContent>

          <TabsContent value="update" className="space-y-4">
            <div className="space-y-2">
              <Label>Quick Update</Label>
              <Textarea placeholder="Share a quick thought, exam tip, or clarification..." className="min-h-[150px]" />
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" size="icon"><Mic className="h-4 w-4" /></Button>
               <Button onClick={handleUpload} className="flex-1" disabled={!isCheckedIn}>Post Update</Button>
            </div>
          </TabsContent>

          <TabsContent value="urgent" className="space-y-4">
            <div className="bg-destructive/10 p-4 rounded-lg flex gap-3 text-destructive border border-destructive/20">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-xs font-medium">This will send a push notification to all 142 subscribers immediately. Use only for emergencies.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Alert Message</Label>
              <Input placeholder="e.g. Class Cancelled, Venue Changed" />
            </div>
            
            <Button variant="destructive" onClick={handleUpload} className="w-full" disabled={!isCheckedIn}>Broadcast Alert</Button>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
