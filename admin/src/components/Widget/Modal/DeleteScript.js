import React from "react";
import { useTranslation } from "react-i18next";

const ViewScript = ({ openAlert, closeAlert, onDelete }) => {
  const { t } = useTranslation();

  if (openAlert) {
    document.querySelector("#delete-confirm-modal").classList.remove("hidden");
  }

  const closeModal = () => {
    document.querySelector("#delete-confirm-modal").classList.add("hidden");
    closeAlert();
  };

  const handleDelete = () => {
    onDelete();
    closeModal();
  };

  return (
    <div
      className="hidden fixed z-30 inset-0 overflow-y-auto"
      id="delete-confirm-modal"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="p-5">
            <h1 className="text-xl text-center">
              {t("common.delete-property-label")} ?
            </h1>
            <form method="post">
              <div className="flex mt-4">
                <button
                  onClick={closeModal}
                  type="button"
                  className="bg-gray-400 p-2 text-white text-center w-full  font-semibold	uppercase tracking-wide hover:bg-gray-300 mr-1"
                >
                  {t("common.cancel-label")}
                </button>
                <button
                  onClick={handleDelete}
                  type="button"
                  className="bg-red-500 p-2 text-white text-center w-full  font-semibold	uppercase tracking-wide hover:bg-red-400 ml-1"
                >
                  {t("common.delete-label")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewScript;
