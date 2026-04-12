import { useEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { property_address: string; client_name: string }) => void;
}

export function NewAppraisalModal({ open, onClose, onCreate }: Props) {
  const [propertyAddress, setPropertyAddress] = useState('');
  const [clientName, setClientName] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!propertyAddress.trim()) return;
    onCreate({
      property_address: propertyAddress.trim(),
      client_name: clientName.trim(),
    });
    setPropertyAddress('');
    setClientName('');
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40"
    >
      <div className="w-full max-w-md rounded-[12px] border border-fog/20 bg-white p-6">
        <h2 className="font-display text-lg font-medium text-ink">
          New appraisal
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label
              htmlFor="property-address"
              className="mb-1.5 block text-sm font-medium text-slate"
            >
              Property address
            </label>
            <input
              ref={inputRef}
              id="property-address"
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              placeholder="123 Main St, City, State"
              className="w-full rounded-[8px] border border-fog/30 px-3 py-2 text-slate focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="client-name"
              className="mb-1.5 block text-sm font-medium text-slate"
            >
              Client name
              <span className="ml-1 text-fog font-normal">(optional)</span>
            </label>
            <input
              id="client-name"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client or lender name"
              className="w-full rounded-[8px] border border-fog/30 px-3 py-2 text-slate focus:border-ink focus:outline-none"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-fog"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!propertyAddress.trim()}
              className="rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment disabled:opacity-40"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
