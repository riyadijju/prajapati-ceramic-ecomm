import { useEffect, useState } from "react";
import axios from "axios";

const useSingleProduct = (id) => {
  const [singleProduct, setSingleProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`);
        setSingleProduct(res.data.product);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { singleProduct, loading };
};

export default useSingleProduct;
