export const metadata = {
  title: "Vistavia — Red Inmobiliaria",
  description: "Mapa + Catálogo entre agentes. Sin comisión de plataforma.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
