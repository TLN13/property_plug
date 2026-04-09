// Export properties to CSV
export const exportToCSV = (properties: any[], filename = "properties.csv") => {
  const headers = [
    "ID",
    "Title",
    "Price",
    "Location",
    "Bedrooms",
    "Bathrooms",
    "Description",
    "Image",
  ];
  const rows = properties.map((p) => [
    p.id,
    p.title,
    p.price,
    p.location,
    p.bedrooms,
    p.bathrooms,
    p.description,
    p.image,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) =>
          typeof cell === "string" && (cell.includes(",") || cell.includes('"'))
            ? `"${cell.replace(/"/g, '""')}"`
            : cell
        )
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Export properties to JSON
export const exportToJSON = (
  properties: any[],
  filename = "properties.json"
) => {
  const jsonContent = JSON.stringify(properties, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Convert image file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
