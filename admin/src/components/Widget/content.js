import React, { useState } from "react";
import axios from "axios";
import { useNotification } from '@strapi/helper-plugin';
import { useTranslation } from "react-i18next";
import { auth } from '@strapi/helper-plugin';

import Preview from "./Components/Preview";
import UploadImageModal from "./Modal/UploadImage";

import ExecutivePlaceHolderSmall from '../../public/images/executive-placeholder-small.svg';
import PencilBlueImageIcon from '../../public/images/pencil-bule-image-icon.svg';

export default function Content({
  executiveImage,
  setExecutiveImage,
  companyLogo,
  setCompanyLogo,
  headerContent,
  setHeaderContent,
  supportMessageContent,
  setSupportMessageContent,
  colors,
  widgetPosition,
}) {
  const toggleNotification = useNotification();
  const { t } = useTranslation();
  // const { currentProperty } = useContext(UserContext);

  const [isExecutiveImgModalOpen, setIsExecutiveImgModalOpen] = useState(false);
  const [isCompanyLogoModalOpen, setISCompanyLogoModalOpen] = useState(false);

  async function handleImageChange(e) {
    const inputImage = e.target.files && e.target.files[0];
    if (!inputImage) return;
    e.target.value = null;

    if (inputImage) {
      let fd = new FormData();
      fd.append("files", inputImage);
      fd.append("fileInfo", JSON.stringify({ "name": inputImage.name, "folder": null }));
      try {
        const res = await axios.post(`${process.env.STRAPI_ADMIN_BACKEND_URL}/upload`, fd, {
          headers: {
            Authorization: `Bearer ${auth.getToken()}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        });

        toggleNotification({
          type: "success",
          message: t("your-script.company-profile-image-update-successfully-label")
        });

        setExecutiveImage(`${process.env.STRAPI_ADMIN_BACKEND_URL}${res.data[0].url}`);
      } catch (error) {
        console.log('handleImageChange Upload Err>>',error);
      }
    }
  }

  async function updateCompanyLogo(e) {
    const inputImage = e.target.files && e.target.files[0];
    if (!inputImage) return;
    e.target.value = null;

    if (inputImage) {
      let fd = new FormData();
      fd.append("files", inputImage);
      fd.append("fileInfo", JSON.stringify({ "name": inputImage.name, "folder": null }));
      try {
        const res = await axios.post(`${process.env.STRAPI_ADMIN_BACKEND_URL}/upload`, fd, {
          headers: {
            Authorization: `Bearer ${auth.getToken()}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        });

        toggleNotification({
          type: "success",
          message: t("your-script.company-logo-update-successfully-label")
        })

        setCompanyLogo(`${process.env.STRAPI_ADMIN_BACKEND_URL}${res.data[0].url}`);
      } catch (error) {
        console.log('updateCompanyLogo err',error);
      }
    }
  }

  const handleEditCompanyLogo = () => {
    setIsExecutiveImgModalOpen(false);
    setISCompanyLogoModalOpen(true);
  };

  const handleEditExectiveImg = () => {
    setIsExecutiveImgModalOpen(true);
    setISCompanyLogoModalOpen(false);
  };

  return (
    <div class="test">
      <div class="flex h-[calc(100vh_-_146px)]">
        <div class="w-1/2 border-r border-custom-LightGrey3">
          <form action="" method="" onSubmit={(e) => e.preventDefault()}>
            <div class="pt-[34px] px-[34px]">

              <div className="pb-6">
                <div className="flex justify-start items-start">
                  <div className="pr-20">
                    <p className="text-custom-Dark8 text-base pb-0.5">{t("widget-content.executive-image-label")}</p>
                    <p className="text-custom-LightGrey10 text-xs">{t("widget-content.image-note-label")}</p>
                    <div className="pt-4 relative w-fit">
                      <img
                        className="w-14 h-14 object-cover rounded-full"
                        src={executiveImage ? executiveImage : ExecutivePlaceHolderSmall}
                        alt="support executive icon placeholder"
                      />
                      <img
                        onClick={() => handleEditExectiveImg()}
                        className="absolute -bottom-3 -right-3 cursor-pointer"
                        src={PencilBlueImageIcon}
                        alt="edit icon"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-custom-Dark8 text-base pb-0.5">{t("widget-content.company-logo-label")}</p>
                    <p className="text-custom-LightGrey10 text-xs">{t("widget-content.image-note-label")}</p>
                    <div className="pt-4 relative w-fit">
                      <img
                        className="w-14 h-14 object-cover rounded-full"
                        src={companyLogo}
                        alt="company logo placeholder placeholder"
                      />
                      <img
                        onClick={() => handleEditCompanyLogo()}
                        className="absolute -bottom-3 -right-3 cursor-pointer"
                        src={PencilBlueImageIcon}
                        alt="edit icon"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <p className="w-fit pb-1.5 text-custom-Dark4 text-sm">{t("widget-content.support-message-label")}</p>
                <input
                  className="custom-input2 !text-custom-Dark8 !text-base !font-normal border-custom-LightGrey4 border rounded px-4 max-w-[34rem] w-full  focus:border-blue-500 focus:outline-none"
                  id="script-header"
                  name="support-message"
                  type="text"
                  placeholder={t("widget-content.support-message-placeholder")}
                  onChange={(e) => setSupportMessageContent(e.target.value)}
                  maxLength={120}
                  value={supportMessageContent}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="w-1/2">
          <Preview
            executiveImage={executiveImage ? executiveImage : ExecutivePlaceHolderSmall}
            companyLogo={companyLogo}
            supportMessageContent={supportMessageContent}
            headerContent={headerContent}
            chatInitiation={false}
            colors={colors}
            widgetPosition={widgetPosition}
          />
        </div>
      </div>
      <UploadImageModal
        wrapperDivId="upload-image-modal-executive"
        openAlert={isExecutiveImgModalOpen}
        closeAlert={() => setIsExecutiveImgModalOpen(false)}
        imgInputId="chat-support-image"
        title={t("widget-content.executive-image-label")}
        description={t("widget-content.executive-image-description")}
        src={executiveImage ? executiveImage : ExecutivePlaceHolderSmall}
        isImage={executiveImage}
        handleImageChange={handleImageChange}
        addImageLabel={t("common.add-image")}
      />

      <UploadImageModal
        wrapperDivId="upload-image-modal-company"
        openAlert={isCompanyLogoModalOpen}
        closeAlert={() => setISCompanyLogoModalOpen(false)}
        imgInputId="company-logo"
        title={t("widget-content.company-logo-label")}
        description={t("widget-content.company-logo-description")}
        src={companyLogo}
        isImage={companyLogo}
        handleImageChange={updateCompanyLogo}
        addImageLabel={t("common.add-logo")}
      />
    </div>
  );
}
