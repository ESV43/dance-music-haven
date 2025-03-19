
import { BookingFormData } from "@/types/booking";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalDetailsFormProps {
  formData: Partial<BookingFormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PersonalDetailsForm({ formData, handleInputChange }: PersonalDetailsFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="teamHeadName" className="text-white/90">Team Head Name</Label>
        <Input
          id="teamHeadName"
          name="teamHeadName"
          placeholder="Enter team head name"
          value={formData.teamHeadName || ""}
          onChange={handleInputChange}
          className="bg-navy-light border-navy text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="teamName" className="text-white/90">Team Name</Label>
        <Input
          id="teamName"
          name="teamName"
          placeholder="Enter team name"
          value={formData.teamName || ""}
          onChange={handleInputChange}
          className="bg-navy-light border-navy text-white"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white/90">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone || ""}
            onChange={handleInputChange}
            className="bg-navy-light border-navy text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/90">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email || ""}
            onChange={handleInputChange}
            className="bg-navy-light border-navy text-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="purpose" className="text-white/90">Purpose</Label>
        <Textarea
          id="purpose"
          name="purpose"
          placeholder="Describe the purpose of your booking"
          value={formData.purpose || ""}
          onChange={handleInputChange}
          className="bg-navy-light border-navy text-white resize-none min-h-[100px]"
        />
      </div>
    </div>
  );
}
