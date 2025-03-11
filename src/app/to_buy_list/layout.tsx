import Menubar from "@/components/Menubar";
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Menubar />
      {children}
    </div>
  );
}
