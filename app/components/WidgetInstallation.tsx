import { Bot, Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { InnerCard } from "./InnerCard";
import { Highlight, themes } from "prism-react-renderer";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8 hover:bg-[#262932]"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-gray-400" />
        )}
      </Button>
      <Highlight
        theme={{
          ...themes.nightOwl,
          plain: { ...themes.nightOwl.plain, backgroundColor: "#262932" },
        }}
        code={code.trim()}
        language="html"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="text-sm p-4 rounded overflow-x-auto"
            style={{ ...style, backgroundColor: "#262932" }}
          >
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({ line })}
                style={{ display: "table-row" }}
              >
                <span
                  style={{
                    display: "table-cell",
                    paddingRight: "1em",
                    userSelect: "none",
                    opacity: 0.5,
                    textAlign: "right",
                    color: "#506882",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ display: "table-cell" }}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

interface WidgetInstallationProps {
  siteId: string;
  className?: string;
}

export function WidgetInstallation({
  siteId,
  className,
}: WidgetInstallationProps) {
  return (
    <div className={className}>
      <InnerCard className="p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-primary-blue/20 p-4">
            <Bot className="h-8 w-8 text-primary-blue" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              Get Started with Site Sensei
            </h2>
            <p className="text-gray-400">
              Add the Site Sensei widget to your website to start collecting
              chat data
            </p>
          </div>
          <div className="bg-[#1C1F26] p-4 rounded-lg w-full max-w-2xl text-left">
            <p className="text-sm mb-2 text-primary-blue">
              Add these scripts to your website:
            </p>
            <CodeBlock
              code={`
<script>
  window.sensei = {
    siteId: '${siteId}'
  }
</script>
<script src="${window.location.origin}/widget.js"></script>`}
            />
          </div>
        </div>
      </InnerCard>
    </div>
  );
}
