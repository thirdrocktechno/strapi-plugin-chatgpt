import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_CHAT_MODE, CHAT_OPTIONS, CHAT_LANGUAGE_OBJECT } from "../../../utils/constants";
import { Button } from '@strapi/design-system';

const Preview = ({
  executiveImage,
  companyLogo,
  supportMessageContent,
  headerContent,
  isOnline,
  colors,
  chatInitiation = false,
  widgetPosition,
  language,
}) => {
  const { t } = useTranslation();
  const [chatMode, setChatMode] = useState(DEFAULT_CHAT_MODE);
  const [isChatModeOpen, setIsChatModeOpen] = useState(false);
  const chatModeRef = useRef(null);

  const handleChatModeUpdate = (mode) => {
    setChatMode(mode);
    setIsChatModeOpen(false);
  };

  useEffect(() => {
    const currentChatMode = !isOnline ? CHAT_OPTIONS[1] : CHAT_OPTIONS[0];
    setChatMode(currentChatMode);
  }, [isOnline]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (chatModeRef.current && !chatModeRef.current.contains(event.target)) {
        setIsChatModeOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chatModeRef]);

  return (
    <div className="">
      <div>
        <div className="flex justify-between items-center -mt-[51px] pl-[34px] pr-[50px] border-b border-custom-LightGrey3 h-[51px]">
          <p className="text-sm font-medium text-custom-Dark8 leading-none">{t("common.widget-preview-label")}</p>
          <div className="relative" ref={chatModeRef}>
            <div className="absolute bg-white shadow-custom-shadow9 rounded-[10px] w-[108px] top-[-5px] left-[-27px]">
              {isChatModeOpen &&
                CHAT_OPTIONS.map((mode, index) => {
                  return (
                    <div
                      className="cursor-pointer flex items-center justify-between mb-2.5 text-custom-Dark10 text-sm px-2.5 mt-2.5"
                      key={index}
                      onClick={() => handleChatModeUpdate(mode)}
                    >
                      {mode.label}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="px-[34px] h-[calc(100vh_-_146px)] py-9">
          {chatMode.value === "online" ? (
            <div className="relative w-full h-full">
              <div className={`${widgetPosition.value} absolute`}>
                <div className="shadow-custom-shadow9 rounded-xl max-w-[362px] chat-box-position">
                  <div
                    className="flex items-center justify-start px-5 py-7 bg-custom-Dark9 rounded-tl-xl rounded-tr-xl"
                    style={{ backgroundColor: colors?.headerBackground }}
                  >
                    <div className="relative shrink-0">
                      <img className="w-[45px] h-[45px] rounded-full object-cover inline-block" src={executiveImage} alt="logo" />
                    </div>
                    <p
                      className="ml-[15px] font-inter font-medium text-[17px] leading-[1.5] text-white line-truncate-2"
                      style={{ color: colors?.headerText }}
                    >
                      {supportMessageContent}
                    </p>
                  </div>
                  <div className="pt-[18px] px-5 min-h-[200px] max-h-[350px] h-[calc(100vh_-_434px)] overflow-y-auto new-chat-box-body">
                    <div className="flex flex-col">
                      <div
                        className="msg-sender rounded-[5px] py-3 pl-3 pr-4 bg-custom-Blue3 text-white mb-[18px] max-w-3/4 self-end relative"
                        style={{ background: colors?.visitorMessageBackground }}
                      >
                        <p className="font-inter font-normal text-sm leading-[23px]" style={{ color: colors?.visitorText }}>
                          Hey There! Give me the list of articles by John Doe.
                          <span
                            className="inline-block font-inter text-[#AFD7FF] text-[10px] pl-2.5 float-right -mr-1 relative -bottom-0.5 opacity-80"
                            style={{ color: colors?.visitorText }}
                          >
                            2 min ago
                          </span>
                        </p>
                        <span
                          className="w-0 h-0 triangle-sender absolute -right-1 bottom-0"
                          style={{
                            borderBottomColor: colors?.visitorMessageBackground,
                          }}
                        ></span>
                      </div>

                      <div
                        style={{ background: colors?.agentMessageBackground }}
                        className="msg-receiver rounded-[5px] text-custom-Dark2 bg-custom-LightGrey13 py-3 pl-3 pr-4 mb-[18px] max-w-3/4 self-start relative"
                      >
                        <p className="font-inter font-normal text-sm leading-[23px]" style={{ color: colors?.agentText }}>
                          Sure Here it is...
                          <span
                            className="inline-block font-inter text-[#ABB0B5] text-[10px] pl-2.5 float-right -mr-1 relative -bottom-0.5 opacity-80"
                            style={{ color: colors?.agentText }}
                          >
                            2 min ago
                          </span>
                        </p>
                        <span
                          className="w-0 h-0 triangle-receiver absolute -left-1 bottom-0"
                          style={{
                            borderBottomColor: colors?.agentMessageBackground,
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div className="pb-5 px-5">
                    <div className="flex items-center px-3 py-3 rounded-[5px] shadow-custom-shadow10">
                      <input
                        className="w-full outline-none text-sm new-chat-box-placeholder pr-2"
                        placeholder="Ask me anything about this site..."
                        type="text"
                        name=""
                        id=""
                        disabled
                      />
                      <div className="cursor-pointer">
                        <Button size="S">Ask</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-fit shrink-0 chat-icon-position">
                  <div className="w-[50px] h-[50px] rounded-full object-cover shadow-custom-shadow9">
                    <img className="w-[50px] h-[50px] rounded-full object-cover" src={companyLogo} alt="" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <div className={`${widgetPosition.value} absolute`}>
                <div className="shadow-custom-shadow9 rounded-xl max-w-[362px] chat-box-position">
                  <div className="shadow-custom-shadow9 rounded-xl max-w-[362px] w-full mx-auto h-[515px] min-w-[362px]">
                    <div
                      className="flex items-center justify-center px-5 pt-9 pb-[37px] bg-custom-Dark9 rounded-tl-xl rounded-tr-xl"
                      style={{
                        backgroundColor: colors?.headerBackground,
                      }}
                    >
                      <p
                        className="font-inter font-medium text-[17px] text-white line-truncate-2 leading-[1.5]"
                        style={{
                          color: colors?.headerText,
                        }}
                      >
                        {headerContent}
                      </p>
                    </div>
                    <div className="pt-[30px] px-5 mb-7">
                      <div className="mb-6">
                        <p className="w-fit pb-1.5 text-custom-Dark4 text-sm">{CHAT_LANGUAGE_OBJECT[language.value].name}</p>
                        <input
                          className="custom-input2 !text-custom-Dark8 !text-base !font-normal border-custom-LightGrey4 border rounded px-4 max-w-lg w-full placeholder:text-[#CCCCDB] placeholder:text-sm"
                          type="text"
                          placeholder="Jason Smith"
                          disabled
                        />
                      </div>
                      <div>
                        <p className="w-fit pb-1.5 text-custom-Dark4 text-sm">{CHAT_LANGUAGE_OBJECT[language.value].email}</p>
                        <input
                          className="custom-input2 !text-custom-Dark8 !text-base !font-normal border-custom-LightGrey4 border rounded px-4 max-w-lg w-full placeholder:text-[#CCCCDB] placeholder:text-sm"
                          type="text"
                          placeholder="someone@example.com"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="px-5 text-center">
                      <button
                        className="font-medium text-sm w-full py-3.5 text-white bg-custom-Dark9 mb-2.5 rounded-[59px]"
                        style={{
                          backgroundColor: colors?.headerBackground,
                          color: colors?.headerText,
                        }}
                        disabled
                      >
                        {CHAT_LANGUAGE_OBJECT[language.value].chat}
                      </button>
                      {chatInitiation && (
                        <button className="text-sm text-custom-Dark9" style={{ color: colors?.headerBackground }} disabled>
                          {CHAT_LANGUAGE_OBJECT[language.value].skip}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-fit shrink-0 chat-icon-position">
                  <div className="shadow-custom-shadow9 rounded-full">
                    <img className="w-[50px] h-[50px] rounded-full object-cover" src={companyLogo} alt="" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
