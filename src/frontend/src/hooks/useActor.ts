import { Actor, HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useState } from "react";
import { idlFactory } from "../declarations/backend.did";
import { useInternetIdentity } from "./useInternetIdentity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = Record<string, (...args: any[]) => any>;

const CANISTER_ID =
  (typeof process !== "undefined" && process.env?.CANISTER_ID_BACKEND) || "";

export function useActor(): { actor: AnyActor | null; isFetching: boolean } {
  const { identity } = useInternetIdentity();
  const [actor, setActor] = useState<AnyActor | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsFetching(true);

    (async () => {
      try {
        const agentOptions = identity ? { identity } : {};
        const agent = HttpAgent.createSync(agentOptions);

        const canisterId = CANISTER_ID;
        if (!canisterId) {
          setActor(null);
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const a = Actor.createActor<any>(idlFactory, {
          agent,
          canisterId,
        });

        if (!cancelled) setActor(a as AnyActor);
      } catch {
        if (!cancelled) setActor(null);
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [identity]);

  return { actor, isFetching };
}
