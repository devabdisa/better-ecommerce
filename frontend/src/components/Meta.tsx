import { useEffect } from "react";

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const Meta = ({
  title = "Ethio Panda | Premium E-Commerce Experience",
  description = "Discover the best products with express delivery across Ethiopia. Premium quality and secure payments.",
  keywords = "ecommerce, shopping, ethiopia, electronics, fashion",
}: MetaProps) => {
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = keywords;
      document.head.appendChild(meta);
    }
  }, [title, description, keywords]);

  return null;
};

export default Meta;
