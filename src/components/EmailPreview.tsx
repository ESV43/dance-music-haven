
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/bookingUtils";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Mail } from "lucide-react";

interface EmailPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EmailData {
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

export function EmailPreview({ isOpen, onClose }: EmailPreviewProps) {
  const [sentEmails, setSentEmails] = useState<EmailData[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
  const [showEmailDetail, setShowEmailDetail] = useState(false);
  
  useEffect(() => {
    // Load sent emails from localStorage
    const emails = JSON.parse(localStorage.getItem('sentConfirmationEmails') || '[]');
    setSentEmails(emails);
  }, [isOpen]);
  
  const handleViewEmail = (email: EmailData) => {
    setSelectedEmail(email);
    setShowEmailDetail(true);
  };
  
  const handleCloseEmailDetail = () => {
    setShowEmailDetail(false);
    setSelectedEmail(null);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[550px] bg-navy border border-gold/20 text-white shadow-[0_0_30px_rgba(212,175,55,0.15)] p-0">
          <DialogHeader className="px-6 pt-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-semibold text-white">
                Sent Confirmation Emails
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="px-6 pb-6">
            {sentEmails.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-300">No confirmation emails have been sent yet.</p>
                <p className="text-gray-400 text-sm mt-2">Complete a booking to see confirmation emails here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sentEmails.map((email, index) => (
                  <div 
                    key={index} 
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => handleViewEmail(email)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white/90">{email.to}</p>
                        <p className="text-white/70 text-sm mt-1">{email.subject}</p>
                      </div>
                      <p className="text-white/50 text-xs">{new Date(email.sentAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEmailDetail} onOpenChange={handleCloseEmailDetail}>
        <DialogContent className="sm:max-w-[650px] bg-white text-gray-800 p-0 max-h-[80vh] overflow-auto">
          {selectedEmail && (
            <>
              <DialogHeader className="px-6 pt-6 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">From: booking-system@example.com</p>
                    <p className="text-sm text-gray-500">To: {selectedEmail.to}</p>
                    <DialogTitle className="text-xl font-semibold text-gray-800 mt-2">
                      {selectedEmail.subject}
                    </DialogTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleCloseEmailDetail} className="text-gray-400 hover:text-gray-800">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="p-6 whitespace-pre-line">
                {selectedEmail.body}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
