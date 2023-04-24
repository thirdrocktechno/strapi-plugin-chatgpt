import React from "react";
import { useTranslation } from "react-i18next";

import NewCloseGreyIcon from "../../../public/images/new-close-grey-icon.svg";

const ViewScript = ({
  openAlert,
  closeAlert,
  // currentProperty,
  copyToClipboard,
}) => {
  const { t } = useTranslation();

  if (openAlert) {
    document.querySelector("#view-script-modal").classList.remove("hidden");
  }

  const closeModal = () => {
    document.querySelector("#view-script-modal").classList.add("hidden");
    closeAlert();
  };

  const handleCopyScript = () => {
    copyToClipboard();
  };

  return (
    <div
      className="hidden fixed z-30 inset-0 overflow-y-auto"
      id="view-script-modal"
    >
      <div className="flex items-center justify-center min-h-screen md:p-0 p-5">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-custom-LightGrey9"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block rounded-[10px] bg-white text-left overflow-hidden shadow-xl transform transition-all align-middle max-w-[692px] w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="">
            <div className="flex items-center justify-between pb-3.5 pt-8 px-[34px]">
              <p className="text-xl font-medium text-center text-custom-Dark2">
                {t("your-script.my-script")}
              </p>
              <span className="cursor-pointer" onClick={closeModal}>
                <img
                  className="w-4"
                  src={NewCloseGreyIcon}
                  alt="clode icon"
                />
              </span>
            </div>
            <div className="px-[34px]">
              <div className="bg-custom-LightGrey8 rounded-[10px] px-5 pt-5 pb-4">
                <textarea
                  id="script-content"
                  className="resize-none bg-custom-LightGrey8 focus:outline-none w-full text-base min-h-[75px] font-roboto-mono"
                  readOnly
                ></textarea>
              </div>
            </div>
            <div className="pb-[34px] px-[34px] mt-6">
              <form method="post">
                <div className="">
                  <button
                    onClick={handleCopyScript}
                    type="button"
                    className="bg-blue-500 p-2 text-white py-2 px-4 text-sm font-medium rounded"
                  >
                    {t("your-script.copy-script")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewScript;
