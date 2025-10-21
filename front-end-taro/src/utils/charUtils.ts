export const isChineseChar = (char) => {
  // 基本汉字范围：0x4E00-0x9FFF
  // 扩展汉字范围：0x3400-0x4DBF, 0x20000-0x2A6DF, 0x2A700-0x2B73F等
  const code = char.charCodeAt(0);
  return (code >= 0x4E00 && code <= 0x9FFF) ||
    (code >= 0x3400 && code <= 0x4DBF);
}