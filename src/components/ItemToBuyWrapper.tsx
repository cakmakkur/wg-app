import { useRef, useState } from "react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { FormEvent } from "react";

interface ItemType {
  _id: string;
  item: string;
  boughtAt: Date;
  boughtBy: string;
  cost: number;
  pinnedBy: string[];
}

interface PropTypes {
  item: ItemType;
  isPinned: boolean;
  pinnedByList: string[];
  isUpdating: string;
  handlePinItem: (id: string) => void;
  handleBuyItem: (e: FormEvent, id: string, cost: number) => void;
}

export default function ItemToBuyWrapper({
  item,
  isPinned,
  pinnedByList,
  isUpdating,
  handlePinItem,
  handleBuyItem,
}: PropTypes) {
  const [cost, setCost] = useState<number>();
  const sliderDivRef = useRef<HTMLDivElement | null>(null);

  const slideWrapper = (status: string) => {
    if (!sliderDivRef.current) return;
    if (status === "toLeft") {
      sliderDivRef.current.style.transform = "translateX(-50%)";
    } else {
      sliderDivRef.current.style.transform = "translateX(0)";
    }
  };

  return (
    <div className="item_to_buy_wrapper">
      <div ref={sliderDivRef} className="item_to_buy_slider">
        <div className="item_to_buy_wrapper__sec_1">
          <div className="item_to_buy_wrapper__sec_1__left">
            <h3>{item.item}</h3>
            <div className="item_to_buy_wrapper__sec_1__left__pinnedBy">
              <h6>Pinned by:</h6>
              {pinnedByList?.map((n) => {
                return <h5 key={n}>{n}</h5>;
              })}
            </div>
          </div>
          <div className="item_to_buy_wrapper__sec_1__right">
            <button
              onClick={() => handlePinItem(item._id)}
              className={
                isPinned
                  ? "item_to_buy_btn--pinned"
                  : "item_to_buy_btn--unpinned"
              }
            >
              {isUpdating === item._id ? (
                <ClipLoader
                  color="blue"
                  loading={true}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <Image src="/pin.svg" alt="pin icon" width={20} height={20} />
              )}
            </button>
            <button
              onClick={() => slideWrapper("toLeft")}
              className="item_to_buy_btn__buy"
            >
              <Image src="/money.svg" alt="money icon" width={20} height={20} />
            </button>
          </div>
        </div>
        <div className="item_to_buy_wrapper__sec_2">
          <form
            onSubmit={(e) => {
              if (!cost) return;
              handleBuyItem(e, item._id, cost);
            }}
          >
            <input
              // input value from undefined to number // change logic
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="buy_item_amout_input"
              type="number"
              placeholder="€"
            />
            <button className="buy_item_check_btn" type="submit">
              <Image src="/check.svg" alt="check icon" width={25} height={25} />
            </button>
          </form>
          <button
            className="buy_item_undo_btn"
            onClick={() => slideWrapper("toRight")}
          >
            <Image src="/undo.svg" alt="undo icon" width={25} height={25} />
          </button>
        </div>
      </div>
    </div>
  );
}
