import React from "react";
import { useTranslation } from "react-i18next";

const ViewScript = ({
  copyToClipboard,
  setFrontendHost,
  frontendHost,
  setBackendHost,
  backendHost,
}) => {
  const { t } = useTranslation();

  const handleCopyScript = () => {
    copyToClipboard();
  };

  return (
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
        </div>
        <div className="px-[34px]">
          <div className="mb-8">
            <p className="w-fit pb-1.5 text-custom-Dark4 text-sm">{t("widget-content.allow-host-message-label")}</p>
            <input
              className="custom-input2 !text-custom-Dark8 !text-base !font-normal border-custom-LightGrey4 border rounded px-4 max-w-[34rem] w-full  focus:border-blue-500 focus:outline-none"
              id="script-header"
              name="support-message"
              type="text"
              placeholder={t("widget-content.alloed-host-placeholder")}
              onChange={(e) => setFrontendHost(e.target.value)}
              maxLength={120}
              value={frontendHost}
            />
          </div>
          <div className="mb-8">
            <p className="w-fit pb-1.5 text-custom-Dark4 text-sm">{t("widget-content.allow-backend-message-label")}</p>
            <input
              className="custom-input2 !text-custom-Dark8 !text-base !font-normal border-custom-LightGrey4 border rounded px-4 max-w-[34rem] w-full  focus:border-blue-500 focus:outline-none"
              id="script-header"
              name="support-message"
              type="text"
              placeholder={t("widget-content.allowed-backend-placeholder")}
              onChange={(e) => setBackendHost(e.target.value)}
              maxLength={120}
              value={backendHost}
            />
          </div>
          <div className="bg-custom-LightGrey8 rounded-[10px] px-5 pt-5 pb-4">
            <textarea
              id="script-content"
              className="resize-none bg-custom-LightGrey8 focus:outline-none w-full text-base min-h-[55px] font-roboto-mono"
              value={`<script src="https://strapi-gpt.s3.ap-south-1.amazonaws.com/tracking.js" frontendHost='${frontendHost}' backendHost='${backendHost}'></script>`}
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
  );
};

export default ViewScript;
