export const metadata = {
  title: "Vehemence",
  description: "Vehemence - Games, community, and more."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
