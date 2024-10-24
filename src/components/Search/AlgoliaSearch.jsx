import React from "react";
import pkg from "@docsearch/react";
import { Input } from "@material-tailwind/react";

const { DocSearch } = pkg;

const APP_ID = "ZLPYTBTZ4R";
const INDEX_NAME = "Dev_Kaplan";
const API_KEY = "be46d26dfdb299f9bee9146b63c99c77";

export function AlgoliaSearch() {
    return (
        <div className="group relative">
            <Input
                type="email"
                placeholder="Search"
                className="focus:!border-t-gray-900 group-hover:border-2 group-hover:!border-gray-900"
                labelProps={{
                    className: "hidden",
                }}
                readOnly
            />
            <div className="absolute top-[calc(50%-1px)] right-2.5 -translate-y-2/4">
                <kbd className="rounded border border-blue-gray-100 bg-white px-1 pt-px pb-0 text-xs font-medium text-gray-900 shadow shadow-black/5">
          <span className="mr-0.5 inline-block translate-y-[1.5px] text-base">
            ⌘
          </span>
                    K
                </kbd>
            </div>
            <div className="absolute inset-0 w-full opacity-0">
                <DocSearch indexName={INDEX_NAME} apiKey={API_KEY} appId={APP_ID} />
            </div>
        </div>
    );
}
export default AlgoliaSearch;