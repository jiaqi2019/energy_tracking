const reg = /```+mermaid([\s\S]*?)```/g;
content = content.replace(reg, (match, formula) => {
  if (!match.startsWith('```mermaid')) {
    return match;
  }
  const key = `mermaid-${idGenerator()}`;
  finalSlots.push({ id: key, media_type: 'mermaid', data: { value: formula } } as Slot);
  return `![](blockview://${key})`;
});

// 处理 mermaid 代码块
let result = '';
let currentPos = 0;
let inMermaidBlock = false;
let mermaidStartPos = 0;
let mermaidContent = '';

while (currentPos < content.length) {
  // 查找下一个可能的代码块开始标记
  const nextMermaidStart = content.indexOf('```mermaid', currentPos);
  const nextCodeEnd = content.indexOf('```', currentPos);

  // 如果不在代码块内，且找到了新的 mermaid 开始标记
  if (!inMermaidBlock && nextMermaidStart !== -1) {
    // 如果找到了结束标记，且结束标记在开始标记之前，说明不是 mermaid 块
    if (nextCodeEnd !== -1 && nextCodeEnd < nextMermaidStart) {
      result += content.slice(currentPos, nextCodeEnd + 3);
      currentPos = nextCodeEnd + 3;
      continue;
    }

    // 找到了有效的 mermaid 开始标记
    result += content.slice(currentPos, nextMermaidStart);
    mermaidStartPos = nextMermaidStart;
    currentPos = nextMermaidStart + 9; // 跳过 ```mermaid
    inMermaidBlock = true;
    continue;
  }

  // 如果在代码块内，查找结束标记
  if (inMermaidBlock && nextCodeEnd !== -1) {
    mermaidContent = content.slice(mermaidStartPos + 3, nextCodeEnd).trim();
    const key = `mermaid-${idGenerator()}`;
    finalSlots.push({
      id: key,
      media_type: 'mermaid',
      data: { value: mermaidContent }
    } as Slot);
    result += `![](blockview://${key})`;
    currentPos = nextCodeEnd + 3;
    inMermaidBlock = false;
    continue;
  }

  // 如果没有找到任何标记，说明处理完了
  if (nextMermaidStart === -1 && nextCodeEnd === -1) {
    // 如果还在 mermaid 块内，保持原样
    if (inMermaidBlock) {
      result += content.slice(currentPos);
    } else {
      result += content.slice(currentPos);
    }
    break;
  }

  // 移动当前位置
  currentPos = Math.min(
    nextMermaidStart === -1 ? Infinity : nextMermaidStart,
    nextCodeEnd === -1 ? Infinity : nextCodeEnd
  );
}

content = result;