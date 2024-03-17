import { useContext } from "react";
import DropDownMenu from "../DropDownMenu";
import EnumeratorFormContext from "../../context/enumeratorFormContext";

const CustomInput = ({
  inputType,
  productData,
  input,
  handleState,
  handleDropDownChange,
  inputId,
}) => {
  const { handleValue } = useContext(EnumeratorFormContext);

  if (inputType.toLowerCase() === "number") {
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
    );
  }
  if (inputType.toLowerCase() === "text") {
    return (
      <div className="flex items-center justify-start gap-2 relative border-b border-solid border-mid-gray">
        <input
          type="text"
          value={productData["inputs"][inputId].value}
          onChange={(e) => handleState(e, productData, inputId)}
          onWheel={(e) => e.target.blur()}
          placeholder="Enter answer"
          className="flex-1 pl-2 py-2 outline-primary-green"
        />
      </div>
    );
  }
  if (inputType.toLowerCase() === "textarea") {
    return (
      <div className="flex items-center justify-start gap-2 relative border-0 border-solid border-mid-gray">
        <textarea
          placeholder=""
          rows={7}
          className="flex-1 min-h-[100px] max-h-[240px] pl-2 py-2 outline-primary-green border border-solid border-mid-gray rounded-[10px]"
          value={productData["inputs"][inputId].value}
          onChange={(e) => handleState(e, productData, inputId)}
        />
      </div>
    );
  }
  if (inputType.toLowerCase() === "dropdown") {
    return (
      <DropDownMenu
        list={productData["inputs"][inputId].options.map((option) => option)}
        handleChange={(value) =>
          handleDropDownChange(value, productData, inputId)
        }
        item={"item"}
        type={"type"}
        valueTitle={input.title}
        value={productData["inputs"][inputId].value}
        //   i={}
      />
    );
  }
  if (inputType.toLowerCase() === "radio") {
    return (
      <div>
        {productData.inputs[inputId].options.map((variant, i) => (
          <div key={i} className="flex items-center">
            <label
              htmlFor={`${productData.title}-${variant}`}
              className="flex flex-1 items-center gap-x-3 flex-wrap"
            >
              <input
                type="radio"
                id={`${productData.inputs[inputId].title}-${variant}`}
                value={`${variant}`}
                name={`${productData.inputs[inputId].title}`}
                className="p-2 outline-primary-green accent-primary-green"
                defaultChecked={
                  productData["inputs"][inputId].value === variant
                }
                onChange={(e) => handleState(e, productData, inputId)}
              />
              <span className="block py-2">{variant}</span>
            </label>
          </div>
        ))}
      </div>
    );
  }
};

export default CustomInput;
