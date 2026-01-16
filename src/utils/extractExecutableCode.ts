/**
 * 提取可执行代码
 * 支持多种代码格式：
 * 1. Markdown 代码块 (```python ... ```)
 * 2. 转义的字符串格式 (\n, \t 等)
 * 3. 新版代码生成格式 (带 CONFIG, fetch_data, analyze 结构)
 * 4. 原始 Python 代码
 */
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

/**
 * 检测代码是否为新版代码生成格式
 * 新版格式特征：
 * 1. 包含 CONFIG 字典配置
 * 2. 包含 fetch_data() 函数
 * 3. 包含 analyze() 函数
 * 4. 使用新的信号返回格式 (proximity, state, content)
 */
export const isNewCodeFormat = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false

  const hasConfig = code.includes('CONFIG = {') || code.includes('CONFIG={')
  const hasFetchData = code.includes('def fetch_data(') || code.includes('def fetch_data (')
  const hasAnalyze = code.includes('def analyze(') || code.includes('def analyze (')
  const hasProximity = code.includes('"proximity":') || code.includes("'proximity':")
  const hasState = code.includes('"state":') || code.includes("'state':")

  // 新版格式至少需要 CONFIG + analyze，或者有 proximity/state 返回
  return (hasConfig && hasAnalyze) || (hasProximity && hasState) || (hasFetchData && hasAnalyze)
}

/**
 * 提取策略代码的关键部分信息
 * 用于快速预览和摘要显示
 */
export interface CodeSummary {
  name: string
  type: 'new_format' | 'legacy_format' | 'unknown'
  hasConfig: boolean
  hasFetchData: boolean
  hasAnalyze: boolean
  timeframe?: string
  symbol?: string
  entryLogic?: string
  exitLogic?: string
}

export const extractCodeSummary = (code: string): CodeSummary => {
  const cleanCode = extractExecutableCode(code)

  const summary: CodeSummary = {
    name: 'Unknown Strategy',
    type: 'unknown',
    hasConfig: false,
    hasFetchData: false,
    hasAnalyze: false,
  }

  if (!cleanCode) return summary

  // 检测格式类型
  summary.hasConfig = cleanCode.includes('CONFIG = {') || cleanCode.includes('CONFIG={')
  summary.hasFetchData = cleanCode.includes('def fetch_data(')
  summary.hasAnalyze = cleanCode.includes('def analyze(')

  if (isNewCodeFormat(cleanCode)) {
    summary.type = 'new_format'
  } else if (cleanCode.includes('def ') || cleanCode.includes('import ')) {
    summary.type = 'legacy_format'
  }

  // 提取策略名称
  const nameMatch = cleanCode.match(/"name":\s*"([^"]+)"/) || cleanCode.match(/'name':\s*'([^']+)'/)
  if (nameMatch) {
    summary.name = nameMatch[1]
  }

  // 提取 timeframe
  const timeframeMatch = cleanCode.match(/"timeframe":\s*"([^"]+)"/) || cleanCode.match(/'timeframe':\s*'([^']+)'/)
  if (timeframeMatch) {
    summary.timeframe = timeframeMatch[1]
  }

  // 提取 symbol
  const symbolMatch =
    cleanCode.match(/"signal_symbol":\s*"([^"]+)"/) ||
    cleanCode.match(/"trading_symbol":\s*"([^"]+)"/) ||
    cleanCode.match(/'signal_symbol':\s*'([^']+)'/)
  if (symbolMatch) {
    summary.symbol = symbolMatch[1]
  }

  // 提取入场/出场逻辑 (从 docstring)
  const docstringMatch = cleanCode.match(/"""([\s\S]*?)"""/)
  if (docstringMatch) {
    const docstring = docstringMatch[1]
    const entryMatch = docstring.match(/Entry[:\s]*(.*?)(?=Exit|$)/i)
    const exitMatch = docstring.match(/Exit[:\s]*(.*?)(?=Timeframe|Data|$)/i)

    if (entryMatch) summary.entryLogic = entryMatch[1].trim()
    if (exitMatch) summary.exitLogic = exitMatch[1].trim()
  }

  return summary
}
