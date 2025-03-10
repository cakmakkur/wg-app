import Image from "next/image";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div className="menubar">
        <Link href="/">
          <h3>
            <span>WG</span>- App
          </h3>
        </Link>

        <Image src="/menu.svg" alt="menu icon" width={40} height={40} />
      </div>
      {children}
    </div>
  );
}
