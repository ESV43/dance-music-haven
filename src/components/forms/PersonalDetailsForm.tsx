
import { BookingFormData } from "@/types/booking";

interface PersonalDetailsFormProps {
  formData: Partial<BookingFormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isAuthenticated?: boolean;
}

export function PersonalDetailsForm({ 
  formData, 
  handleInputChange,
  isAuthenticated = false
}: PersonalDetailsFormProps) {
  return (
    <div className="grid gap-4">
      <div className="form-control">
        <label htmlFor="teamHeadName" className="block text-sm font-medium text-white/80 mb-1">
          Team Head Name
        </label>
        <input
          type="text"
          id="teamHeadName"
          name="teamHeadName"
          value={formData.teamHeadName || ""}
          onChange={handleInputChange}
          placeholder="Enter name of team head"
          className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent"
          required
        />
      </div>
      
      <div className="form-control">
        <label htmlFor="teamName" className="block text-sm font-medium text-white/80 mb-1">
          Team Name
        </label>
        <input
          type="text"
          id="teamName"
          name="teamName"
          value={formData.teamName || ""}
          onChange={handleInputChange}
          placeholder="Enter your team name"
          className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent"
          required
        />
      </div>
      
      <div className="form-control">
        <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone || ""}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent"
          required
        />
      </div>
      
      <div className="form-control">
        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ""}
          onChange={handleInputChange}
          placeholder="Enter your email address"
          className={`w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent ${isAuthenticated ? 'bg-white/10' : ''}`}
          readOnly={isAuthenticated}
          required
        />
        {isAuthenticated && (
          <p className="text-xs text-green-400 mt-1">✓ Verified email</p>
        )}
      </div>
      
      <div className="form-control">
        <label htmlFor="purpose" className="block text-sm font-medium text-white/80 mb-1">
          Purpose of Booking
        </label>
        <textarea
          id="purpose"
          name="purpose"
          value={formData.purpose || ""}
          onChange={handleInputChange}
          placeholder="Briefly describe the purpose of your booking"
          rows={3}
          className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent resize-none"
          required
        />
      </div>
    </div>
  );
}
