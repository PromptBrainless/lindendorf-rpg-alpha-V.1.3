import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SpielleiterBereich } from "@/components/welt/SpielleiterBereich";
import { LeiterLogin } from "@/components/game/LeiterLogin";
import { leiterFrei } from "@/game/leiter-login";

export const Route = createFileRoute("/editor")({ component: EditorPage });

function EditorPage() {
  const [frei, setFrei] = useState(() => leiterFrei());
  if (!frei) {
    return (
      <div className="min-h-screen bg-bg text-fg">
        <LeiterLogin onOk={() => setFrei(true)} onClose={() => window.location.assign("/")} />
      </div>
    );
  }
  return <SpielleiterBereich />;
}
