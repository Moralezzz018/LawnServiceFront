import { ChangeEvent, ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import {
  Flower2,
  Layers,
  Leaf,
  LogOut,
  Scissors,
  Shovel,
  TreePine,
  Wind,
} from 'lucide-react';

type AdminPanelProps = {
  token: string;
  onLogout: () => void;
};

type ServicePrice = {
  id: number;
  name: string;
  icon: string;
  price: number;
  unit: string;
  isActive: boolean;
  lastUpdated: string;
};

type ToastState = {
  type: 'success' | 'error';
  message: string;
} | null;

type QuoteLineItem = {
  serviceId: number;
  serviceName: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

type QuoteForm = {
  clientFullName: string;
  phone: string;
  email: string;
  serviceAddress: string;
  notes: string;
};

type AppointmentSearchItem = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  serviceAddress: string;
  serviceTypes: string[];
  notes: string | null;
};

type GalleryImageItem = {
  id: number;
  src: string;
  alt: string;
  position: number;
};

type AdminModule = 'clients' | 'gallery' | 'analysis';

type AppointmentAnalyticsItem = {
  id: string;
  status: 'PENDING' | 'CONTACTED' | 'CLOSED';
  serviceTypes: string[];
  createdAt: string;
};

type QuoteAnalyticsItem = {
  id: string;
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED';
  serviceTypes: string[];
  estimatedAmount: number | string;
  createdAt: string;
};

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Scissors,
  TreePine,
  Shovel,
  Layers,
  Flower2,
  Wind,
};

