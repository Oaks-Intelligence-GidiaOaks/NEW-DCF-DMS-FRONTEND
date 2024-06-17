import CustomInput from "./CustomInput";

const ProductItemInput = ({
  routesData,
  productData,
  handleState,
  handleDropDownChange,
}) => {
  const handleRoutes = (routesArray) => {
    if (routesArray) {
      return routesArray[0]?.routes
        .filter(
          (route) => route.name.toLowerCase() === productData.name.toLowerCase()
        )
        .map((route) => `${route.start} to ${route.end}`);
    } else return productData.name;
  };

  return (
    <div>
      <>
        {console.log("Product data:", productData)}
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-lg py-6">
          <p className="mb-2 text-lg font-semibold text-primary-green">
            {productData.isTransport
              ? handleRoutes(routesData)
              : productData.name}
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
