import React from "react";
import { ResponsiveLine } from "@nivo/line";
// import { format } from "date-fns";
// import { meshdata } from "../meshedLineData";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 andtrac
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const NewMeshedLineChart = ({
  data: MeshedLineD,
  xLabel,
  yLabel,
  xScale,
  yScale,
  tooltipConfig,
  formatDate,
}) => {
  return MeshedLineD?.length > 0 ? (
    <ResponsiveLine
      className="responsive-line-chart"
      data={MeshedLineD}
      margin={{ top: 50, right: 110, bottom: 50, left: 120 }}
      xScale={xScale}
      yScale={yScale}
      yFormat={(d) => formatDate(d)}
      curve="natural"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: xLabel,
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 2,
        tickPadding: 2,
        tickRotation: 0,
        format: (d) => formatDate(d),
        // legend: yLabel,
        legendOffset: -10,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      enablePoints={true} // Disable the points on the lines
      // enableArea // Enable the filled area under the lines
      enableSlices="x"
      useMesh={false}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 8,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
          itemWrapperStyle: {
            wordBreak: "break-all",
          },
          itemTextStyle: {
            fontSize: "5px",
          },
        },
      ]}
      tooltip={tooltipConfig}
    />
  ) : (
    <div className="h-32 grid place-items-center">No chart data..</div>
  );
};

export default NewMeshedLineChart;
