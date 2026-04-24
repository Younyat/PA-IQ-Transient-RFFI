import { useEffect, useMemo, useState } from "react";
import { ModelController } from "../controllers/ModelController";

export function useModels() {
  const controller = useMemo(() => new ModelController(), []);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await controller.overview());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  return { data, loading, error, reload };
}
