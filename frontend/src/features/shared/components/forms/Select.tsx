import React from 'react';
import { SelectOption, SelectProps, SelectVariant } from '../../../../interfaces/SharedInterfaces';

const buttonBaseClass =
  'relative flex w-full items-center justify-between rounded-xl border border-[var(--light-gray)] bg-gradient-to-br from-[var(--system-white)] via-[var(--system-white)] to-[#f3f6ff] text-[var(--system-black)] shadow-[0_14px_40px_-18px_rgba(0,63,123,0.45)] transition hover:border-[var(--docker-blue)] hover:shadow-[0_18px_45px_-16px_rgba(0,63,123,0.5)] focus:outline-none focus:ring-2 focus:ring-[var(--docker-blue)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[var(--dark-tertiary)] dark:from-[var(--dark-secondary)] dark:via-[var(--dark-secondary)] dark:to-[var(--dark-secondary)] dark:text-white dark:shadow-[0_14px_40px_-18px_rgba(24,34,56,0.85)] dark:hover:border-[var(--docker-blue)] dark:hover:shadow-[0_18px_45px_-18px_rgba(24,34,56,0.9)]';

const buttonVariantClass: Record<SelectVariant, string> = {
  default: 'min-h-[48px] px-4 py-3 text-sm font-mediuM',
  navbar: 'h-9 min-w-[160px] px-3 text-xs font-semibold',
};

const listboxBaseClass =
  'absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] shadow-2xl dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]';

const optionBaseClass =
  'flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm text-[var(--system-black)] transition hover:bg-[var(--docker-blue)]/10 focus:bg-[var(--docker-blue)]/15 focus:outline-none dark:text-white dark:hover:bg-[var(--docker-blue)]/20 dark:focus:bg-[var(--docker-blue)]/25';

const optionDisabledClass =
  'cursor-not-allowed opacity-60 hover:bg-transparent focus:bg-transparent';

const caretClass =
  'ml-3 flex h-4 w-4 items-center justify-center text-[var(--medium-gray)] dark:text-white transition-transform';

const overlayClass = 'fixed inset-0 z-40 bg-transparent';

