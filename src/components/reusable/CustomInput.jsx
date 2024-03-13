import { useContext } from "react";
import DropDownMenu from "../DropDownMenu"
import EnumeratorFormContext from "../../context/enumeratorFormContext";

const CustomInput = ({inputType, productData, input, handleState, handleDropDownChange, inputId}) => {
  const {
    handleValue,
  } = useContext(EnumeratorFormContext);

  console.log("gadfgsgsa: ", productData);
  if(inputType.toLowerCase() === "number") {
    return (
        <div className="flex items-center justify-start gap-2 relative border-b border-solid border-mid-gray">
                            <span className="block px-[6px] rounded bg-light-gray">
                              {productData.country.currency.symbol}
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={handleValue(productData["inputs"][inputId].value)}
                              onChange={(e) => handleState(e, productData, inputId)}
                              onWheel={(e) => e.target.blur()}
                              placeholder="Enter answer"
                              className="flex-1 pl-2 py-2 outline-primary-green"
                            />
                          </div>
    )
  }
  if(inputType.toLowerCase() === "text") {
    return (
        <div className="flex items-center justify-start gap-2 relative border-b border-solid border-mid-gray">
                            
                            <input
                              type="text"
                              value={productData["inputs"][inputId].value}
                              onChange={(e) => handleState(e, productData, inputId)}
                              onWheel={(e) => e.target.blur()}
                              placeholder="Enter answer"
                              className="flex-1 py-2 outline-primary-green"
                            />
                          </div>
    )
  }
  if(inputType.toLowerCase() === "textarea") {
    return (
        <div className="flex items-center justify-start gap-2 relative border-b border-solid border-mid-gray">
          <textarea
                      placeholder=""
                      rows={7}
                      className="flex-1 min-h-[100px] max-h-[240px] pl-2 py-2 outline-primary-green border border-solid border-mid-gray rounded-[10px]"
                      value={productData["inputs"][inputId].value}
                      onChange={(e) => handleState(e, productData, inputId)}
                    />
                          </div>
    )
  }
  if(inputType.toLowerCase() === "dropdown") {
    return (
        <DropDownMenu
                              list={productData["inputs"][inputId].options.map((option) => option)}
                              handleChange={(value) => handleDropDownChange(value, productData, inputId)}
                              item={"item"}
                              type={"type"}
                              valueTitle={input.title}
                              value={productData["inputs"][inputId].value}
                            //   i={}
                            />
    )
  }

}

export default CustomInput
