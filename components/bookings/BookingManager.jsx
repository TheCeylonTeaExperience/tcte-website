"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchWithAuth } from "@/lib/apiClient";
import { Calendar as CalendarIcon, AlertTriangle, RefreshCw, XCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookingManager({ booking, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("menu"); // menu, reschedule, cancel
  const [loading, setLoading] = useState(false);
  
  // Reschedule State
  const [newDate, setNewDate] = useState(null);
  
  // Cancel State
  const [reason, setReason] = useState("");
  const [refundAmount, setRefundAmount] = useState(booking.amount);

  const handleReschedule = async () => {
    if (!newDate) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/bookings/${booking.id}/manage`, {
        method: "POST",
        body: JSON.stringify({
          action: "reschedule",
          newDate: newDate,
          reason: "User requested reschedule"
        })
      });
      
      if (res.ok) {
        setOpen(false);
        if (onUpdate) onUpdate();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to reschedule");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/bookings/${booking.id}/manage`, {
        method: "POST",
        body: JSON.stringify({
          action: "cancel",
          reason: reason,
          refundAmount: refundAmount
        })
      });
      
      if (res.ok) {
        setOpen(false);
        if (onUpdate) onUpdate();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setMode("menu");
    setNewDate(null);
    setReason("");
    setRefundAmount(booking.amount);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetState(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Manage</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Booking #{booking.id}</DialogTitle>
          <DialogDescription>
            {mode === "menu" && "Select an action to perform on this booking."}
            {mode === "reschedule" && "Select a new date for this booking."}
            {mode === "cancel" && "Cancel this booking and process refund."}
          </DialogDescription>
        </DialogHeader>

        {mode === "menu" && (
          <div className="grid gap-4 py-4">
            <Button 
              variant="outline" 
              className="h-20 justify-start px-4" 
              onClick={() => setMode("reschedule")}
              disabled={booking.status === "CANCELLED"}
            >
              <RefreshCw className="mr-4 h-6 w-6 text-blue-500" />
              <div className="text-left">
                <div className="font-semibold">Reschedule Date</div>
                <div className="text-xs text-muted-foreground">Move booking to a different day</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 justify-start px-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200" 
              onClick={() => setMode("cancel")}
              disabled={booking.status === "CANCELLED"}
            >
              <XCircle className="mr-4 h-6 w-6 text-red-500" />
              <div className="text-left">
                <div className="font-semibold">Cancel Booking</div>
                <div className="text-xs text-muted-foreground">Cancel and issue refund</div>
              </div>
            </Button>
          </div>
        )}

        {mode === "reschedule" && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>
            {newDate && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Selected: {format(newDate, "PPP")}
              </div>
            )}
          </div>
        )}

        {mode === "cancel" && (
          <div className="space-y-4 py-4">
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div>
                <span className="font-semibold">Warning:</span> This action cannot be undone. The booking will be marked as cancelled.
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Refund Amount (LKR)</Label>
              <Input 
                type="number" 
                value={refundAmount} 
                onChange={(e) => setRefundAmount(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label>Reason for Cancellation</Label>
              <Textarea 
                placeholder="Customer requested cancellation..." 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {mode !== "menu" && (
            <Button variant="ghost" onClick={() => setMode("menu")} disabled={loading}>
              Back
            </Button>
          )}
          
          {mode === "reschedule" && (
            <Button onClick={handleReschedule} disabled={!newDate || loading}>
              {loading ? "Updating..." : "Confirm Reschedule"}
            </Button>
          )}

          {mode === "cancel" && (
            <Button variant="destructive" onClick={handleCancel} disabled={loading}>
              {loading ? "Processing..." : "Confirm Cancellation"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
