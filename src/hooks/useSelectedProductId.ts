import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useSelectedProductId() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = useMemo(
    () =>
      searchParams.get("productId")
        ? Number(searchParams.get("productId"))
        : null,
    [searchParams]
  );

  const setSelectedId = (id: number | null) => {
    setSearchParams(id ? { productId: id.toString() } : {});
  };

  return { selectedId, setSelectedId };
}
