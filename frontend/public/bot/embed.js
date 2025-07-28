import { CONFIG } from '@/global/config.js';

scriptSrc = document.querySelector('script[src*="/embed.scripts"]').src;

// Create a new div element
const newDiv = document.createElement('div');
const newImage = document.createElement('img');
const companyLogo = document.createElement('img');
const companyName = document.createElement('p');

const botType = document.currentScript.getAttribute('bot-type') ?? 'normal';

fetch(
  `${CONFIG.BASE_API_URL}/bot_info/get_chatbot_info/?bot_id=${document.currentScript.getAttribute(
    'data-BotId',
  )}`,
)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the response as JSON
  })
  .then((data) => {
    if (data?.theme === 'light') {
      iframeDiv.style.backgroundColor = 'white';
      iframeDiv.style.border = '1px solid rgba(0, 0, 0, 0.08)';
      iframeDiv.style.boxShadow = '0px 1.04516px 6.27096px 0px rgba(0, 0, 0, 0.03)';
      bottomDiv.style.backgroundColor = 'white';
      companyName.style.color = 'black';
      closeIcon.style.color = 'black';
      poweredByRightText.style.color = 'black';
      poweredByText.style.color = 'black';
    }
    // Work with the data
    if (data && data.avatar) {
      newImage.src = data.avatar;
      if (data.company_logo) {
        companyLogo.src = data.company_logo;
      }
      companyName.textContent = data.company_name;
    } else {
      newImage.src = 'http://localhost:3000/bot/bot-image.png';
    }
  })
  .catch((error) => {
    // Handle errors
    console.error('Fetch error:', error);
  });

// newImage.src =
//   'http://localhost:3000/bot/bot-image.png';
newImage.style.width = '100%';
newImage.style.height = '100%';
// newDiv.style.padding = '10px';
if (botType === 'normal') {
  newDiv.appendChild(newImage);
}
let displayIframe = true;

// newDiv.style.backgroundColor = 'red';
newDiv.style.borderRadius = '100%';
newDiv.style.borderRadius = '100%';

newDiv.style.fontWeight = 'bold';
newDiv.style.color = 'white';
newDiv.style.fontSize = '32px';
newDiv.style.zIndex = '999';
newDiv.style.userSelect = 'none';
newDiv.style.cursor = 'pointer';
if (botType === 'normal') {
  // Style the div
  newDiv.style.display = 'flex';
  newDiv.style.alignItems = 'center';
  newDiv.style.justifyContent = 'center';
  newDiv.style.position = 'fixed';
  newDiv.style.width = '80px';
  newDiv.style.height = '80px';
  newDiv.style.bottom = '20px';
  newDiv.style.right = '20px';
}

newDiv.addEventListener('click', function() {
  if (botType === 'normal') {
    displayIframe = !displayIframe;
    iframeDiv.style.display = displayIframe ? 'flex' : 'none';
  }
});

// Add a class name to the div
newDiv.classList.add('myDiv');

// Get a reference to the body element
const body = document.body;

iframe = document.createElement('iframe');
iframe.className = 'chat-responsive-iframe';

const iframeDiv = document.createElement('div');
const bottomDiv = document.createElement('div');
const headerLeft = document.createElement('div');
const poweredByText = document.createElement('p');

const closeContainer = document.createElement('div');
const closeIcon = document.createElement('p');
headerLeft.appendChild(companyLogo);
headerLeft.appendChild(companyName);
closeContainer.appendChild(headerLeft);
if (botType === 'normal') {
  closeContainer.appendChild(closeIcon);
}

headerLeft.style.display = 'flex';
headerLeft.style.alignItems = 'center';
headerLeft.style.gap = '8px';
companyName.style.color = '#ffffff';
companyName.style.fontSize = '16px';

closeContainer.style.display = 'none';
closeContainer.style.width = '100%';
closeContainer.style.alignItems = 'center';
closeContainer.style.marginBottom = '8px';
closeContainer.style.justifyContent = 'space-between';

companyLogo.style.width = '50px';
companyLogo.style.height = '50px';

closeIcon.innerHTML = '&#x2715;';
closeIcon.style.fontSize = '22px';
closeIcon.style.fontWeight = '400';
closeIcon.style.fontFamily = 'unset';
closeIcon.style.margin = '0px';

