import React from "react";
import { Truck, RotateCcw, Headphones } from "lucide-react";

const props = [
  { Icon: Truck, title: "Free Shipping", sub: "On all orders over $50" },
  { Icon: RotateCcw, title: "Easy Returns", sub: "30-day money-back guarantee" },
  { Icon: Headphones, title: "24/7 Support", sub: "Customer care when you need it" },
];

const ValuePropsBanner = () => {
  return (
    <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {props.map(({ Icon, title, sub }) => (
        <div
          key={title}
          className="group flex items-center gap-4 px-6 py-3 sm:justify-center"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-600/25 transition-transform duration-200 group-hover:scale-105">
            <Icon className="h-6 w-6" strokeWidth={2} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ValuePropsBanner;
