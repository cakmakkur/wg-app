"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Menubar() {
  const [toggled, setToggled] = useState(false);
  const sliderDiv = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!sliderDiv.current) return;
    if (toggled) {
      sliderDiv.current.style.transform = "translateX(100%)";
    } else {
      sliderDiv.current.style.transform = "translateX(0)";
    }
    setToggled(!toggled);
  };

  return (
    <div className="menubar">
      <Link href="/">
        <h3>
          <span>WG</span>- App
        </h3>
      </Link>
      <Image
        onClick={toggleMenu}
        src="/menu.svg"
        alt="menu icon"
        width={40}
        height={40}
      />
      <div ref={sliderDiv} className="menubar_slider_div">
        <button className="menubar_slider_div__close_btn" onClick={toggleMenu}>
          X
        </button>
        <div className="menubar_slider__links_div">
          <Link className="menubar_slider__links" href="/">
            Home
          </Link>
          <Link className="menubar_slider__links" href="/to_buy_list">
            To-Buy List
          </Link>
          <Link className="menubar_slider__links" href="/">
            Expenses
          </Link>
        </div>
      </div>
    </div>
  );
}
