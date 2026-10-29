export default function PageLoading() {
  return (
    <main
      role="status"
      aria-label="Loading cold storage"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden text-[#e4f7ff] [background:radial-gradient(ellipse_at_50%_42%,#173b55_0%,#0b1f30_48%,#07131f_100%)]"
    >
      <style>{`
        @keyframes ice-pulse { 0%, 100% { transform: scale(.96); opacity: .8; } 50% { transform: scale(1.04); opacity: 1; } }
        @keyframes ice-spin { to { transform: rotate(360deg); } }
        @keyframes ice-float { 0%, 100% { transform: translateY(0); opacity: .35; } 50% { transform: translateY(-9px); opacity: .9; } }
        @media (prefers-reduced-motion: reduce) { .ice-motion { animation: none !important; } }
      `}</style>

      <div
        aria-hidden="true"
        // className="ice-motion"
        className="relative mb-7 flex size-[148px] items-center justify-center rounded-full border border-[rgba(164,225,255,.28)] shadow-[0_0_60px_rgba(87,190,245,.12),inset_0_0_38px_rgba(87,190,245,.08)] [animation:ice-pulse_2.8s_ease-in-out_infinite]"
      >
        <div className="ice-motion absolute size-[116px] rounded-full border border-dashed border-[rgba(164,225,255,.52)] [animation:ice-spin_22s_linear_infinite]" />
        <span className="text-[56px] leading-none [text-shadow:0_0_24px_rgba(125,220,255,.8)]">
          ❄
        </span>
        <span className="absolute right-[15px] top-[31px] size-[7px] rounded-full bg-[#b6edff] shadow-[0_0_12px_#a7eaff]" />
      </div>

      <div className="text-[12px] font-bold uppercase tracking-[.28em]">
        Cold Place
      </div>
      <div className="mt-[9px] text-[14px] text-[#9bbdd0]">
        Keeping everything safe and sound
      </div>
      <div aria-hidden="true" className="mt-[22px] flex gap-[9px]">
        {[0, 1, 2].map((dot) => (
          <span
            className={`ice-motion size-[5px] rounded-full bg-[#8cddff] [animation:ice-float_1.2s_ease-in-out_infinite] ${["[animation-delay:0ms]", "[animation-delay:180ms]", "[animation-delay:360ms]"][dot]}`}
            key={dot}
          />
        ))}
      </div>
      <span className="absolute size-px overflow-hidden [clip:rect(0,0,0,0)]">
        Loading, please wait
      </span>
    </main>
  );
}
