'use strict';

var img$1 =
  'data:image/png;base64,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';
var Bot = img$1;

var img =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIsSURBVHgBjVPPT9NwFH9raze1A5Jp3CAKxESHiNQE4xU86sH+ASZLVA5eNfGiJh7Vf4AEZ8bRoAfx4klW5eAPOIxIlhlICgvpBmwUymAdbJTv+5IuZfuW8Ena74/33qev772PDxh4f10bPN8biF2Q/YP+Vq4L77bztVTxfzVVSO9MPP7X/QWOQyKqdU0+W0vqf8u2F9A2flfXRogvk2T0mibPftg07BMiRXwxpikTL5JiZpc+XmROZgK+gpf9yRsPW9rc5CW9BlOvikBI6FkM8qB8CpPVV/fpJzHr6b0EZGAI4n2aok9bTV/7+bJo/3hRqJ9/vVm3f781mDXD5nChnoASGfA31Sw3XYHeB8H6+YoiwdJkuckvcisA2GHuXFTsBwakdh6ySctFbIHUwbNcAcdEOBvmZZbx9vM2+PZoldSqSurCwfxECe6Ph5lEOGsceCAUFWkgZoYP7oMdgpc7CNbG/hJZO92X+ZkKzQA75yCbLFPCS0NnoPPO6SMkOPXCSqqikn3MucSCYttvPmmF8MDRhHe39uHPOwPEFg7cDULpCIW0NZabqcQcw8LXbUri7lgjFki2jn+eNAH1xw3PdauZjyXV7Si1e9cCC7/l+uWp18ZiXcQJGSVi0mkzl/dsy6zZx8Gxz8ZNY0RuEO+haM0TixZJRmWNOTo0s8/3dC3HkIwDtH1/uqY2ZuJjEcb7skqo55QSuirKUoSnk49jgh0upKtjw3MX1caYA+0L+gZn0nC0AAAAAElFTkSuQmCC';
var User = img;

function generateUUID() {
  const timestamp = /* @__PURE__ */ new Date().getTime();
  const randomPart = Math.floor(Math.random() * 1e6);
  return `${timestamp}-${randomPart}`;
}

function scrollToBottom(element) {
  if (!element) {
    return;
  }
  element.scrollTo({
    behavior: 'smooth',
    top: element.scrollHeight,
  });
}

function generateSessionId() {
  const randomNum = Math.random();
  const base36String = randomNum.toFixed(18).substring(2);
  return base36String;
}

const generateSession = () => {
  const newSessionId = generateSessionId();
  const timestamp = Date.now();
  localStorage.setItem('AI_ASSISTENCE_SESSION_ID', newSessionId);
  localStorage.setItem('AI_ASSISTENCE_TIMESTAMP', timestamp.toString());
  return newSessionId;
};

function getSessionId() {
  const sessionId = localStorage.getItem('AI_ASSISTENCE_SESSION_ID');
  const timestamp = localStorage.getItem('AI_ASSISTENCE_TIMESTAMP');
  if (timestamp) {
    const currentTime = Date.now();
    const oneHourInMilliseconds = 36e5;
    if (currentTime - Number(timestamp) > oneHourInMilliseconds) {
      return generateSession();
    }
  }
  if (!sessionId) {
    return generateSession();
  }
  return sessionId;
}

