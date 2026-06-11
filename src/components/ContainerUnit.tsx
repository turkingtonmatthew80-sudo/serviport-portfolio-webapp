import React from "react";

interface ContainerUnitProps {
  children?: React.ReactNode;
  theme?: string;
  isSquare?: boolean;
  isActive?: boolean;
  isDecorative?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

export function ContainerUnit({
  children,
  theme = "bg-slate-800",
  isSquare = false,
  isActive = false,
  isDecorative = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = "",
}: ContainerUnitProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        relative h-20 flex flex-col justify-center items-center select-none overflow-hidden
        border border-black/10 transition-all duration-300 ease-out
        ${isSquare ? "w-[72px] min-w-[72px] h-20" : "flex-1 md:px-5 px-3 h-20"}
        ${isDecorative ? "" : "cursor-pointer hover:-translate-y-1 hover:brightness-[1.04] active:translate-y-0 active:scale-[0.99]"}
        ${theme}
        ${className}
      `}
    >
      {/* Top and Bottom Steel Rail Outlines - Flat Vector Style */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-black/10 z-10" />
      <div className="absolute bottom-0 inset-x-0 h-[4px] bg-black/15 z-10" />

      {/* Crisp, Minimalist Flat Vertical Corrugation Lines */}
      <div className="absolute inset-0 flex justify-around px-2 pointer-events-none opacity-[0.14] group-hover:opacity-20 transition-opacity">
        <div className="w-[1.5px] h-full bg-black" />
        <div className="w-[1.5px] h-full bg-black" />
        <div className="w-[1.5px] h-full bg-black" />
        <div className="w-[1.5px] h-full bg-black" />
        {!isSquare && (
          <>
            <div className="w-[1.5px] h-full bg-black" />
            <div className="w-[1.5px] h-full bg-black" />
            <div className="w-[1.5px] h-full bg-black" />
            <div className="w-[1.5px] h-full bg-black" />
          </>
        )}
      </div>

      {/* Content wrapper */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pointer-events-none">
        {children}
      </div>

      {/* Highlight outline/shadow wrapper for Active container routing */}
      {isActive && (
        <div className="absolute inset-1 border-[1.5px] border-dashed border-white/60 pointer-events-none rounded-[1px] z-30 animate-pulse" />
      )}
    </div>
  );
}

