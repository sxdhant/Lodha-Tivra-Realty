'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type SelectOption = { value: string; label: string; hint?: string };

type Props = {
  id: string;
  name: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

// A dropdown in the site's own style. Follows the ARIA select-only combobox pattern: focus stays on
// the button, the arrow keys move through the list, Enter or Space picks, Escape closes.
export function Select({ id, name, value, options, onChange }: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const [active, setActive] = useState(selectedIndex);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keep the highlighted option in view while arrowing through a long list.
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const openList = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!open) return openList();
        setActive((i) => (event.key === 'ArrowDown' ? Math.min(i + 1, last) : Math.max(i - 1, 0)));
        break;
      }
      case 'Home':
      case 'End':
        if (open) {
          event.preventDefault();
          setActive(event.key === 'Home' ? 0 : last);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) choose(active);
        else openList();
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div className="select" ref={rootRef} data-open={open || undefined}>
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        className="select__button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="select__value">{selected.label}</span>
        <svg className="select__chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ul id={listId} ref={listRef} className="select__list" role="listbox" hidden={!open} tabIndex={-1}>
        {options.map((option, index) => (
          <li
            key={option.value}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={option.value === value}
            className={`select__option${index === active ? ' is-active' : ''}`}
            // The button keeps focus, so a press must not move it.
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => setActive(index)}
            onClick={() => choose(index)}
          >
            <span className="select__text">
              <span className="select__label">{option.label}</span>
              {option.hint && <span className="select__hint">{option.hint}</span>}
            </span>
            <svg className="select__tick" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
