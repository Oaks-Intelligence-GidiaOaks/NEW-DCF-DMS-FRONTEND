import { useContext } from "react";
import EnumeratorFormContext from "../context/enumeratorFormContext";
import { countEmptyProductValues, countValidValueKeys, countValueOccurrences } from "../lib";

function ProgressBar({formState}) {

  const progressPercentage = Math.round(((countValidValueKeys(formState) / countValueOccurrences(formState)) * 100))

  return (
    <div className="flex flex-col gap-1 basis-[280px] pl-3">
     {formState ? <>
      <div className="flex justify-between">
        <span className="text-secondary-gray font-medium text-base">
          Progress bar
        </span>
        <span className="text-primary-gold text-base">
          ({countValidValueKeys(formState)}/{countValueOccurrences(formState)})
        </span>
      </div>
      <div className="w-full h-1 rounded-lg bg-gray-300">
        <div
          className={`h-1 rounded-lg bg-primary-green`}
          style={{ width: progressPercentage + "%" }}
        ></div>
      </div>
      </> : null}
    </div>
  );
}

export default ProgressBar;