var botHtml =
  '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width,initial-scale=1">\n    <title>Document</title>\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.scripts"></script>\n    <script src="https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.scripts"></script>\n  </head>\n  <style>\n    * {\n      box-sizing: border-box;\n      padding: 0px;\n      margin: 0px;\n      font-family: inherit;\n    }\n\n    .root_div {\n      --bg-color: #1c1c1c;\n      --primary-color: #ffffff;\n      --secondary-color: #777777;\n      font-size: 15px;\n      line-height: 23px;\n      color: black;\n    }\n\n    .chat_bot_wrapper.default-layout {\n      position: fixed;\n      display: none;\n      bottom: 10rem;\n      right: 3rem;\n      z-index: 9999;\n      border-radius: 12px;\n      border: 1px solid rgba(0, 0, 0, 0.08);\n      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);\n    }\n\n    .chat_bot_container {\n      width: 100%;\n      position: relative;\n      display: flex;\n      flex: 1;\n      flex-direction: column;\n    }\n\n    .chat_bot_fab_icon {\n      position: fixed;\n      right: 2rem;\n      bottom: 2rem;\n      border: none;\n      cursor: pointer;\n      padding: 10px;\n      border-radius: 50%;\n      transition: 0.1s all linear;\n      height: 90px;\n      width: 90px;\n      display: none;\n      justify-content: center;\n      align-items: center;\n      z-index: 9999;\n    }\n\n    .chat_bot_fab_icon img {\n      height: 75px;\n      width: 75px;\n      object-fit: contain;\n      border-radius: 100%;\n    }\n\n    .chat_bot_fab_icon:hover {\n      transform: scale(1.1);\n    }\n\n    .chat_bot_header.default {\n      height: 80px;\n      display: flex;\n      flex-direction: row;\n      justify-content: space-between;\n      align-items: center;\n      padding: 10px 10px;\n      gap: 10px;\n      border-bottom: 1px solid #ebebeb;\n    }\n    .chat_bot_header.screen {\n      padding: 10px 10px;\n      border-bottom: 1px solid #ebebeb;\n    }\n\n    .chat_bot_company_info {\n      display: flex;\n      flex-direction: row;\n      gap: 10px;\n      align-items: center;\n    }\n    .chat_bot_company_logo {\n      height: 24px;\n      width: 24px;\n      border-radius: status;\n    }\n\n    .chat_bot_company_name {\n      font-size: 14px;\n      font-weight: 600;\n      line-height: 16.9px;\n    }\n\n    .chat_bot_close_icon {\n      cursor: pointer;\n      border-radius: 50%;\n      width: 24px;\n      height: 24px;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      transition: 0.1s all linear;\n    }\n\n    .chat_bot_close_icon:hover {\n      background-color: rgb(170, 168, 168);\n      transform: scale(1.1);\n    }\n\n    .chat_bot_close_icon:hover > svg {\n      stroke: white;\n    }\n\n    .chat_area {\n      display: flex;\n      overflow-y: auto;\n      padding: 10px;\n      width: 100%;\n\n      height: 100%;\n    }\n\n    .chat_bot_bottom.default {\n      position: sticky;\n      bottom: 0px;\n      left: 0px;\n      border-radius: 4px;\n      padding: 10px;\n    }\n\n    .chat_bot_bottom.screen {\n      padding: 10px 10px;\n    }\n\n    .input_section {\n      position: relative;\n    }\n\n    .input_section input {\n      width: 100%;\n      height: 32px;\n      text-indent: 10px;\n      background: rgba(255, 255, 255, 0.04);\n      border: none;\n      outline: none;\n      font-size: 12px;\n      border-radius: 8px;\n      border: 1px solid rgba(176, 176, 176, 1);\n    }\n\n    .input_section_send_icon {\n      position: absolute;\n      right: 10px;\n      top: 0px;\n      cursor: pointer;\n      height: 100%;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      display: none;\n      transition: 0.1s all linear;\n      color: rgba(157, 45, 226, 1);\n    }\n    .input_section_send_icon:hover > svg {\n      transform: scale(1.1);\n    }\n\n    .question_answer_section {\n      width: 100%;\n      display: flex;\n      flex-direction: column;\n      gap: 20px;\n      padding-bottom: 10px;\n      flex: 1;\n    }\n\n    .bot_message_wrapper {\n      display: flex;\n      flex-direction: column;\n      width: 95%;\n      justify-content: flex-start;\n      gap: 5px;\n    }\n\n    .user_message_wrapper {\n      align-self: flex-end;\n      display: flex;\n      flex-direction: column;\n      max-width: 95%;\n      width: fit-content;\n      justify-content: flex-end;\n      gap: 5px;\n    }\n\n    .bot_message_header {\n      display: flex;\n      flex-direction: row;\n      justify-content: flex-start;\n      align-items: center;\n      gap: 10px;\n    }\n\n    .user_message_header {\n      display: flex;\n      flex-direction: row-reverse;\n      justify-content: flex-start;\n      align-items: center;\n      flex: 1;\n      gap: 10px;\n    }\n\n    .bot_message_header > img,\n    .user_message_header > img {\n      height: 18px;\n      width: 18px;\n      object-fit: contain;\n    }\n\n    .bot_message_header > h2,\n    .user_message_header > h2 {\n      font-size: 12px;\n      font-weight: 500;\n      line-height: 14.52px;\n      letter-spacing: 0em;\n      text-align: left;\n    }\n\n    .bot_message {\n      background: rgba(234, 237, 242, 1);\n      padding: 8px;\n      border-radius: 8px;\n      border-bottom-left-radius: 0px;\n      gap: 5px;\n      width: 100%;\n      text-align: left;\n      font-size: 12px;\n      line-height: 16px;\n      color: rgba(58, 58, 58, 1);\n    }\n\n    .dark_bot_message {\n      background: rgba(247, 247, 247, 0.2);\n      color: white;\n    }\n\n    .user_message {\n      background: rgba(157, 45, 226, 1);\n      padding: 8px;\n      border-radius: 8px;\n      border-bottom-right-radius: 0px;\n      gap: 5px;\n      width: 100%;\n      text-align: left;\n      color: white;\n      font-size: 12px;\n      line-height: 16px;\n    }\n\n    .assistance-error > p {\n      color: red;\n    }\n\n    .thinking-effect span {\n      font-size: 30px;\n      animation: dot 1s infinite;\n    }\n\n    .thinking-effect span:nth-child(2) {\n      animation-delay: 0.2s;\n    }\n\n    .thinking-effect span:nth-child(3) {\n      animation-delay: 0.4s;\n    }\n\n    @keyframes dot {\n      0%,\n      80%,\n      100% {\n        opacity: 0;\n      }\n      40% {\n        opacity: 1;\n      }\n    }\n    .chat_bot_container {\n      height: 100%;\n    }\n    .chat_area.screen {\n      min-height: 450px;\n      height: 100%;\n    }\n\n    .action_button_list {\n      display: flex;\n      flex-direction: row;\n      gap: 10px;\n      padding-top: 5px;\n      padding-bottom: 5px;\n      flex-wrap: wrap;\n      align-items: center;\n      justify-content: flex-start;\n    }\n    .action_button {\n      max-width: 70%;\n      width: fit-content;\n      height: 23px;\n      padding: 4px 8px 4px 8px;\n      border-radius: 100px;\n      border: 1px;\n      gap: 10px;\n      font-size: 12px;\n      font-weight: 500;\n      line-height: 14.52px;\n      letter-spacing: 0em;\n      text-align: left;\n      display: flex;\n      flex-direction: row;\n      align-items: center;\n      justify-content: center;\n      cursor: pointer;\n    }\n    .action_button.light_theme {\n      border: 2px solid transparent;\n      background: linear-gradient(white, white) padding-box,\n        linear-gradient(93.57deg, #ff6c00 0%, #8a00e1 99.68%) border-box;\n      color: #8a00e1;\n    }\n    .action_button.dark_theme {\n      background: linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.95))\n          padding-box,\n        linear-gradient(93.57deg, #ff6c00 0%, #8a00e1 99.68%) border-box !important;\n      color: white !important;\n      border: 2px solid transparent;\n    }\n\n    .action_button:hover {\n      opacity: 0.8;\n    }\n\n    .action_link {\n      color: rgba(157, 45, 226, 1);\n      cursor: pointer;\n      font-weight: 500;\n    }\n    .action_link:hover {\n      opacity: 0.8;\n    }\n\n    ul,\n    ol {\n      margin-left: 25px;\n    }\n    .chat_bot_company_info_section {\n      display: flex;\n      flex-direction: column;\n      align-items: flex-start;\n      justify-content: center;\n    }\n\n    .powered_by {\n      display: flex;\n      flex-direction: row;\n      justify-content: center;\n      align-items: center;\n      margin-top: 10px;\n      font-size: 12px;\n    }\n    .powered_by.dark_theme {\n      color: white;\n    }\n    .chat_status {\n      color: rgba(77, 77, 77, 1);\n      font-size: 12px;\n      line-height: 14.52px;\n    }\n    .chat_bot_company_logo_wrapper {\n      position: relative;\n    }\n    .chat_bot_status_avatar {\n      height: 8px;\n      width: 8px;\n      border-radius: 50%;\n      z-index: 10;\n      background-color: #4caf50;\n    }\n    .powered_by_link {\n      padding-left: 5px;\n    }\n    .chat_bot_status_wrapper {\n      display: flex;\n      flex-direction: row;\n      align-items: center;\n      gap: 4px;\n    }\n    .chat_bot_status_wrapper.dark_theme .chat_status {\n      color: white;\n    }\n\n    /* MOBILE STYLING */\n    @media (max-width: 768px) {\n      .chat_bot_wrapper.default-layout {\n        height: 100%;\n        width: 100%;\n        right: 0px;\n        bottom: 0rem;\n        z-index: 999999;\n        border-radius: 0px;\n        border: none;\n        box-shadow: none;\n      }\n\n      .chat_bot_bottom.default-layout {\n        width: 98%;\n        max-width: 400px;\n      }\n\n      .chat_bot_fab_icon {\n        height: 70px;\n        width: 70px;\n        bottom: 2rem;\n        right: 2rem;\n      }\n      .chat_bot_fab_icon img {\n        height: 40px;\n        width: 40px;\n      }\n      .input_section_send_icon {\n        display: flex;\n        color: rgba(157, 45, 226, 1);\n      }\n      .user_message,\n      .bot_message {\n        font-size: 14px;\n        line-height: 18px;\n      }\n      .action_button {\n        font-size: 14px;\n        height: 32px;\n        padding: 4px 8px 4px 8px;\n      }\n      .action_button > svg,\n      .input_section_send_icon > svg {\n        height: 18px;\n        width: 18px;\n      }\n      .input_section input {\n        height: 40px;\n        font-size: 14px;\n      }\n      .chat-bot-wrapper {\n        min-height: calc(100vh - 150px) !important;\n        max-height: calc(100vh - 150px) !important;\n        display: flex;\n        overflow-y: auto;\n      }\n    }\n\n    @media (min-width: 768px) {\n      .chat_bot_wrapper.default-layout {\n        height: 60vh;\n        width: 100%;\n        max-width: 414px;\n        right: 2rem;\n        bottom: 2rem;\n        z-index: 999999;\n      }\n      .chat_bot_bottom.default-layout {\n        width: 100%;\n        max-width: 648px;\n      }\n      .chat-bot-wrapper {\n        min-height: calc(100vh - 150px) !important;\n        max-height: calc(100vh - 150px) !important;\n        display: flex;\n        overflow-y: auto;\n      }\n     \n    }\n    .chat-bot-wrapper-preview {\n        min-height: calc(60vh - 150px) !important;\n        max-height: calc(60vh - 150px) !important;\n        display: flex;\n       \n        overflow: scroll !important;\n      }\n  </style>\n\n  <body>\n    <div class="root_div">\n      <div class="overlay"></div>\n\n      <div class="chat_bot_wrapper">\n        <div class="chat_bot_container">\n          <div class="chat_bot_header">\n            <div class="chat_bot_company_info"></div>\n            <div class="chat_bot_close_icon">\n              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">\n                <path d="M18 6 6 18"/>\n                <path d="m6 6 12 12"/>\n              </svg>\n            </div>\n          </div>\n          <div class="chat_area">\n            <div class="question_answer_section"></div>\n          </div>\n          <div class="chat_bot_bottom">\n            <div class="input_section">\n              <input class="input_field" type="text" placeholder="Hey, How can we help you?">\n              <div class="input_section_send_icon">\n                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal">\n                  <path d="m3 3 3 9-3 9 19-9Z"/>\n                  <path d="M6 12h16"/>\n                </svg>\n              </div>\n            </div>\n            <div class="powered_by">\n              Powered by\n              <a href="https://seethos.com" target="_blank" class="action_link powered_by_link">Seethos</a>\n            </div>\n          </div>\n        </div>\n      </div>\n      <button class="chat_bot_fab_icon"></button>\n    </div>\n  </body>\n</html>\n';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value);
  return value;
};
const template = document.createElement('template');
template.innerHTML = botHtml;

