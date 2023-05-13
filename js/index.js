/**
 * 将歌词字符串转换为数组对象
 * [{time:时间,word:歌词内容}]
 */
function parseLrc() {
  const lrcArr = lrc.split('\n');
  let lrcData = [];
  lrcArr.map(item => {
    const itemArr = item.split(']');
    let obj = {
      time: parseTime(itemArr[0].substring(1)),
      word: itemArr[1] == '' ? '\u00A0' : itemArr[1]
    };
    lrcData.push(obj);
  });
  return lrcData;
}

const lrcData = parseLrc();

/**
 * 将时间字符串转换为数字秒
 */
function parseTime(timeStr) {
  const timeArr = timeStr.split(':');
  return +timeArr[0] * 60 + +timeArr[1];
}

// 获取一些dom
const doms = {
  audio: document.querySelector('audio'),
  ul: document.querySelector('.lrc-list'),
  container: document.querySelector('.container')
};
/**
 * 创建歌词信息
 */
function createLrc() {
  // 创建虚拟节点
  let frag = document.createDocumentFragment();
  lrcData.map(item => {
    const li = document.createElement('li');
    li.textContent = item.word;
    frag.appendChild(li);
  });
  doms.ul.appendChild(frag);
}

createLrc();

/**
 * 获取当前是第几行歌词高亮显示
 */
function findIndex() {
  const curTime = doms.audio.currentTime;
  for (let i = 0; i < lrcData.length; i++) {
    if (curTime <= lrcData[i].time) {
      return i - 1;
    }
  }
  return lrcData.length - 1;
}

// 获取容器高度
const containerHeight = doms.container.clientHeight;
// 获取最大滚动值
const maxOffset = doms.ul.clientHeight - containerHeight;
// 获取第一行歌词的高度
const firstLrc = doms.ul.children[0].clientHeight;
/**
 * 设置歌词偏移距离
 */
function setOffset() {
  const curLi = doms.ul.children[findIndex()];
  let curLiTop = 0;
  if (curLi) {
    curLiTop = curLi.offsetTop;
  }
  // 计算应该偏移的值
  let setTop = curLiTop + firstLrc - containerHeight / 2;
  // 判断边界
  if (setTop < 0) {
    setTop = 0;
  }
  if (setTop > maxOffset) {
    setTop = maxOffset;
  }
  const activeLi = document.querySelector('.lrc-list .active');
  if (activeLi) {
    activeLi.classList.remove('active');
  }
  if (curLi) {
    curLi.classList.add('active');
  }
  doms.ul.style.transform = `translateY(-${setTop}px)`;
}

doms.audio.addEventListener('timeupdate', setOffset);
