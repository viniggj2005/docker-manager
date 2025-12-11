import { IoMdArrowBack } from 'react-icons/io';

const GoBackButton: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => {
  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (onGoBack) {
      onGoBack();
    }
  };
  return (
    <>
      <button
        onClick={goBack}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] px-3 py-2 text-sm hover:scale-[0.98]"
        aria-label="Voltar"
      >
        <IoMdArrowBack className="h-5 w-5" />
        <span className="hidden sm:inline">Voltar</span>
      </button>
    </>
  );
};

export default GoBackButton;
