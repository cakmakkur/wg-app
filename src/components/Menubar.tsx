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
        {/* <button className="menubar_slider_div__close_btn" onClick={toggleMenu}>
          X
        </button> */}
        <Image
          className="menubar_slider_div__close_btn"
          onClick={toggleMenu}
          src="undo.svg"
          alt="undo icon"
          width={45}
          height={45}
        />
        <div className="menubar_slider__links_div">
          <div className="menubar__links">
            <Image width={30} height={30} alt="home icon" src="/home.svg" />
            <Link
              onClick={toggleMenu}
              className="menubar_slider__links"
              href="/"
            >
              Home
            </Link>
          </div>

          <div className="menubar__links">
            <Image
              width={30}
              height={30}
              alt="shopping bag icon"
              src="/shopping.svg"
            />
            <Link
              onClick={toggleMenu}
              className="menubar_slider__links"
              href="/to_buy_list"
            >
              To-Buy List
            </Link>
          </div>

          <div className="menubar__links">
            <Image
              width={30}
              height={30}
              alt="expenses icon"
              src="/chart.svg"
            />
            <Link
              onClick={toggleMenu}
              className="menubar_slider__links"
              href="/expenses"
            >
              Expenses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
