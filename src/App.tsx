import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { getProductDetail, getProductList } from "./api";

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const selectedId = searchParams.get("productId")
    ? Number(searchParams.get("productId"))
    : null;

  const { data: products, isLoading: isLoadingProducts } = useQuery(
    "products",
    getProductList
  );

  const { data: productDetail, isLoading: isLoadingDetail } = useQuery(
    ["product", selectedId],
    () => (selectedId ? getProductDetail(selectedId) : null),
    {
      enabled: !!selectedId,
    }
  );

  const handleProductSelect = (id: number | null) => {
    setSearchParams(id ? { productId: id.toString() } : {});
  };

  useEffect(() => {
    setIsSheetOpen(!!selectedId);
  }, [selectedId]);

  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading products...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Sheet
            key={product.id}
            open={isSheetOpen && selectedId === product.id}
            onOpenChange={(open) => {
              setIsSheetOpen(open);
              if (!open) handleProductSelect(null);
            }}
          >
            <SheetTrigger asChild>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleProductSelect(product.id)}
              >
                <CardHeader className="p-4">
                  <div className="aspect-square w-full relative mb-2">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <h2 className="font-semibold line-clamp-2">
                    {product.title}
                  </h2>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>
                    <span className="font-bold">${product.price}</span>
                  </div>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent className="w-[90vw] sm:w-[540px]">
              {isLoadingDetail ? (
                <div className="flex items-center justify-center h-full">
                  Loading details...
                </div>
              ) : productDetail ? (
                <div className="h-full overflow-y-auto flex flex-col justify-center">
                  <div className="aspect-square w-full relative mb-4">
                    <img
                      src={productDetail.image}
                      alt={productDetail.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    {productDetail.title}
                  </h2>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      {productDetail.category}
                    </span>
                    <span className="text-xl font-bold">
                      ${productDetail.price}
                    </span>
                  </div>
                  <p className="text-gray-700">{productDetail.description}</p>
                </div>
              ) : null}
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
}
