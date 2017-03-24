export const uid = (() => { let i = 0; return () => i++ })();

export const randomColor = () => '#'+Math.floor(Math.random()*16777215).toString(16);

export const randomColorSlow = () => {
  var start = performance.now();
  while (performance.now() - start < 5) {}
  return randomColor();
};

const showNotification = (text, delay = 2200) => {
  let el = document.querySelector('#pr-notification');
  if (!el) {
    el = document.createElement('div');
    document.body.appendChild(el);
    el.id = 'pr-notification';
    el.style = 'position: fixed; top: 10px; right: 10px; background-color: blue; color: white; font-size: 30px; padding: 10px 15px; border-radius: 8px; transition: none 0.5s ease; font-weight: 600;';
  } else {
    el.style.transitionProperty = 'none';
    el.style.top = '10px';
    clearTimeout(el.timeout);
  }
  el.innerHTML = text;
  el.timeout = setTimeout(() => {
    el.style.transitionProperty = 'top';
    setTimeout(() => { el.style.top = '-100px'; }, 0)
  }, delay);
};

let perfResults = { colorsList: [], todos: [] };

export const perf = (nameSpace, groupKey, subgroupKey, fn) => {
  const start = performance.now();
  const r = fn();
  const syncEnd = performance.now();
  setTimeout(function() {
    const end = performance.now();
    console.log(`${subgroupKey}: ${(end - start).toFixed(1)}ms (sync: ${(syncEnd - start).toFixed(1)}ms)`);
    showNotification(`${(end - start).toFixed(1)}ms`);
    perfResults[nameSpace].push({ groupKey, subgroupKey, start, syncEnd, end });
  }, 0);
  return r;
};

export const getPerfResults = (nameSpace, groupKey) =>
  groupKey
    ? perfResults[nameSpace].filter(r => r.groupKey === groupKey)
    : perfResults[nameSpace];

export const resetPerfResults = (nameSpace, groupKey) => {
  if (groupKey) {
    perfResults[nameSpace] = perfResults[nameSpace].filter(r => r.groupKey !== groupKey);
  } else {
    perfResults[nameSpace] = [];
  }
};
