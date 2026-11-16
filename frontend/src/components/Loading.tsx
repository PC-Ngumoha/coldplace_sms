export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex w-full justify-center py-8 text-[#67b7d1]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        width="48"
        height="48"
        className="animate-[spin_2.5s_linear_infinite] motion-reduce:animate-none"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M24 5v38M7.55 14.5l32.9 19M7.55 33.5l32.9-19" />
          <path d="m19 9 5 5 5-5M19 39l5-5 5 5M8 20l7-1-2-7M40 28l-7 1 2 7M13 36l2-7-7 1M35 12l-2 7 7-1" />
        </g>
      </svg>
    </div>
  );
}
