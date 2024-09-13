import React from "react";

export const Stats = ({
  data,
}: {
  data: { title: string; value: string | number; desc: string }[];
}) => {
  return (
    <div className="stats border-2 border-white shadow">
      {data.map((item, i) => {
        return (
          <div className="stat" key={i}>
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">{item.title}</div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-desc">{item.desc}</div>
          </div>
        );
      })}
    </div>
  );
};
