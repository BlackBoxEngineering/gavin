"use client";

import "@/lib/amplify-client";
import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Hub } from "aws-amplify/utils";
import { fetchAuthSession } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { getSessionGroups, hasAdminAccess } from "@/lib/adminAccess";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
      <path
        d="m6.75 6.75 10.5 10.5m0-10.5-10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function AuthModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openLoginModal = () => setOpen(true);

    window.addEventListener("triggerLogin", openLoginModal);

    const unsubscribe = Hub.listen("auth", async ({ payload }) => {
      if (payload.event === "signedIn") {
        setOpen(false);
        window.dispatchEvent(new Event("authStateChanged"));
        try {
          const session = await fetchAuthSession();
          const groups = getSessionGroups(session);
          router.push(hasAdminAccess(groups) ? "/admin" : "/");
        } catch {
          router.push("/");
        }
      }

      if (payload.event === "signedOut") {
        setOpen(false);
        window.dispatchEvent(new Event("authStateChanged"));
        router.push("/");
      }
    });

    return () => {
      window.removeEventListener("triggerLogin", openLoginModal);
      unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="gavin-login-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Login dialog"
    >
      <div className="gavin-login-backdrop" onClick={() => setOpen(false)} />
      <div className="gavin-login-panel">
        <div className="gavin-login-header">
          <div className="gavin-login-title">Client Access</div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="header-action header-action-icon gavin-login-close"
            aria-label="Close login modal"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="gavin-login-auth-wrap">
          <Authenticator socialProviders={["google"]} />
        </div>
      </div>
    </div>
  );
}
