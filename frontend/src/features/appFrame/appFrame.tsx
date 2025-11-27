import {
  Quit,
  WindowMinimise,
  WindowIsMaximised,
  WindowToggleMaximise,
} from "../../../wailsjs/runtime/runtime";
import { useEffect, useState } from "react";
import { FaRegWindowRestore } from "react-icons/fa";
import appIcon from "../../assets/images/appicon.png";
import { IoIosRemoveCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";

export function AppFrame() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    async function check() {
      const isMax = await WindowIsMaximised();
      setMaximized(isMax);
    }
    check();
  }, []);

  async function toggleMax() {
    await WindowToggleMaximise();
    const isMax = await WindowIsMaximised();
    setMaximized(isMax);
  }

  return (
    <div
      className="
        appframe-drag
        h-11
        flex items-center
        px-1
        rounded-t-xl
        bg-[var(--system-white)]
        dark:bg-[var(--dark-primary)]
        border-[var(--light-gray)]
        border-b dark:border-[var(--dark-tertiary)]
        shadow-sm
        select-none
       
      "
      onDoubleClick={toggleMax}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center  pl-1 ">
          <img
            src={appIcon}
            className="w-6 h-6"
            draggable={false}
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--grey-text)]">
            Docker Manager
          </span>
        </div>
      </div>

      <div
        className="
          appframe-no-drag
          ml-auto flex items-center gap-1.5
        "
      >
        <button
          onClick={() => WindowMinimise()}
          className="
            inline-flex h-8 w-8 items-center justify-center
            rounded-full
            dark:text-[var(--light-gray)] hover:bg-[var(--light-gray)]
            dark:hover:bg-[var(--dark-secondary)] hover:scale-95
            transition
          "
          aria-label="Minimizar"
        >
          <IoIosRemoveCircleOutline className="w-6 h-6" />
        </button>

        <button
          onClick={toggleMax}
          className="
            inline-flex h-8 w-8 items-center justify-center
            rounded-full
            dark:text-[var(--light-gray)] hover:bg-[var(--light-gray)]
            dark:hover:bg-[var(--dark-secondary)] hover:scale-95
            transition
          "
          aria-label={maximized ? "Restaurar" : "Maximizar"}
        >
          <FaRegWindowRestore className="w-5 h-5" />
        </button>

        <button
          onClick={() => Quit()}
          className="
            inline-flex h-8 w-8 items-center justify-center
            rounded-full
            text-[var(--exit-red)]
            hover:bg-[var(--exit-red)] hover:text-[var(--system-white)] hover:scale-95
            transition
          "
          aria-label="Fechar"
        >
          <IoMdCloseCircleOutline className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
