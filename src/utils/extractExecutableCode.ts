export const extractExecutableCode = (codeContent: string) => {
  if (!codeContent || typeof codeContent !== 'string') return ''

  // 首先检查是否是 markdown 代码块格式
  const codeBlockRegex = /```[\w]*\n?([\s\S]*?)```/g
  const matches = codeContent.match(codeBlockRegex)

  if (matches && matches.length > 0) {
    // 提取第一个代码块的内容
    const firstMatch = matches[0]
    // 去掉开头的```language和结尾的```
    const cleanCode = firstMatch
      .replace(/^```[\w]*\n?/, '') // 去掉开头的```和语言标识
      .replace(/```$/, '') // 去掉结尾的```
      .trim()
    return cleanCode
  }

  // 如果不是 markdown 格式，检查是否包含转义的换行符
  if (codeContent.includes('\\n')) {
    // 将转义的换行符转换为实际的换行符
    return codeContent
      .replace(/\\n/g, '\n') // 转义的换行符
      .replace(/\\t/g, '\t') // 转义的制表符
      .replace(/\\r/g, '\r') // 转义的回车符
      .replace(/\\"/g, '"') // 转义的双引号
      .replace(/\\'/g, "'") // 转义的单引号
      .replace(/\\\\/g, '\\') // 转义的反斜杠
  }

  // 其他情况直接返回原内容
  return codeContent
}
