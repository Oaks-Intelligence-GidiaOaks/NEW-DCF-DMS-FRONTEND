import { useContext, useEffect, useRef } from "react";
import EnumeratorFormContext from "../context/enumeratorFormContext";

function TabBar({ tabs }) {
  const { setCurrentFormTab, state } = useContext(EnumeratorFormContext);

  let currentFormTab = state.currentFormTab ?? tabs[0];

  return (
    <div>
      <div className="flex justify-start border-b border-mid-gray flex-nowrap mx-auto my-2 pt-3 w-fit bg-white">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className="flex justify-end flex-col gap-1 auto-size cursor-pointer flex-1 min-w-fit"
            onClick={() => setCurrentFormTab(tab)}
          >
            <p
              className={`text-4 ${
                currentFormTab === tab
                  ? "text-primary-green font-bold"
                  : "text-primary-gray"
              } text-center px-4 min-w-fit`}
            >
              {tab}
            </p>
            <div
              className={`${
                currentFormTab === tab
                  ? "h-[2px] bg-primary-green"
                  : "h-[1px] bg-transparent"
              }
             w-full`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabBar;
