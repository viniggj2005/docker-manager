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
        px-4
        bg-zinc-900
        border-b border-zinc-800
        shadow-sm
        select-none
        z-10
      "
      onDoubleClick={toggleMax}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-xl bg-zinc-800/90 p-1.5 shadow-inner">
          <img
            src={appIcon}
            className="w-6 h-6"
            draggable={false}
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">
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
            text-zinc-300
            hover:bg-zinc-800/90 hover:text-zinc-50
            transition
          "
          aria-label="Minimizar"
        >
          <IoIosRemoveCircleOutline className="w-4 h-4" />
        </button>

        <button
          onClick={toggleMax}
          className="
            inline-flex h-8 w-8 items-center justify-center
            rounded-full
            text-zinc-300
            hover:bg-zinc-800/90 hover:text-zinc-50
            transition
          "
          aria-label={maximized ? "Restaurar" : "Maximizar"}
        >
          <FaRegWindowRestore className="w-4 h-4" />
        </button>

        <button
          onClick={() => Quit()}
          className="
            inline-flex h-8 w-8 items-center justify-center
            rounded-full
            text-[var(--exit-red)]
            hover:bg-[var(--exit-red)] hover:text-white
            transition
          "
          aria-label="Fechar"
        >
          <IoMdCloseCircleOutline className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