const logoDiv = document.createElement('img');
const poweredByRightText = document.createElement('a');
logoDiv.style.width = '20px';
logoDiv.style.height = '20px';
logoDiv.src = 'https://duality.junkirilabs.com/bot/scalebuild-logo.png';
// logoDiv.src = 'http://localhost:3000/bot/scalebuild-logo.png';

bottomDiv.style.position = 'absolute';
bottomDiv.style.bottom = '0';
bottomDiv.style.left = '0';
bottomDiv.style.right = '0';
bottomDiv.style.height = '40px';
bottomDiv.style.width = '100%';
bottomDiv.style.display = 'flex';
bottomDiv.style.alignItems = 'center';
bottomDiv.style.justifyContent = 'center';
bottomDiv.style.gap = '6px';
bottomDiv.style.borderRadius = '0 0 10px 10px';
//TODO CHANGE
bottomDiv.style.backgroundColor = '#1a1a2e';
poweredByText.textContent = 'Powered by ';
poweredByText.style.fontSize = '16px';
poweredByText.style.fontWeight = '400';
poweredByText.style.fontFamily = 'unset';

poweredByRightText.textContent = 'Scalebuild AI';
poweredByRightText.style.fontSize = '16px';
poweredByRightText.style.fontWeight = '400';
poweredByRightText.style.fontFamily = 'unset';
poweredByRightText.style.color = '#a385fa';
poweredByRightText.href = 'https://scalebuild.ai/';
poweredByRightText.target = '_blank';
bottomDiv.append(poweredByText);
bottomDiv.append(logoDiv);
bottomDiv.append(poweredByRightText);

iframeDiv.append(bottomDiv);
iframe.style.overflow = 'scroll';
iframe.style.display = 'none';

// Set other attributes using setAttribute
if (botType === 'normal') {
  iframeDiv.style.position = 'absolute';
  iframeDiv.style.bottom = '80px';
  iframeDiv.style.right = '80px';
} else {
  iframeDiv.style.position = 'relative';
  iframeDiv.style.bottom = '0px';
  iframeDiv.style.right = '0px';
  iframeDiv.style.maxWidth = '418px';
}

iframeDiv.style.height = '674px';
iframeDiv.style.maxHeight = '65vh';
iframeDiv.style.width = '100%';
iframeDiv.style.minWidth = '418px';
iframeDiv.style.zIndex = '999';
iframeDiv.style.borderRadius = '10px';
//TODO CHANGE
iframeDiv.style.backgroundColor = '#1a1a2e';
iframeDiv.style.padding = '10px';
iframeDiv.style.display = 'flex';
iframeDiv.style.alignItems = 'center';
iframeDiv.style.justifyContent = 'center';
iframeDiv.style.paddingBottom = '62px';
iframeDiv.style.flexDirection = 'column';

iframeDiv.appendChild(closeContainer);

// Create a loader element
const loader = document.createElement('div');
const loaderContainer = document.createElement('div');
const text = document.createElement('p');
loader.classList.add('loader');

loaderContainer.style.display = 'flex';
loaderContainer.style.flexDirection = 'column';
loaderContainer.style.gap = '12px';
loaderContainer.style.alignItems = 'center';
loaderContainer.style.justifyContent = 'center';
text.textContent = 'Loading...';
text.style.fontSize = '18px';
text.style.fontFamily = 'unset';

// Style the loader
loader.style.border = '4px solid #f3f3f3';
loader.style.borderTop = '4px solid #3498db';
loader.style.borderRadius = '50%';
loader.style.width = '50px';
loader.style.height = '50px';
loader.style.animation = 'spin 2s linear infinite';

// Create the spin animation
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Create a style element for the spin animation
const style = document.createElement('style');
style.appendChild(document.createTextNode(spinKeyframes));

// Append the style element to the document head
document.head.appendChild(style);

// iframeDiv.appendChild(iframe)

loaderContainer.appendChild(loader);
loaderContainer.appendChild(text);
iframeDiv.appendChild(loaderContainer);
iframeDiv.appendChild(iframe);

iframe.style.height = '100%';
iframe.style.width = '100%';
iframe.style.border = 'none';

iframe.setAttribute(
  'src',
  `https://${document.currentScript.getAttribute('data-BotId')}.mania.duality.junkirilabs.com`,
);
iframe.setAttribute('scrolling', 'no');

newDiv.appendChild(iframeDiv);

document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  body.appendChild(newDiv);
  iframe.addEventListener('load', () => {
    closeContainer.style.display = 'flex';
    iframe.style.display = 'block';
    loaderContainer.style.display = 'none';
  });
});