const Select: React.FC<SelectProps> = ({
  id,
  name,
  options,
  onChange,
  className,
  value = '',
  disabled = false,
  variant = 'default',
  'aria-label': ariaLabel,
  placeholder = 'Selecione…',
  'aria-labelledby': ariaLabelledBy,
  noOptionsMessage = 'Nenhuma opção disponível',
}) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  const handleDocumentClick = React.useCallback(
    (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    },
    [containerRef]
  );

  React.useEffect(() => {
    optionRefs.current = [];
  }, [options]);

  React.useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleDocumentClick);
      return () => document.removeEventListener('mousedown', handleDocumentClick);
    }

    return undefined;
  }, [open, handleDocumentClick]);

  React.useEffect(() => {
    if (open) {
      const defaultIndex = selectedOption
        ? options.findIndex((option) => option.value === selectedOption.value)
        : options.findIndex((option) => !option.disabled);

      setActiveIndex(defaultIndex >= 0 ? defaultIndex : null);

      if (defaultIndex >= 0) {
        requestAnimationFrame(() => {
          optionRefs.current[defaultIndex]?.focus({ preventScroll: true });
        });
      }
    } else {
      setActiveIndex(null);
      if (triggerRef.current) {
        triggerRef.current.focus({ preventScroll: true });
      }
    }
  }, [open, options, selectedOption]);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((current) => !current);
  };

  const closeDropdown = () => setOpen(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          setActiveIndex((index) => {
            const next = getNextEnabledIndex(options, index == null ? -1 : index, 1);
            focusOption(next);
            return next;
          });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          setActiveIndex((index) => {
            const next = getNextEnabledIndex(options, index == null ? options.length : index, -1);
            focusOption(next);
            return next;
          });
        }
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!open) {
          setOpen(true);
        } else if (activeIndex != null) {
          const option = options[activeIndex];
          if (!option.disabled) {
            onChange?.(option.value);
            closeDropdown();
          }
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        closeDropdown();
        break;
      default:
        break;
    }
  };

  const focusOption = (index: number | null) => {
    if (index == null) return;
    requestAnimationFrame(() => {
      optionRefs.current[index]?.focus({ preventScroll: true });
    });
  };

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    closeDropdown();
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const next = getNextEnabledIndex(options, index, 1);
        focusOption(next);
        setActiveIndex(next);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const next = getNextEnabledIndex(options, index, -1);
        focusOption(next);
        setActiveIndex(next);
        break;
      }
      case 'Home': {
        event.preventDefault();
        const next = getNextEnabledIndex(options, -1, 1);
        focusOption(next);
        setActiveIndex(next);
        break;
      }
      case 'End': {
        event.preventDefault();
        const next = getNextEnabledIndex(options, options.length, -1);
        focusOption(next);
        setActiveIndex(next);
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const option = options[index];
        if (!option.disabled) {
          onChange?.(option.value);
          closeDropdown();
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        closeDropdown();
        break;
      case 'Tab':
        closeDropdown();
        break;
      default:
        break;
    }
  };

  const renderOption = (option: SelectOption, index: number) => {
    const isSelected = option.value === selectedOption?.value;
    const isDisabled = Boolean(option.disabled);

    return (
      <button
        key={option.value}
        role="option"
        id={`${id ?? 'select'}-option-${option.value}`}
        type="button"
        tabIndex={open ? 0 : -1}
        aria-selected={isSelected}
        disabled={isDisabled}
        ref={(node) => {
          optionRefs.current[index] = node;
        }}
        onClick={() => handleOptionClick(option)}
        onKeyDown={(event) => handleOptionKeyDown(event, index)}
        className={`${optionBaseClass} ${isDisabled ? optionDisabledClass : ''} ${isSelected ? 'bg-[var(--docker-blue)]/10 dark:bg-[var(--docker-blue)]/20' : ''
          }`}
      >
        <span className="flex flex-col items-start text-left">
          <span className="font-medium">{option.label}</span>
          {option.description ? (
            <span className="text-xs text-[var(--medium-gray)] dark:text-white">
              {option.description}
            </span>
          ) : null}
        </span>
        {isSelected ? (
          <span className="text-[var(--docker-blue)]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7.9999 13.5858L4.20703 9.79297L5.62124 8.37875L7.9999 10.7574L14.3786 4.37875L15.7928 5.79297L7.9999 13.5858Z"
                fill="currentColor"
              />
            </svg>
          </span>
        ) : null}
      </button>
    );
  };

  const selectedLabelClass = selectedOption
    ? ''
    : 'text-[var(--medium-gray)] dark:text-white';

  const combinedButtonClass = [buttonBaseClass, buttonVariantClass[variant], className]
    .filter(Boolean)
    .join(' ');

  const containerClass =
    variant === 'navbar' ? 'relative inline-flex min-w-[160px]' : 'relative w-full';

  return (
    <div ref={containerRef} className={containerClass}>
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id ?? 'select'}-listbox` : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={combinedButtonClass}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
      >
        <span className={`flex flex-col text-left ${selectedLabelClass}`}>
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          {selectedOption && selectedOption.description ? (
            <span className="text-xs font-normal text-[var(--medium-gray)] dark:text-white">
              {selectedOption.description}
            </span>
          ) : null}
        </span>
        <span className={`${caretClass} ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.41065 7.91074L5.82486 6.49652L9.99997 10.6716L14.1751 6.49652L15.5893 7.91074L9.99997 13.5L4.41065 7.91074Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </button>

      {open ? <div className={overlayClass} aria-hidden onClick={closeDropdown} /> : null}

      {open ? (
        <div
          id={`${id ?? 'select'}-listbox`}
          role="listbox"
          aria-activedescendant={
            activeIndex != null
              ? `${id ?? 'select'}-option-${options[activeIndex].value}`
              : undefined
          }
          className={listboxBaseClass}
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[var(--medium-gray)] dark:text-white">
              {noOptionsMessage}
            </div>
          ) : (
            options.map((option, index) => renderOption(option, index))
          )}
        </div>
      ) : null}
    </div>
  );
};

function getNextEnabledIndex(options: SelectOption[], startIndex: number, step: 1 | -1) {
  const length = options.length;
  if (length === 0) return null;

  let index = startIndex;
  for (let i = 0; i < length; i += 1) {
    index = (index + step + length) % length;
    if (!options[index].disabled) {
      return index;
    }
  }

  return null;
}

export default Select;