class ChatBot extends HTMLElement {
  constructor() {
    super();
    __publicField(this, 'apiUrl');
    __publicField(this, 'loading');
    __publicField(this, 'userImageSrc');
    __publicField(this, 'assistanceImageSrc');
    __publicField(this, 'chatBotWrapper');
    __publicField(this, 'aiTriggerButton');
    __publicField(this, 'inputField');
    __publicField(this, 'chatbotId');
    __publicField(this, 'theme');
    __publicField(this, 'chatBotHeader');
    __publicField(this, 'chatBotCloseIcon');
    __publicField(this, 'rootContainer');
    __publicField(this, 'sendIconElement');
    __publicField(this, 'questionAnswerSection');
    __publicField(this, 'chatBotMessageArea');
    __publicField(this, 'chatBotName');
    __publicField(this, 'webSocket');
    __publicField(this, 'websocketUrl');
    __publicField(this, 'layoutType');
    __publicField(this, 'chatBotFooter');
    __publicField(this, 'chatBotInformation');
    __publicField(this, 'wrapperClassName');
    __publicField(
      this,
      'createLink',
      (url, linkText) =>
        `<a class="action_link" href="${url}" target="_blank" rel="noopener">${linkText}</a>`,
    );
    __publicField(this, 'isMarkdown', (content) => {
      const markdownPatterns = [
        /^#\s/,
        // Header
        /^-\s|\*\s|1\.\s/,
        // List item
        /\*\*.*\*\*|__.*__|[*_].*[*_]/,
        // Bold or italic
        /(```|`)[^`]*\1/,
        // Code block or inline code
      ];
      return markdownPatterns.some((pattern) => pattern.test(content));
    });
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.3/purify.min.js';
    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.head.appendChild(markedScript);
    document.head.appendChild(script);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.append(template.content.cloneNode(true));
    this.apiUrl = 'http://localhost:8008/conversation';
    this.loading = false;
    this.userImageSrc = User;
    this.assistanceImageSrc = Bot;
    this.chatbotId = '';
    this.theme = 'light';
    this.chatBotName = 'Duality';
    this.handleInputEvent = this.handleInputEvent.bind(this);
    this.rootContainer = shadowRoot.querySelector('.root_div');
    this.chatBotWrapper = shadowRoot.querySelector('.chat_bot_wrapper');
    this.aiTriggerButton = shadowRoot.querySelector('.chat_bot_fab_icon');
    this.chatBotHeader = shadowRoot.querySelector('.chat_bot_company_info');
    this.chatBotCloseIcon = shadowRoot.querySelector('.chat_bot_close_icon');
    this.inputField = shadowRoot.querySelector('.input_field');
    this.sendIconElement = shadowRoot.querySelector('.input_section_send_icon');
    this.questionAnswerSection = shadowRoot.querySelector('.question_answer_section');
    this.chatBotMessageArea = shadowRoot.querySelector('.chat_area');
    this.chatBotFooter = shadowRoot.querySelector('.chat_bot_bottom');
  }

  async connectedCallback() {
    if (this.userImageSourceAttribute) this.userImageSrc = this.userImageSourceAttribute;
    if (this.botImageSourceAttribute) this.assistanceImageSrc = this.botImageSourceAttribute;
    if (this.apiUrlAttribute) this.apiUrl = this.apiUrlAttribute;
    this.chatbotId = this.chatbotIdAttribute;
    this.layoutType = this.layoutTypeAttribute;
    this.theme = this.themeTypeAttribute;
    this.wrapperClassName = this.wrapperClassnameAttribute;
    this.inputField?.addEventListener('keypress', this.handleInputEvent);
    const overLay = this.shadowRoot?.querySelector('.overlay');
    this.chatBotWrapper?.scrollTo({
      behavior: 'smooth',
      top: this.chatBotWrapper.scrollHeight,
    });
    const handleDisplayProprty = () => {
      if (this.chatBotWrapper) {
        const chatBotWrapperDisplayProperty = this.chatBotWrapper.style.display;
        overLay.style.display =
          !overLay?.style.display || overLay?.style.display === 'none' ? 'block' : 'none';
        this.chatBotWrapper.style.display =
          !chatBotWrapperDisplayProperty || chatBotWrapperDisplayProperty === 'none'
            ? 'block'
            : 'none';
      }
    };
    this.aiTriggerButton?.addEventListener('click', (e) => {
      handleDisplayProprty();
    });
    overLay?.addEventListener('click', () => {
      handleDisplayProprty();
    });
    this.chatBotCloseIcon?.addEventListener('click', () => {
      handleDisplayProprty();
    });
    this.sendIconElement?.addEventListener('click', (event) => {
      const inputValue = this.inputField?.value;
      this.handleEnterClickOnInput(inputValue);
    });
    this.renderScreenLayout();
    const webSocketUrl = await this.connection();
    if (webSocketUrl) {
      await this.initiateWebSoecketConnection(webSocketUrl);
    }
  }

  // Getter and setter for the "userImageSource" property
  get userImageSourceAttribute() {
    return this.getAttribute('userImageSource');
  }

  set userImageSourceAttribute(value) {
    this.setAttribute('userImageSource', value);
  }

  // Getter and setter for the "botImageSource" property
  get botImageSourceAttribute() {
    return this.getAttribute('assistanceImageSrc');
  }

  set botImageSourceAttribute(value) {
    this.setAttribute('assistanceImageSrc', value);
  }

  // Getter and setter for the "apiUrl" property
  get apiUrlAttribute() {
    return this.getAttribute('userImageSource');
  }

  set apiUrlAttribute(value) {
    this.setAttribute('userImageSource', value);
  }

  // CHATBOT ID GETTER AND SETTER
  get chatbotIdAttribute() {
    return this.getAttribute('chatBotId');
  }

  set chatbotIdAttribute(value) {
    this.setAttribute('chatBotId', value);
  }

  get layoutTypeAttribute() {
    return this.getAttribute('layout') ?? 'default';
  }

  set layoutTypeAttribute(value) {
    this.setAttribute('layout', value ?? 'default');
  }

  get wrapperClassnameAttribute() {
    return this.getAttribute('wrapperClassName');
  }

  set wrapperClassnameAttribute(value) {
    this.setAttribute('wrapperClassName', value);
  }

  get themeTypeAttribute() {
    return this.getAttribute('theme');
  }

  set themeTypeAttribute(value) {
    this.setAttribute('theme', value);
  }

  async connection() {
    const response = await fetch(
      `http://localhost:8008/api/v1/bot_info/get_chatbot_info/?bot_id=${this.chatbotId}`,
    );
    if (response.ok) {
      const data = await response.json();
      this.chatBotInformation = data;
      const userTheme = this.themeTypeAttribute;
      if (userTheme) {
        this.theme = userTheme;
      } else {
        this.theme = data.theme;
      }
      console.log('this.the,m', this.theme);
      this.renderRootStyling();
      if (this.layoutType === 'default') this.renderChatBotAvatar(data.avatar);
      this.renderChatBotWrapperStyling();
      this.renderChatBotHeader(data.avatar, data.name, data.status);
      this.renderChatBotInputStyling();
      return data.socket_url;
    } else {
      const defaultAvatar = this.botImageSourceAttribute ?? Bot;
      this.renderRootStyling();
      if (this.layoutType === 'default') this.renderChatBotAvatar(defaultAvatar);
      this.renderChatBotWrapperStyling();
      this.renderChatBotHeader(defaultAvatar, '');
      this.renderChatBotInputStyling();
      this.handleInputFieldDisable();
      this.renderMessasgeContent({
        type: 'bot',
        content: 'Failed to connect with server. Please try again later',
        className: 'assistance-error',
      });
      return '';
    }
  }

  initiateWebSoecketConnection(socketUrl) {
    this.handleInputFieldDisable();
    this.renderMessasgeContent({
      type: 'bot',
      content: 'Connecting..',
      isLoading: true,
    });
    const sessionId = getSessionId();
    const socketUrlLink = socketUrl;
    const socket = new WebSocket(socketUrlLink + `/?session_id=${sessionId}`);
    this.webSocket = socket;
    let responseId = generateUUID();
    let isGreetingMessage = true;
    socket.addEventListener('open', (event) => {
    });
    socket.addEventListener('message', (event) => {
      const response = event.data;
      if (response === 'end of the chain' || response === 'end of the greeting message') {
        if (response === 'end of the greeting message') isGreetingMessage = false;
        responseId = generateUUID();
      } else {
        this.handleInputFieldEnable();
        const loadingDiv = this.shadowRoot?.querySelector('.ai_isLoading');
        if (loadingDiv?.parentElement) {
          loadingDiv.parentElement.removeChild(loadingDiv);
        }
        this.renderMessasgeContent({
          type: 'bot',
          content: response,
          uuid: responseId,
          isActionButton: isGreetingMessage,
        });
      }
      scrollToBottom(this.chatBotMessageArea);
    });
    socket.addEventListener('error', (event) => {
      this.handleInputFieldDisable();
      this.renderMessasgeContent({
        type: 'bot',
        content: 'Failed to connect with server',
        className: 'assistance-error',
      });
    });
  }

  isLightTheme() {
    return this.theme === 'light';
  }

  // RENDER THE ROOT STYLING
  renderRootStyling() {
    const isLightTheme = this.isLightTheme();
    if (this.rootContainer) {
      if (!isLightTheme) {
        this.rootContainer.style.background = '#19192E';
        this.rootContainer.style.color = 'white';
      }
    }
  }

  // RENDER THE CHATBOT AVATAR
  renderChatBotAvatar(avatar) {
    const chatBotAvatar = document.createElement('img');
    chatBotAvatar.src = avatar;
    this.aiTriggerButton?.appendChild(chatBotAvatar);
    this.renderChatBotAvatarStyling();
  }

  // MODIFY THE CHATBOT STYLING DYNAMICALLY
  renderChatBotAvatarStyling() {
    if (this.aiTriggerButton) {
      this.aiTriggerButton.style.display = 'flex';
      const isLightTheme = this.isLightTheme();
      if (!isLightTheme) {
        this.aiTriggerButton.style.backgroundColor = 'rgba(0,0,0,0.9)';
        return;
      }
      this.aiTriggerButton.style.backgroundColor = 'white';
    }
  }

  // MODIFY CHATBOT WRAPPER STYLING DYNAMICALLY
  renderChatBotWrapperStyling() {
    const powered_by = this.shadowRoot?.querySelector('.powered_by');
    const isLightTheme = this.isLightTheme();
    if (!isLightTheme) {
      powered_by?.classList.add('dark_theme');
    }
    if (this.chatBotInformation?.color && this.sendIconElement) {
      this.sendIconElement.style.color = this.chatBotInformation?.color;
    }
    if (this.chatBotWrapper) {
      const isLightTheme2 = this.isLightTheme();
      if (!isLightTheme2) {
        this.chatBotWrapper.style.background = 'rgba(0,0,0,0.95)';
        return;
      }
      this.chatBotWrapper.style.background = 'white';
    }
  }

  // RENDER CHATBOT HEADER DYNAMICALLY
  renderChatBotHeader(companyLogo, companyName, status) {
    const companyLogoElement = document.createElement('img');
    companyLogoElement.src = companyLogo;
    companyLogoElement.className = 'chat_bot_company_logo';
    const companyTitleElement = document.createElement('h1');
    companyTitleElement.className = 'chat_bot_company_name';
    companyTitleElement.innerText = companyName;
    const isLightTheme = this.isLightTheme();
    const content = `
    <img src="${companyLogo}" class="chat_bot_company_logo"/>
    <div class="chat_bot_company_info_section">
    <h1 class="chat_bot_company_name">${companyName}</h1>
    <div class="chat_bot_status_wrapper ${!isLightTheme && 'dark_theme'}">
    <div class="chat_bot_status_avatar"></div>
    <p class="chat_status">${status ? 'Online' : 'Offline'}</p>
    </div>
    </div>
    `;
    if (this.chatBotHeader) this.chatBotHeader.innerHTML = content;
  }

  renderChatBotInputStyling() {
    if (this.inputField && this.sendIconElement) {
      const isLightTheme = this.isLightTheme();
      if (!isLightTheme) {
        this.inputField.style.background = 'rgba(255,255,255,0.1)';
        this.inputField.style.color = 'white';
        return;
      }
    }
  }

  renderScreenLayout() {
    const headerSection = this.shadowRoot?.querySelector('.chat_bot_header');
    this.shadowRoot?.querySelector('.chat_area');
    const chatBotBottom = this.shadowRoot?.querySelector('.chat_bot_bottom');
    if (this.chatBotWrapper && this.layoutType === 'default') {
      this.chatBotWrapper.classList.add('default-layout');
      this.chatBotFooter?.classList.add('default-layout');
      const chatBotContainer = this.shadowRoot?.querySelector('.chat_bot_container');
      chatBotContainer?.classList.add('default-layout');
      if (headerSection) headerSection.classList.add('default');
      if (chatBotBottom) chatBotBottom.classList.add('default');
    }
    if (this.chatBotCloseIcon && this.layoutType === 'screen') {
      this.chatBotCloseIcon.style.display = 'none';
      if (headerSection) headerSection.classList.add('screen');
      if (this.chatBotMessageArea) this.chatBotMessageArea.style.height = '100%';
      if (chatBotBottom) chatBotBottom.classList.add('screen');
      if (this.chatBotMessageArea) this.chatBotMessageArea.classList.add('screen');
      if (this.wrapperClassName) this.chatBotMessageArea?.classList.add(this.wrapperClassName);
    }
  }

  handleInputFieldDisable() {
    if (this.inputField) {
      this.inputField.disabled = true;
      this.inputField.style.cursor = 'not-allowed';
    }
  }

  handleInputFieldEnable() {
    if (this.inputField) {
      this.inputField.disabled = false;
      this.inputField.style.cursor = 'auto';
    }
  }

  disconnectedCallback() {
    this.inputField?.removeEventListener('keypress', this.handleInputEvent);
  }

  handleInputEvent(event) {
    const prompt = (event?.target).value;
    if (prompt.length > 0 && this.inputField && this.sendIconElement) {
      this.inputField.style.paddingRight = '40px';
      this.sendIconElement.style.display = 'flex';
    }
    if (event.key === 'Enter') {
      const value = (event?.target).value;
      this.handleEnterClickOnInput(value);
    }
  }

  renderMessasgeContent({
                          type,
                          content,
                          isLoading,
                          className = '',
                          uuid,
                          isActionButton = false,
                        }) {
    if (!this.questionAnswerSection) {
      return;
    }
    type === 'bot'
      ? this.chatBotInformation?.avatar
      : this.assistanceImageSrc
        ? this.userImageSrc
        : this.assistanceImageSrc;
    const isLightTheme = this.isLightTheme();
    if (type === 'bot') {
      const getUniqueKey = uuid ?? generateUUID();
      const assistanceClassName = `assistance-${getUniqueKey}`;
      const messageClassName = !isLightTheme
        ? `bot_message dark_bot_message ${assistanceClassName}`
        : `bot_message ${assistanceClassName}`;
      if (isLoading) {
        this.questionAnswerSection.innerHTML += `
                <div class="bot_message_wrapper ai_isLoading ${className}">
                    ${content && `<div class="${messageClassName}"><p>${content}</p> </div`}
                  </div>
        `;
        return;
      }
      const messageElementClassName = `chat-bot-assistance-${getUniqueKey}`;
      const messageElement = this.shadowRoot?.querySelector(`.${messageElementClassName}`);
      if (!messageElement && content) {
        this.questionAnswerSection.innerHTML += `
                <div class="bot_message_wrapper ${messageElementClassName}">
                   
                    ${content && `<div class="${messageClassName} ${className}"> </div`}
                  </div>
                  ${
          isActionButton
            ? `<div class="action_button_list">
                  </div>`
            : ''
        }
        `;
      }
      this.renderAssistanceMesssage(assistanceClassName, content);
      if (isActionButton) {
        this.renderGreetingTags();
      }
      return;
    }
    this.questionAnswerSection.innerHTML += `
                  <div class="user_message_wrapper">
                      ${
      content &&
      `<div class="user_message" style="background: ${
        this.chatBotInformation?.color || 'rgba(157, 45, 226, 1)'
      } !important;"><p>${content}</p> </div`
    }
                  </div>
          `;
  }

  handleButtonClick(tag) {
    const loadingDiv = this.shadowRoot?.querySelector('.action_button_list');
    if (loadingDiv?.parentElement) {
      loadingDiv.parentElement.removeChild(loadingDiv);
    }
    this.handleEnterClickOnInput(tag);
  }

  renderGreetingTags() {
    if (this.chatBotInformation?.greeting_tags) {
      const isLightTheme = this.isLightTheme();
      const buttons =
        this.chatBotInformation?.greeting_tags &&
        this.chatBotInformation?.greeting_tags[0]
          .split(',')
          ?.filter((el) => el)
          .map((el) => {
            const button = document.createElement('button');
            button.className = `action_button `;
            if (this.chatBotInformation?.color) {
              button.style.backgroundColor = 'transparent';
              button.style.border = `1px solid ${this.chatBotInformation?.color}`;
              if (isLightTheme) {
                button.style.color = this.chatBotInformation?.color;
              } else {
                button.style.color = 'white';
              }
            } else {
              if (isLightTheme) {
                button.classList.add('light_theme');
              } else {
                button.classList.add('dark_theme');
              }
            }
            button.innerHTML = `${el} <svg
  xmlns="http://www.w3.org/2000/svg"
  width="12"
  height="12"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-send-horizontal"
>
  <path d="m3 3 3 9-3 9 19-9Z" />
  <path d="M6 12h16" />
</svg>`;
            button.addEventListener('click', (e) => {
              e.preventDefault();
              this.handleButtonClick(el);
            });
            return button;
          });
      const actionButtonList = this.shadowRoot?.querySelector('.action_button_list');
      if (actionButtonList) buttons.forEach((button) => actionButtonList.appendChild(button));
    }
  }

  renderAssistanceMesssage(className, message) {
    const messageElement = this.shadowRoot?.querySelector(`.${className}`);
    let p = messageElement?.querySelector('div');
    if (!p) {
      p = document.createElement('div');
      messageElement?.appendChild(p);
    }
    if (this.isMarkdown(message)) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(DOMPurify.sanitize(marked.parse(message)), 'text/html');
      const links = doc.querySelectorAll('a');
      links.forEach((link) => {
        link.setAttribute('target', '_blank');
        link.classList.add('action_link');
      });
      const purifiedMessage = doc.body.innerHTML;
      p.innerHTML += purifiedMessage;
      return;
    }
    p.innerHTML += message;
  }

  handleEnterClickOnInput(value) {
    const loadingDiv = this.shadowRoot?.querySelector('.action_button_list');
    if (loadingDiv?.parentElement) {
      loadingDiv.parentElement.removeChild(loadingDiv);
    }
    if (!this.inputField) return;
    this.loading = true;
    this.inputField.disabled = true;
    const question = value;
    this.inputField.value = '';
    if (this.sendIconElement) {
      this.sendIconElement.style.display = 'none';
    }
    this.renderMessasgeContent({
      type: 'user',
      content: question,
    });
    this.renderMessasgeContent({
      type: 'bot',
      content: '<p class="thinking-effect">Typing<span>.</span><span>.</span><span>.</span></p>',
      isLoading: true,
      className: '',
    });
    const payload = JSON.stringify({ type: 'text', content: question });
    this.webSocket?.send(payload);
    scrollToBottom(this.chatBotMessageArea);
    const interval = setInterval(() => scrollToBottom(this.chatBotMessageArea), 500);
    this.loading = false;
    this.inputField.disabled = false;
    return clearInterval(interval);
  }
}

customElements.define('duality-chat-bot', ChatBot);
//# sourceMappingURL=index.scripts.map
