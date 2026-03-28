const AiBadge = ({ text = "AI рекомендует" }: { text?: string }) => (
  <span className="gradient-cta inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-primary-foreground">
    ✦ {text}
  </span>
);

export default AiBadge;
