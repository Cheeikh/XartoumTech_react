export const productCategories = [
    "Vêtements traditionnels",
    "Tissus",
    "Tenues de Ville",
    "Abaya",
    "Robe de soirée",
    "Costume Africaine",
    "Accessoires"
  ];
  
  const generateProductsForCategory = (categoryName, startId) => {
    return Array.from({ length: 12 }, (_, index) => ({
      id: startId + index,
      name: `${categoryName} - Article ${index + 1}`,
      price: Math.floor(Math.random() * 50000) + 1000,
      category: categoryName,
      image: `/api/placeholder/300/300?text=${encodeURIComponent(categoryName)}-${index + 1}`,
      description: `Description de ${categoryName} - Article ${index + 1}`,
      colors: ['Rouge', 'Bleu', 'Vert'],
      sizes: ['S', 'M', 'L', 'XL'],
    }));
  };
  
  export const allProducts = productCategories.flatMap((category, index) => 
    generateProductsForCategory(category, index * 12 + 1)
  );