function formatDate(value: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('es-ES');
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function AdminPanel({ token, onLogout }: AdminPanelProps) {
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [quoteForm, setQuoteForm] = useState<QuoteForm>({
    clientFullName: '',
    phone: '',
    email: '',
    serviceAddress: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<AppointmentSearchItem[]>([]);
  const [isSearchingAppointments, setIsSearchingAppointments] = useState(false);
  const [activeModule, setActiveModule] = useState<AdminModule>('clients');
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [isUploadingGalleryImage, setIsUploadingGalleryImage] = useState(false);
  const [isSavingGalleryOrder, setIsSavingGalleryOrder] = useState(false);
  const [analyticsAppointments, setAnalyticsAppointments] = useState<AppointmentAnalyticsItem[]>([]);
  const [analyticsQuotes, setAnalyticsQuotes] = useState<QuoteAnalyticsItem[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  const requestHeaders = useMemo(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }, [token]);

  const activeServices = useMemo(() => services.filter((service) => service.isActive), [services]);

  const quoteItems = useMemo<QuoteLineItem[]>(() => {
    return activeServices
      .filter((service) => selectedServiceIds.includes(service.id))
      .map((service) => {
        const quantityValue = Number(quantities[service.id] || '1');
        const quantity = Number.isFinite(quantityValue) && quantityValue > 0 ? quantityValue : 1;
        const unitPrice = Number(service.price || 0);

        return {
          serviceId: service.id,
          serviceName: service.name,
          unit: service.unit,
          unitPrice,
          quantity,
          subtotal: Number((unitPrice * quantity).toFixed(2)),
        };
      });
  }, [activeServices, quantities, selectedServiceIds]);

  const total = useMemo(() => {
    return quoteItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [quoteItems]);

  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/service-prices`, {
          headers: requestHeaders,
        });

        if (response.status === 401) {
          onLogout();
          return;
        }

        if (!response.ok) {
          throw new Error('No se pudieron cargar los precios.');
        }

        const payload = await response.json();
        const loaded = (payload.data || []) as ServicePrice[];
        setServices(loaded);
        setPriceInputs(
          loaded.reduce<Record<number, string>>((acc, service) => {
            acc[service.id] = String(Number(service.price ?? 0));
            return acc;
          }, {})
        );
        setSelectedServiceIds(loaded.filter((service) => service.isActive).map((service) => service.id));
        setQuantities(
          loaded.reduce<Record<number, string>>((acc, service) => {
            acc[service.id] = '1';
            return acc;
          }, {})
        );
      } catch (error) {
        setToast({ type: 'error', message: 'No se pudieron cargar los servicios.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [apiUrl, onLogout, requestHeaders]);

  useEffect(() => {
    const loadGallery = async () => {
      setIsLoadingGallery(true);

      try {
        const response = await fetch(`${apiUrl}/gallery`, {
          headers: requestHeaders,
        });

        if (response.status === 401) {
          onLogout();
          return;
        }

        if (!response.ok) {
          throw new Error('No se pudo cargar la galería.');
        }

        const payload = await response.json();
        const rows: GalleryImageItem[] = Array.isArray(payload.data) ? payload.data : [];

        setGalleryImages(rows);
      } catch (error) {
        setToast({ type: 'error', message: 'No se pudieron cargar las imágenes de galería.' });
      } finally {
        setIsLoadingGallery(false);
      }
    };

    loadGallery();
  }, [apiUrl, onLogout, requestHeaders]);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoadingAnalytics(true);

      try {
        const [appointmentsResponse, quotesResponse] = await Promise.all([
          fetch(`${apiUrl}/appointments`, { headers: requestHeaders }),
          fetch(`${apiUrl}/quotes`, { headers: requestHeaders }),
        ]);

        if (appointmentsResponse.status === 401 || quotesResponse.status === 401) {
          onLogout();
          return;
        }

        if (!appointmentsResponse.ok || !quotesResponse.ok) {
          throw new Error('No se pudieron cargar las métricas');
        }

        const appointmentsPayload = await appointmentsResponse.json();
        const quotesPayload = await quotesResponse.json();

        setAnalyticsAppointments(
          Array.isArray(appointmentsPayload.data) ? appointmentsPayload.data : []
        );
        setAnalyticsQuotes(Array.isArray(quotesPayload.data) ? quotesPayload.data : []);
      } catch (error) {
        setToast({ type: 'error', message: 'No se pudieron cargar las métricas de análisis.' });
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    loadAnalytics();
  }, [apiUrl, onLogout, requestHeaders]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const query = searchTerm.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setIsSearchingAppointments(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setIsSearchingAppointments(true);

        const response = await fetch(
          `${apiUrl}/appointments/search?q=${encodeURIComponent(query)}`,
          {
            headers: requestHeaders,
            signal: controller.signal,
          }
        );

        if (response.status === 401) {
          onLogout();
          return;
        }

        if (!response.ok) {
          throw new Error('No se pudieron buscar las citas.');
        }

        const payload = await response.json();
        const results: AppointmentSearchItem[] = Array.isArray(payload.data) ? payload.data : [];
        setSearchResults(results);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearchingAppointments(false);
        }
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [apiUrl, onLogout, requestHeaders, searchTerm]);

  const updateServiceField = (id: number, field: keyof ServicePrice, value: string | number | boolean) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              [field]: value,
            }
          : service
      )
    );
  };

  const updatePriceInput = (id: number, value: string) => {
    if (!/^\d*(?:[.,]\d{0,2})?$/.test(value)) {
      return;
    }

    setPriceInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const commitPriceInput = (id: number) => {
    const rawValue = (priceInputs[id] || '').replace(',', '.');
    const parsed = Number(rawValue);
    const normalized = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;

    updateServiceField(id, 'price', normalized);
    setPriceInputs((prev) => ({
      ...prev,
      [id]: normalized.toFixed(2),
    }));
  };

  const togglePreviewSelection = (id: number) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((serviceId) => serviceId !== id) : [...prev, id]
    );

    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] || '1',
    }));
  };

  const updateQuantity = (id: number, value: string) => {
    if (!/^\d*(?:[.,]\d{0,2})?$/.test(value)) {
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const updateQuoteForm = (field: keyof QuoteForm, value: string) => {
    setQuoteForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const analyticsSummary = useMemo(() => {
    const totalAppointments = analyticsAppointments.length;
    const pendingAppointments = analyticsAppointments.filter((item) => item.status === 'PENDING').length;
    const totalQuotes = analyticsQuotes.length;
    const approvedQuotes = analyticsQuotes.filter((item) => item.status === 'APPROVED').length;

    const conversionRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;

    const approvedRevenue = analyticsQuotes
      .filter((item) => item.status === 'APPROVED')
      .reduce((sum, item) => sum + Number(item.estimatedAmount || 0), 0);

    const monthKey = new Date().toISOString().slice(0, 7);

    const monthlyRevenue = analyticsQuotes
      .filter(
        (item) =>
          item.status === 'APPROVED' &&
          typeof item.createdAt === 'string' &&
          item.createdAt.slice(0, 7) === monthKey
      )
      .reduce((sum, item) => sum + Number(item.estimatedAmount || 0), 0);

    const serviceCounter = analyticsQuotes.reduce<Record<string, number>>((acc, quote) => {
      (quote.serviceTypes || []).forEach((service) => {
        const key = String(service || '').trim();
        if (!key) return;
        acc[key] = (acc[key] || 0) + 1;
      });

      return acc;
    }, {});

    const topServices = Object.entries(serviceCounter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const recentQuotes = [...analyticsQuotes]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
      .map((item) => ({
        id: item.id,
        status: item.status,
        estimatedAmount: Number(item.estimatedAmount || 0),
        createdAt: item.createdAt,
      }));

    return {
      totalAppointments,
      pendingAppointments,
      totalQuotes,
      approvedQuotes,
      conversionRate,
      approvedRevenue,
      monthlyRevenue,
      topServices,
      recentQuotes,
    };
  }, [analyticsAppointments, analyticsQuotes]);

  const applyAppointmentToQuote = (appointment: AppointmentSearchItem) => {
    setQuoteForm((prev) => ({
      ...prev,
      clientFullName: appointment.fullName || '',
      phone: appointment.phone || '',
      email: appointment.email || '',
      serviceAddress: appointment.serviceAddress || '',
      notes: appointment.notes || prev.notes || '',
    }));

    const normalizedTypes = (appointment.serviceTypes || []).map((service) => service.trim());
    const matchedIds = activeServices
      .filter((service) => normalizedTypes.includes(service.name))
      .map((service) => service.id);

    if (matchedIds.length > 0) {
      setSelectedServiceIds(matchedIds);
      setQuantities((prev) => {
        const copy = { ...prev };
        matchedIds.forEach((id) => {
          copy[id] = copy[id] || '1';
        });
        return copy;
      });
    }

    setSearchTerm(`${appointment.fullName} (${appointment.id.slice(0, 8)})`);
    setSearchResults([]);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(`${apiUrl}/service-prices`, {
        method: 'PUT',
        headers: requestHeaders,
        body: JSON.stringify({
          services: services.map((service) => ({
            id: service.id,
            price: Number(service.price),
            unit: service.unit,
            isActive: service.isActive,
          })),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        onLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(payload?.message || 'Error al guardar precios.');
      }

      const savedServices: ServicePrice[] = Array.isArray(payload.data) ? payload.data : services;

      setServices(savedServices);
      setPriceInputs((prev) =>
        savedServices.reduce<Record<number, string>>((acc, service) => {
          acc[service.id] = String(Number(service.price ?? 0).toFixed(2));
          return acc;
        }, { ...prev })
      );
      setToast({ type: 'success', message: 'Prices updated successfully' });
    } catch (error) {
      setToast({ type: 'error', message: 'No se pudieron guardar los precios.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateQuote = async () => {
    if (!quoteForm.clientFullName.trim()) {
      setToast({ type: 'error', message: 'Ingresa el nombre del cliente.' });
      return;
    }

    if (quoteItems.length === 0) {
      setToast({ type: 'error', message: 'Selecciona al menos un servicio para cotizar.' });
      return;
    }

    setIsCreatingQuote(true);

    try {
      const response = await fetch(`${apiUrl}/quotes`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          clientFullName: quoteForm.clientFullName,
          phone: quoteForm.phone || undefined,
          email: quoteForm.email || undefined,
          serviceAddress: quoteForm.serviceAddress || undefined,
          serviceTypes: quoteItems.map((item) => item.serviceName),
          lineItems: quoteItems,
          estimatedAmount: Number(total.toFixed(2)),
          notes: quoteForm.notes || undefined,
          status: 'DRAFT',
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        onLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(payload?.message || 'No se pudo crear la cotización.');
      }

      handleGeneratePdf(payload?.data?.id);
      setToast({ type: 'success', message: 'Cotización creada correctamente.' });
      setQuoteForm({
        clientFullName: '',
        phone: '',
        email: '',
        serviceAddress: '',
        notes: '',
      });
      setSelectedServiceIds([]);
      setQuantities((prev) =>
        Object.keys(prev).reduce<Record<number, string>>((acc, key) => {
          acc[Number(key)] = '1';
          return acc;
        }, {})
      );
    } catch (error) {
      setToast({ type: 'error', message: 'No se pudo guardar la cotización.' });
    } finally {
      setIsCreatingQuote(false);
    }
  };

  const handleGeneratePdf = (quoteId?: string) => {
    if (!quoteForm.clientFullName.trim()) {
      setToast({ type: 'error', message: 'Completa el nombre del cliente para generar el PDF.' });
      return;
    }

    if (quoteItems.length === 0) {
      setToast({ type: 'error', message: 'Selecciona al menos un servicio para generar el PDF.' });
      return;
    }

    const popup = window.open('', '_blank', 'width=900,height=700');

    if (!popup) {
      setToast({ type: 'error', message: 'Permite ventanas emergentes para exportar la cotización.' });
      return;
    }

    const safeNotes = quoteForm.notes.trim() || 'Sin notas';
    const rows = quoteItems
      .map(
        (item) => `
          <tr>
            <td>${item.serviceName}</td>
            <td>${item.quantity} ${item.unit}</td>
            <td>${formatCurrency(item.unitPrice)}</td>
            <td>${formatCurrency(item.subtotal)}</td>
          </tr>
        `
      )
      .join('');

    popup.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Cotización Memphis Lawn Service</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; color: #1E1E1E; margin: 0; padding: 32px; }
            .header { background: #6B7C2E; color: white; padding: 18px 24px; border-radius: 12px; }
            .section { margin-top: 24px; }
            h1,h2,p { margin: 0; }
            h2 { font-size: 18px; margin-bottom: 10px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border-bottom: 1px solid #E5E7EB; padding: 10px 8px; text-align: left; font-size: 14px; }
            th { color: #3B4A10; }
            .total { margin-top: 18px; padding: 14px 16px; background: #D9E8C5; border-radius: 12px; }
            .muted { color: rgba(30,30,30,0.7); font-size: 14px; }
            @media print { body { padding: 18px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Memphis Lawn Service - Cotización</h1>
            <p>${new Date().toLocaleString('es-ES')}${quoteId ? ` · ID: ${quoteId}` : ''}</p>
          </div>

          <div class="section">
            <h2>Datos del cliente</h2>
            <div class="grid muted">
              <div><strong>Nombre:</strong> ${quoteForm.clientFullName || '—'}</div>
              <div><strong>Teléfono:</strong> ${quoteForm.phone || '—'}</div>
              <div><strong>Correo:</strong> ${quoteForm.email || '—'}</div>
              <div><strong>Dirección:</strong> ${quoteForm.serviceAddress || '—'}</div>
            </div>
          </div>

          <div class="section">
            <h2>Detalle de servicios</h2>
            <table>
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>

          <div class="total">
            <strong>Total:</strong> ${formatCurrency(total)}
          </div>

          <div class="section muted">
            <h2>Notas</h2>
            <p>${safeNotes.replace(/\n/g, '<br/>')}</p>
          </div>
        </body>
      </html>
    `);

    popup.document.close();
    popup.focus();
    popup.print();
  };

  const handleOpenGalleryPicker = () => {
    galleryFileInputRef.current?.click();
  };

  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    setGalleryImages((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= prev.length) {
        return prev;
      }

      const reordered = [...prev];
      const [current] = reordered.splice(index, 1);
      reordered.splice(targetIndex, 0, current);

      return reordered.map((image, position) => ({
        ...image,
        position: position + 1,
      }));
    });
  };

  const handleSaveGalleryOrder = async () => {
    if (galleryImages.length === 0) {
      setToast({ type: 'error', message: 'No hay imágenes para reordenar.' });
      return;
    }

    setIsSavingGalleryOrder(true);

    try {
      const response = await fetch(`${apiUrl}/gallery/reorder`, {
        method: 'PUT',
        headers: requestHeaders,
        body: JSON.stringify({
          imageIds: galleryImages.map((image) => image.id),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        onLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(payload?.message || 'No se pudo guardar el orden de galería.');
      }

      const rows: GalleryImageItem[] = Array.isArray(payload.data) ? payload.data : [];
      setGalleryImages(rows);
      setToast({ type: 'success', message: 'Orden de galería actualizado.' });
    } catch (error) {
      setToast({ type: 'error', message: 'No se pudo guardar el orden de galería.' });
    } finally {
      setIsSavingGalleryOrder(false);
    }
  };

  const handleUploadGalleryImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingGalleryImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const authHeaders: Record<string, string> = {};
      if (token) {
        authHeaders.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/gallery`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        onLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(payload?.message || 'No se pudo subir la imagen.');
      }

      const rows: GalleryImageItem[] = Array.isArray(payload.data) ? payload.data : [];
      setGalleryImages(rows);
      setToast({ type: 'success', message: 'Imagen agregada a la galería.' });
    } catch (error) {
      setToast({ type: 'error', message: 'No se pudo subir la imagen.' });
    } finally {
      event.target.value = '';
      setIsUploadingGalleryImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF4] text-[#1E1E1E]">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-[#D9E8C5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <Leaf className="h-6 w-6 text-[#6B7C2E]" />
            <span className="text-lg font-semibold">Memphis Lawn Service</span>
            <span className="rounded-full bg-[#D9E8C5] px-3 py-1 text-xs font-semibold text-[#3B4A10]">
              Admin Panel
            </span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D9E8C5] px-4 py-2 text-sm font-medium text-[#3B4A10] transition-colors hover:bg-[#D9E8C5]"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-8 px-4 py-6 sm:px-6 lg:px-12 lg:py-10">
        <section className="rounded-2xl border border-[#D9E8C5] bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setActiveModule('clients')}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeModule === 'clients'
                  ? 'bg-[#6B7C2E] text-white'
                  : 'border border-[#D9E8C5] bg-white text-[#3B4A10] hover:bg-[#D9E8C5]'
              }`}
            >
              Módulo Cliente
            </button>
            <button
              type="button"
              onClick={() => setActiveModule('gallery')}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeModule === 'gallery'
                  ? 'bg-[#6B7C2E] text-white'
                  : 'border border-[#D9E8C5] bg-white text-[#3B4A10] hover:bg-[#D9E8C5]'
              }`}
            >
              Módulo Galería
            </button>
            <button
              type="button"
              onClick={() => setActiveModule('analysis')}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeModule === 'analysis'
                  ? 'bg-[#6B7C2E] text-white'
                  : 'border border-[#D9E8C5] bg-white text-[#3B4A10] hover:bg-[#D9E8C5]'
              }`}
            >
              Módulo Análisis
            </button>
          </div>
        </section>

        {activeModule === 'clients' && (
          <>
            <section className="rounded-2xl border border-[#D9E8C5] bg-white p-5 shadow-sm lg:p-7">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1E1E1E]">Gestión de precios de servicios</h1>
                  <p className="text-sm text-[#1E1E1E]/65">Configura los valores utilizados en el cálculo de cotizaciones.</p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaving || isLoading}
                  className="rounded-lg bg-[#6B7C2E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3B4A10] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Guardando...' : 'Guardar todo'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] text-left text-xs uppercase tracking-wide text-[#1E1E1E]/60">
                      <th className="py-3 pr-4">Servicio</th>
                      <th className="py-3 pr-4">Icono</th>
                      <th className="py-3 pr-4">Precio base (USD)</th>
                      <th className="py-3 pr-4">Unidad</th>
                      <th className="py-3 pr-4">Estado</th>
                      <th className="py-3">Última actualización</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td className="py-6 text-sm text-[#1E1E1E]/60" colSpan={6}>
                          Cargando servicios...
                        </td>
                      </tr>
                    ) : (
                      services.map((service) => {
                        const Icon = iconMap[service.icon] || Leaf;
                        return (
                          <tr key={service.id} className="border-b border-[#F1F5F9] align-middle">
                            <td className="py-3 pr-4 text-sm font-medium">{service.name}</td>
                            <td className="py-3 pr-4">
                              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#D9E8C5] text-[#3B4A10]">
                                <Icon className="h-4.5 w-4.5" />
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <div className="relative max-w-[170px]">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#1E1E1E]/60">
                                  $
                                </span>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  min={0}
                                  value={priceInputs[service.id] ?? String(service.price ?? 0)}
                                  onChange={(event) => updatePriceInput(service.id, event.target.value)}
                                  onBlur={() => commitPriceInput(service.id)}
                                  className="w-full rounded-lg border border-[#D1D5DB] bg-white py-2 pl-7 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                                />
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <input
                                type="text"
                                maxLength={20}
                                value={service.unit}
                                onChange={(event) => updateServiceField(service.id, 'unit', event.target.value)}
                                className="w-full min-w-[130px] rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <button
                                type="button"
                                onClick={() => updateServiceField(service.id, 'isActive', !service.isActive)}
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                }`}
                              >
                                {service.isActive ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="py-3 text-sm text-[#1E1E1E]/60">{formatDate(service.lastUpdated)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-[#D9E8C5] bg-white p-5 shadow-sm lg:p-7">
              <h2 className="text-xl font-bold text-[#1E1E1E]">Crear cotización de cliente</h2>
              <p className="mt-1 text-sm text-[#1E1E1E]/65">
                Define cantidades por servicio para generar la cotización final que aprobará o rechazará el cliente.
              </p>

              <div className="relative mt-5">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                  placeholder="Buscar cita por ID o nombre del cliente"
                />

                {(isSearchingAppointments || searchResults.length > 0) && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-[#D1D5DB] bg-white shadow-md">
                    {isSearchingAppointments ? (
                      <p className="px-3 py-2 text-sm text-[#1E1E1E]/60">Buscando...</p>
                    ) : (
                      searchResults.map((appointment) => (
                        <button
                          key={appointment.id}
                          type="button"
                          onClick={() => applyAppointmentToQuote(appointment)}
                          className="block w-full border-b border-[#F1F5F9] px-3 py-2 text-left last:border-b-0 hover:bg-[#F9FAF4]"
                        >
                          <p className="text-sm font-medium text-[#1E1E1E]">{appointment.fullName}</p>
                          <p className="text-xs text-[#1E1E1E]/60">
                            ID: {appointment.id.slice(0, 8)} · {appointment.serviceAddress}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                )}

                <p className="mt-2 text-xs text-[#1E1E1E]/55">
                  Puedes buscar una cita existente para autocompletar, o escribir manualmente si no agendó cita.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  value={quoteForm.clientFullName}
                  onChange={(event) => updateQuoteForm('clientFullName', event.target.value)}
                  className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                  placeholder="Nombre del cliente"
                />
                <input
                  value={quoteForm.phone}
                  onChange={(event) => updateQuoteForm('phone', event.target.value)}
                  className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                  placeholder="Teléfono"
                />
                <input
                  type="email"
                  value={quoteForm.email}
                  onChange={(event) => updateQuoteForm('email', event.target.value)}
                  className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                  placeholder="Correo (opcional)"
                />
                <input
                  value={quoteForm.serviceAddress}
                  onChange={(event) => updateQuoteForm('serviceAddress', event.target.value)}
                  className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                  placeholder="Dirección del servicio"
                />
                <textarea
                  value={quoteForm.notes}
                  onChange={(event) => updateQuoteForm('notes', event.target.value)}
                  rows={3}
                  className="md:col-span-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                  placeholder="Notas internas de la cotización"
                />
              </div>

              <div className="mt-6 space-y-3">
                {activeServices.map((service) => {
                  const checked = selectedServiceIds.includes(service.id);
                  const quantity = quantities[service.id] || '1';

                  return (
                    <div
                      key={service.id}
                      className="rounded-lg border border-[#E5E7EB] bg-[#F9FAF4] px-3 py-3 sm:px-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePreviewSelection(service.id)}
                            className="h-4 w-4"
                          />
                          <div>
                            <p className="text-sm font-medium text-[#1E1E1E]">{service.name}</p>
                            <p className="text-xs text-[#1E1E1E]/55">
                              {formatCurrency(Number(service.price))} · {service.unit}
                            </p>
                          </div>
                        </label>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#1E1E1E]/60">Cantidad</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            disabled={!checked}
                            value={quantity}
                            onChange={(event) => updateQuantity(service.id, event.target.value)}
                            className="w-24 rounded-lg border border-[#D1D5DB] bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#6B7C2E] disabled:opacity-60"
                            placeholder="1"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-lg border border-[#D9E8C5] bg-[#D9E8C5]/50 px-4 py-3">
                <p className="text-sm text-[#3B4A10]">Total de la cotización</p>
                <p className="text-2xl font-bold text-[#1E1E1E]">{formatCurrency(total)}</p>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleGeneratePdf()}
                  disabled={isCreatingQuote || isLoading}
                  className="rounded-lg border border-[#D9E8C5] bg-white px-5 py-2.5 text-sm font-medium text-[#3B4A10] transition-colors hover:bg-[#D9E8C5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Generar PDF
                </button>
                <button
                  type="button"
                  onClick={handleCreateQuote}
                  disabled={isCreatingQuote || isLoading}
                  className="rounded-lg bg-[#6B7C2E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3B4A10] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingQuote ? 'Creando cotización...' : 'Crear cotización'}
                </button>
              </div>
            </section>
          </>
        )}

        {activeModule === 'gallery' && (
          <section className="rounded-2xl border border-[#D9E8C5] bg-white p-5 shadow-sm lg:p-7">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1E1E1E]">Galería del sitio</h2>
              <p className="text-sm text-[#1E1E1E]/65">
                Agrega imágenes desde tu dispositivo y reordénalas para controlar cómo se muestran en la web.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadGalleryImage}
              />
              <button
                type="button"
                onClick={handleOpenGalleryPicker}
                disabled={isUploadingGalleryImage}
                className="rounded-lg bg-[#6B7C2E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3B4A10] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploadingGalleryImage ? 'Subiendo imagen...' : 'Agregar a galería'}
              </button>
              <button
                type="button"
                onClick={handleSaveGalleryOrder}
                disabled={isSavingGalleryOrder || isLoadingGallery || galleryImages.length === 0}
                className="rounded-lg border border-[#D9E8C5] bg-white px-5 py-2.5 text-sm font-medium text-[#3B4A10] transition-colors hover:bg-[#D9E8C5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingGalleryOrder ? 'Guardando orden...' : 'Guardar orden'}
              </button>
            </div>
          </div>

          {isLoadingGallery ? (
            <p className="text-sm text-[#1E1E1E]/60">Cargando galería...</p>
          ) : galleryImages.length === 0 ? (
            <p className="text-sm text-[#1E1E1E]/60">No hay imágenes en galería todavía.</p>
          ) : (
            <div className="space-y-3">
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className="flex flex-col gap-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAF4] p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-16 w-16 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1E1E1E]">{image.alt}</p>
                      <p className="text-xs text-[#1E1E1E]/60">Posición: {index + 1}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(index, 'up')}
                      disabled={index === 0}
                      className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-medium text-[#1E1E1E] transition-colors hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(index, 'down')}
                      disabled={index === galleryImages.length - 1}
                      className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-medium text-[#1E1E1E] transition-colors hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Bajar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          </section>
        )}

        {activeModule === 'analysis' && (
          <section className="rounded-2xl border border-[#D9E8C5] bg-white p-5 shadow-sm lg:p-7">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#1E1E1E]">Dashboard de análisis</h2>
              <p className="mt-1 text-sm text-[#1E1E1E]/65">
                Indicadores clave para seguimiento comercial y crecimiento del negocio.
              </p>
            </div>

            {isLoadingAnalytics ? (
              <p className="text-sm text-[#1E1E1E]/60">Cargando métricas...</p>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-[#D9E8C5] bg-[#F9FAF4] p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#3B4A10]/70">Citas totales</p>
                    <p className="mt-2 text-2xl font-bold text-[#1E1E1E]">{analyticsSummary.totalAppointments}</p>
                    <p className="mt-1 text-xs text-[#1E1E1E]/60">Pendientes: {analyticsSummary.pendingAppointments}</p>
                  </div>

                  <div className="rounded-xl border border-[#D9E8C5] bg-[#F9FAF4] p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#3B4A10]/70">Cotizaciones</p>
                    <p className="mt-2 text-2xl font-bold text-[#1E1E1E]">{analyticsSummary.totalQuotes}</p>
                    <p className="mt-1 text-xs text-[#1E1E1E]/60">Aprobadas: {analyticsSummary.approvedQuotes}</p>
                  </div>

                  <div className="rounded-xl border border-[#D9E8C5] bg-[#F9FAF4] p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#3B4A10]/70">Conversión</p>
                    <p className="mt-2 text-2xl font-bold text-[#1E1E1E]">{analyticsSummary.conversionRate.toFixed(1)}%</p>
                    <p className="mt-1 text-xs text-[#1E1E1E]/60">Aprobadas sobre cotizadas</p>
                  </div>

                  <div className="rounded-xl border border-[#D9E8C5] bg-[#F9FAF4] p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#3B4A10]/70">Ingresos aprobados</p>
                    <p className="mt-2 text-2xl font-bold text-[#1E1E1E]">
                      {formatCurrency(analyticsSummary.approvedRevenue)}
                    </p>
                    <p className="mt-1 text-xs text-[#1E1E1E]/60">
                      Este mes: {formatCurrency(analyticsSummary.monthlyRevenue)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <h3 className="text-sm font-semibold text-[#1E1E1E]">Servicios más solicitados</h3>
                    {analyticsSummary.topServices.length === 0 ? (
                      <p className="mt-3 text-sm text-[#1E1E1E]/60">No hay datos suficientes todavía.</p>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {analyticsSummary.topServices.map((service) => (
                          <div
                            key={service.name}
                            className="flex items-center justify-between rounded-lg border border-[#F1F5F9] bg-[#F9FAF4] px-3 py-2"
                          >
                            <span className="text-sm text-[#1E1E1E]">{service.name}</span>
                            <span className="text-xs font-semibold text-[#3B4A10]">{service.count} cot.</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <h3 className="text-sm font-semibold text-[#1E1E1E]">Últimas cotizaciones</h3>
                    {analyticsSummary.recentQuotes.length === 0 ? (
                      <p className="mt-3 text-sm text-[#1E1E1E]/60">No hay cotizaciones registradas.</p>
                    ) : (
                      <div className="mt-3 overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-[#E5E7EB] text-left text-xs uppercase tracking-wide text-[#1E1E1E]/60">
                              <th className="py-2 pr-3">ID</th>
                              <th className="py-2 pr-3">Estado</th>
                              <th className="py-2 pr-3">Monto</th>
                              <th className="py-2">Fecha</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analyticsSummary.recentQuotes.map((quote) => (
                              <tr key={quote.id} className="border-b border-[#F1F5F9]">
                                <td className="py-2 pr-3 text-[#1E1E1E]/80">{quote.id.slice(0, 8)}</td>
                                <td className="py-2 pr-3 text-[#1E1E1E]">{quote.status}</td>
                                <td className="py-2 pr-3 text-[#1E1E1E]">{formatCurrency(quote.estimatedAmount)}</td>
                                <td className="py-2 text-[#1E1E1E]/70">{formatDate(quote.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
