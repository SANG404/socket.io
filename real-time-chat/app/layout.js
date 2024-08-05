import "./globals.css";

export const metadata = {
  title: "Chat Application",
  description: "A real-time chat application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
