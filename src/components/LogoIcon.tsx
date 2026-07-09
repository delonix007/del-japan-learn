export default function LogoIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <rect width="32" height="32" rx="8" fill="#B91C1C"/>
      <rect x="1.5" y="1.5" width="29" height="29" rx="6.5" stroke="white" strokeOpacity="0.3"/>
      {/* Torii gate */}
      <path d="M8 10h16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M8.5 13h15" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M10 10v14M22 10v14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      {/* Kanji 学 */}
      <path d="M13.5 15.5l2.5-2.5 2.5 2.5M14 18h4M13 20l3-2 3 2M14.5 22.5l1.5-1.5 1.5 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 13v3" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  );
}
