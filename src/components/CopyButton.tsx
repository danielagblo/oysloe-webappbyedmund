import { useEffect, useRef, useState } from "react";

type CopyButtonProps = {
  value: string;
  timeout?: number;
  className?: string;
};

export default function CopyButton({
  value,
  timeout = 2000,
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleCopy = () => {
    const code = value ?? "";
    if (!navigator?.clipboard) {
      return;
    }
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, timeout) as unknown as number;
    });
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy referral code"}
    >
      {copied ? <span aria-hidden>✓</span> : "Copy"}
    </button>
  );
}
