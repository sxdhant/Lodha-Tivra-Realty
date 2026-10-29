'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { isResidenceId } from '@/lib/residences';

/** What the visitor asks for in the enquiry form: a private viewing, or the project's brochure. */
export type EnquiryPurpose = 'viewing' | 'brochure';

type EnquiryRequest = { id: string; purpose: EnquiryPurpose; at: number };

type QuickEnquiryRequest = { residence: string; purpose: EnquiryPurpose; at: number };

type ResidenceUI = {
  /** The residence shown in the detail sheet, if any. */
  openId: string | null;
  sheetRef: React.RefObject<HTMLDialogElement | null>;
  openResidence: (id: string, trigger?: HTMLElement | null) => void;
  /** Called by the sheet's close event, however the sheet was closed. */
  handleSheetClosed: () => void;
  /** Closes the sheet and hands the residence, and what the visitor wants, to the enquiry form. */
  requestEnquiry: (id: string, purpose: EnquiryPurpose) => void;
  enquiryRequest: EnquiryRequest | null;
  /** The small enquiry pop-up: open while this is set. `residence` preselects its project, or 'any'; `purpose` is a viewing/enquiry or the brochure. */
  quickEnquiry: QuickEnquiryRequest | null;
  openQuickEnquiry: (residence?: string, purpose?: EnquiryPurpose) => void;
  closeQuickEnquiry: () => void;
};

const ResidenceUIContext = createContext<ResidenceUI | null>(null);

export function ResidenceProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [enquiryRequest, setEnquiryRequest] = useState<EnquiryRequest | null>(null);
  const [quickEnquiry, setQuickEnquiry] = useState<QuickEnquiryRequest | null>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openResidence = useCallback((id: string, trigger: HTMLElement | null = null) => {
    if (!isResidenceId(id)) return;
    triggerRef.current = trigger;
    setOpenId(id);
    window.history.replaceState(null, '', `#${id}`);
  }, []);

  const handleSheetClosed = useCallback(() => {
    setOpenId(null);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    triggerRef.current?.focus({ preventScroll: true });
    triggerRef.current = null;
  }, []);

  const requestEnquiry = useCallback((id: string, purpose: EnquiryPurpose) => {
    triggerRef.current = null; // focus moves to the form instead of back to the residence
    sheetRef.current?.close();
    setEnquiryRequest({ id, purpose, at: Date.now() });
  }, []);

  const openQuickEnquiry = useCallback((residence = 'any', purpose: EnquiryPurpose = 'viewing') => {
    triggerRef.current = null;
    sheetRef.current?.close();
    setQuickEnquiry({ residence, purpose, at: Date.now() });
  }, []);

  const closeQuickEnquiry = useCallback(() => setQuickEnquiry(null), []);

  // Each residence has a shareable link: /#lodha-elanza opens its sheet.
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (isResidenceId(id)) openResidence(id);
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [openResidence]);

  const value = useMemo(
    () => ({
      openId,
      sheetRef,
      openResidence,
      handleSheetClosed,
      requestEnquiry,
      enquiryRequest,
      quickEnquiry,
      openQuickEnquiry,
      closeQuickEnquiry,
    }),
    [
      openId,
      openResidence,
      handleSheetClosed,
      requestEnquiry,
      enquiryRequest,
      quickEnquiry,
      openQuickEnquiry,
      closeQuickEnquiry,
    ]
  );

  return <ResidenceUIContext value={value}>{children}</ResidenceUIContext>;
}

export function useResidenceUI() {
  const context = useContext(ResidenceUIContext);
  if (!context) throw new Error('useResidenceUI must be used inside ResidenceProvider');
  return context;
}
