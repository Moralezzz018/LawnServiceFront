import { FormEvent, useMemo, useState } from 'react';

type AppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AppointmentForm = {
  fullName: string;
  phone: string;
  email: string;
  serviceAddress: string;
  serviceTypes: string[];
  preferredDateTime: string;
  notes: string;
};

const serviceOptions = [
  'General Lawn Service',
  'Bush & Trees Trimming',
  'Plants Remove',
  'Mulching',
  'Planting',
  'Leaves Cleaning & More',
];

const initialForm: AppointmentForm = {
  fullName: '',
  phone: '',
  email: '',
  serviceAddress: '',
  serviceTypes: [],
  preferredDateTime: '',
  notes: '',
};

export function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const [form, setForm] = useState<AppointmentForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const apiUrl = useMemo(() => {
    return import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
  }, []);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof AppointmentForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const toggleServiceType = (service: string) => {
    setForm((prev) => {
      const alreadySelected = prev.serviceTypes.includes(service);
      return {
        ...prev,
        serviceTypes: alreadySelected
          ? prev.serviceTypes.filter((item) => item !== service)
          : [...prev.serviceTypes, service],
      };
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const resetAndClose = () => {
    setForm(initialForm);
    setErrorMessage('');
    setSuccessMessage('');
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.serviceTypes.length === 0) {
      setErrorMessage('Please select at least one service type.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        ...form,
        preferredDateTime: new Date(form.preferredDateTime).toISOString(),
      };

      const response = await fetch(`${apiUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = responseBody?.message || 'Failed to submit appointment request.';
        setErrorMessage(message);
        return;
      }

      setSuccessMessage('Your appointment request has been sent successfully.');
      setForm(initialForm);
    } catch (error) {
      setErrorMessage('Unable to reach server. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close appointment modal"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={resetAndClose}
      ></button>

      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#11170a]/95 text-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#11170a]/95 px-6 py-4">
          <h3 className="text-xl lg:text-2xl font-semibold">Schedule Your Appointment</h3>
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-md border border-white/25 px-3 py-1.5 text-sm hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>

        <form className="px-6 py-5 lg:px-8 lg:py-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm text-white/80">Full Name</span>
              <input
                required
                value={form.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                placeholder="Your full name"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/80">Phone Number</span>
              <input
                required
                value={form.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                placeholder="(901) 000-0000"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-white/80">Email Address</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                placeholder="name@email.com"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-white/80">Service Address</span>
              <input
                required
                value={form.serviceAddress}
                onChange={(e) => handleFieldChange('serviceAddress', e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                placeholder="Street, city, state"
              />
            </label>

            <div className="space-y-2 md:col-span-2">
              <span className="text-sm text-white/80">Service Type(s)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {serviceOptions.map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={form.serviceTypes.includes(service)}
                      onChange={() => toggleServiceType(service)}
                      className="h-4 w-4 rounded border-white/30 bg-transparent"
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-white/80">Preferred Date & Time</span>
              <input
                required
                type="datetime-local"
                value={form.preferredDateTime}
                onChange={(e) => handleFieldChange('preferredDateTime', e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#6B7C2E]"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-white/80">Additional Notes</span>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                placeholder="Any details we should know?"
              />
            </label>
          </div>

          {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-300">{successMessage}</p>}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-5 py-2.5 rounded-lg border border-white/25 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-[#6B7C2E] hover:bg-[#3B4A10] transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Send Appointment Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
