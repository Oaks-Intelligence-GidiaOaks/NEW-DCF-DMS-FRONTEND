import CustomInput from "./CustomInput";

const ProductItemInput = ({
  productData,
  handleState,
  handleDropDownChange,
}) => {
  return (
    <div>
      <>
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-lg py-6">
          <p className="mb-2 text-lg font-semibold text-primary-green">
            {productData.name}
          </p>
          {productData.inputs.map((input, index) => {
            return (
              <div key={index}>
                <p className="mb-2">
                  {input.title}
                  <span className="text-red-500">
                    {productData.inputs[index]?.required ? "*" : null}
                  </span>
                </p>
                <CustomInput
                  handleState={handleState}
                  handleDropDownChange={handleDropDownChange}
                  inputType={input.input_type}
                  productData={productData}
                  input={input}
                  inputId={index}
                />
              </div>
            );
          })}
        </div>
      </>
    </div>
  );
};

export default ProductItemInput;
