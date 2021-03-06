// Enable chromereload by uncommenting this line:
import 'chromereload/devonly';

chrome.runtime.onMessage.addListener((request, sender) => {
  const analysis = request.analysis;
  const tab = sender.tab.id;

  const count = Object.values(analysis).filter(e => e).length;

  const icons = [16, 19, 38, 128].map(e => drawIcon(count, e));

  Promise.all(icons).then((values) => {
    chrome.pageAction.setIcon({
      imageData: {
        16: values[0],
        19: values[1],
        38: values[2],
        128: values[3],
      },
      tabId: tab,
    });
    chrome.pageAction.show(tab);
  });
});

function drawIcon(badgeNumber, size) {
  const canvas = document.createElement('canvas');
  const img = document.createElement('img');
  const imgScale = 1;
  const badgeRatio = 0.7;

  const badgeX = size * (1 - badgeRatio);
  const badgeY = badgeX;
  const badgeSize = size * badgeRatio;

  return new Promise((resolve) => {
    img.onload = () => {
      const context = canvas.getContext('2d');

      const imgSize = size * imgScale;
      const imgOffset = (size - imgSize) / 2;
      context.drawImage(img, imgOffset, imgOffset, imgSize, imgSize);

      const clear = (badgeNumber === 0);

      context.fillStyle = clear ? 'rgba(0,255,0,1)' : 'rgba(255,0,0,1)';
      const radius = badgeSize / 2;
      context.arc(badgeX + radius, badgeY + radius, radius, 0, 2 * Math.PI, false);
      context.fill();

      context.fillStyle = 'white';
      context.font = `${badgeSize}px Arial`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText((clear ? '\u2713' : badgeNumber), badgeX + radius, badgeY + radius);

      resolve(context.getImageData(0, 0, size, size));
    };
    img.src = `../images/icon-${size}.png`;
  });
}
