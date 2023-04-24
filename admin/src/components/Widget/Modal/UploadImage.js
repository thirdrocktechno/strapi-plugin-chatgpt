import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import NewCloseGreyIcon from "../../../public/images/new-close-grey-icon.svg"

const ViewScript = ({
  wrapperDivId,
  src,
  openAlert,
  closeAlert,
  imgInputId,
  title,
  description,
  isImage,
  onFocus,
  handleImageChange,
  onRemove,
  addImageLabel,
}) => {
  const { t } = useTranslation();
  const uploadImageRef = useRef(null);

  if (openAlert) {
    document.querySelector(`#${wrapperDivId}`).classList.remove("hidden");
  }

  const closeModal = () => {
    document.querySelector(`#${wrapperDivId}`).classList.add("hidden");
    closeAlert();
  };

  const handleRemove = () => {
    onRemove();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        uploadImageRef.current &&
        !uploadImageRef.current.contains(event.target)
      ) {
        closeModal();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [uploadImageRef]);

  return (
    <div
      ref={uploadImageRef}
      className="hidden fixed z-30 inset-0 overflow-y-auto"
      id={wrapperDivId}
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
          className="inline-block rounded-[9px] bg-white overflow-hidden shadow-xl transform transition-all align-middle max-w-[391px] w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div className="pb-6 px-[34px] pt-8">
              <div className="flex justify-between items-center">
                <p className="font-medium text-lg custom-Dark2 pb-1">{title}</p>
                <span className="cursor-pointer" onClick={closeModal}>
                  <img
                    className="w-4"
                    src={NewCloseGreyIcon}
                    alt="close icon"
                  />
                </span>
              </div>
              <p className="text-custom-Dark3 text-sm">{description}</p>
            </div>
            <div className="pb-12 px-[34px] max-h-[calc(100vh_-_250px)]">
              <img
                className="w-[200px] h-[200px] object-contain rounded-full mx-auto"
                src={src}
                alt="support executive icon"
              />
            </div>
            <div className="px-[34px] pb-[34px] bg-white relative z-10">
              {isImage ? (
                <div className="flex items-center justify-between">
                  <div>
                    <form
                      action=""
                      method=""
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <label
                        className="bg-blue-500 inline-block text-white text-sm py-3.5 px-12 rounded cursor-pointer"
                        htmlFor={imgInputId}
                      >
                        {t("common.change")}
                      </label>
                    </form>
                  </div>
                  <div className="mx-auto">
                    <p
                      className="text-custom-Red1 text-sm font-medium cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {t("common.remove")}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <form
                    action=""
                    method=""
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <label
                      className="bg-blue-500 inline-block text-center text-white text-sm py-3.5 px-4 rounded w-full cursor-pointer"
                      htmlFor={imgInputId}
                    >
                      {addImageLabel}
                    </label>
                  </form>
                </div>
              )}
              <input
                id={imgInputId}
                name={imgInputId}
                type="file"
                className="sr-only"
                onFocus={onFocus}
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewScript;
