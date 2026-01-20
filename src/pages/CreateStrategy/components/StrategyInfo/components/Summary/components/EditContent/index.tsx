import styled from 'styled-components'
import { Dispatch, SetStateAction, ChangeEvent, useCallback, memo, useMemo } from 'react'

const EditContentWrapper = styled.div`
  display: flex;
  width: 100%;
`

const ContentText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black200};
  white-space: pre-wrap;
  word-break: break-word;
`

const ContentLine = styled.div`
  &:last-child {
    margin-bottom: 0;
  }
`

const ContentKey = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  color: ${({ theme }) => theme.black200};
`

const ContentValue = styled.span`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  color: ${({ theme }) => theme.black0};
`

const NestedContent = styled.div`
  margin-left: 16px;
`

const JsonTextarea = styled.textarea`
  width: 100%;
  min-height: 60px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black100};
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: 0;
  /* @ts-ignore */
  field-sizing: content;
  &::placeholder {
    color: ${({ theme }) => theme.black300};
  }
`

type FormattedItem = {
  key: string
  value: string | FormattedItem[]
  isNested: boolean
}

// 递归格式化对象为 key: value 的形式（用于只读展示）
const formatObject = (obj: Record<string, unknown>): FormattedItem[] => {
  return Object.entries(obj).map(([key, value]) => {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return {
        key,
        value: formatObject(value as Record<string, unknown>),
        isNested: true,
      }
    }
    if (Array.isArray(value)) {
      return {
        key,
        value: value.map((item, index) => {
          if (item !== null && typeof item === 'object') {
            return {
              key: `[${index}]`,
              value: formatObject(item as Record<string, unknown>),
              isNested: true,
            }
          }
          return {
            key: `[${index}]`,
            value: String(item),
            isNested: false,
          }
        }),
        isNested: true,
      }
    }
    return {
      key,
      value: String(value),
      isNested: false,
    }
  })
}

// 格式化 JSON 字符串用于只读展示
const formatJsonForDisplay = (content: string): FormattedItem[] | null => {
  try {
    const parsed = JSON.parse(content)
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return formatObject(parsed)
    }
    return null
  } catch {
    return null
  }
}

// 递归格式化值，去掉所有 {} 和 []
const formatValueWithoutBrackets = (value: unknown, indent: number = 0): string => {
  const indentStr = '    '.repeat(indent)
  const nextIndentStr = '    '.repeat(indent + 1)

  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    // 数组：每个元素一行，不显示 []
    if (value.length === 0) return ''
    return value
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          return formatValueWithoutBrackets(item, indent)
        }
        return formatValueWithoutBrackets(item, indent)
      })
      .join(',\n' + indentStr)
  }

  if (typeof value === 'object') {
    // 对象：每个键值对一行，不显示 {}
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return ''
    return entries
      .map(([key, val]) => {
        const formattedVal = formatValueWithoutBrackets(val, indent + 1)
        // 如果值是对象或数组（多行），换行显示
        if (
          typeof val === 'object' &&
          val !== null &&
          (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0)
        ) {
          return `"${key}":\n${nextIndentStr}${formattedVal}`
        }
        return `"${key}": ${formattedVal}`
      })
      .join(',\n' + indentStr)
  }

  return String(value)
}

// 格式化 JSON 字符串用于编辑（去掉所有 {} 和 [] 括号）
const formatJsonForEdit = (content: string): string => {
  try {
    const parsed = JSON.parse(content)
    return formatValueWithoutBrackets(parsed, 0)
  } catch {
    return content
  }
}

// 尝试修复常见的 JSON 格式错误
const tryFixJson = (content: string): string => {
  let fixed = content

  // 1. 移除尾随逗号 (在 } 或 ] 前面的逗号)
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1')

  // 2. 单引号改为双引号
  fixed = fixed.replace(/'/g, '"')

  // 3. 没有引号的 key 加上双引号 (匹配 key: 的形式)
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3')

  // 4. 修复没有引号的字符串值 (简单场景)
  // 匹配 : 后面跟着非数字、非布尔、非 null、非对象、非数组的值
  fixed = fixed.replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*([,}\]])/g, (match, value, ending) => {
    // 保留布尔值和 null
    if (value === 'true' || value === 'false' || value === 'null') {
      return match
    }
    return `: "${value}"${ending}`
  })

  return fixed
}

// 解析单个值
const parseJsonValue = (value: string): unknown => {
  const trimmed = value.trim().replace(/,$/, '') // 移除尾部逗号
  if (!trimmed) return ''

  // 尝试作为 JSON 值解析
  try {
    return JSON.parse(trimmed)
  } catch {
    // 如果是没有引号的字符串，返回原值
    return trimmed
  }
}

// 智能重建 JSON：根据缩进结构将去掉括号的内容恢复为有效 JSON
const rebuildJsonFromIndent = (content: string): string => {
  const lines = content.split('\n')
  const result: Record<string, unknown> = {}

  let currentKey: string | null = null
  let currentValues: string[] = []

  const saveCurrentKey = () => {
    if (currentKey !== null && currentValues.length > 0) {
      if (currentValues.length === 1) {
        // 单个值
        result[currentKey] = parseJsonValue(currentValues[0])
      } else {
        // 多个值 -> 数组
        result[currentKey] = currentValues.map((v) => parseJsonValue(v))
      }
    }
  }

  for (const line of lines) {
    if (!line.trim()) continue

    const trimmed = line.trim()

    // 匹配 "key": 或 "key": value 格式
    const keyMatch = trimmed.match(/^"([^"]+)":\s*(.*)$/)

    if (keyMatch) {
      // 找到新的 key
      saveCurrentKey()

      currentKey = keyMatch[1]
      const valueAfterColon = keyMatch[2].trim()
      currentValues = []

      if (valueAfterColon) {
        // 值在同一行，如 "key": "value" 或 "key": 123
        currentValues.push(valueAfterColon)
      }
    } else if (currentKey !== null) {
      // 不是 key 行，检查是否是当前 key 的值（缩进更深或等于）
      // 这是数组元素或者嵌套内容
      currentValues.push(trimmed)
    }
  }

  // 保存最后一个 key
  saveCurrentKey()

  return JSON.stringify(result)
}

// 压缩 JSON 字符串，如果格式错误则尝试修复
// 由于编辑时去掉了所有括号，这里需要智能补回
const compressJson = (content: string): string => {
  const trimmed = content.trim()

  // 1. 先尝试直接解析（可能用户手动加了括号，或者是有效 JSON）
  try {
    const parsed = JSON.parse(trimmed)
    return JSON.stringify(parsed)
  } catch {
    // 解析失败，继续尝试
  }

  // 2. 使用智能重建（根据缩进识别数组）
  try {
    const rebuilt = rebuildJsonFromIndent(trimmed)
    const parsed = JSON.parse(rebuilt)
    return JSON.stringify(parsed)
  } catch {
    // 智能重建失败
  }

  // 3. 尝试简单包裹 {}
  try {
    const wrapped = `{${trimmed}}`
    const parsed = JSON.parse(wrapped)
    return JSON.stringify(parsed)
  } catch {
    // 包裹为对象失败
  }

  // 4. 尝试修复后包裹
  try {
    const fixed = tryFixJson(`{${trimmed}}`)
    const parsed = JSON.parse(fixed)
    return JSON.stringify(parsed)
  } catch {
    // 修复失败
  }

  // 5. 尝试作为数组内容包裹 []
  try {
    const wrapped = `[${trimmed}]`
    const parsed = JSON.parse(wrapped)
    return JSON.stringify(parsed)
  } catch {
    // 包裹为数组失败
  }

  // 6. 修复失败，返回原内容
  return content
}

// 递归渲染格式化后的内容（只读模式）
const RenderFormattedContent = ({ items }: { items: FormattedItem[] }) => {
  return (
    <>
      {items.map((item, index) => (
        <ContentLine className='content-line' key={index}>
          {item.isNested ? (
            <>
              <ContentKey>{item.key}:</ContentKey>
              <NestedContent>
                <RenderFormattedContent items={item.value as FormattedItem[]} />
              </NestedContent>
            </>
          ) : (
            <>
              <ContentKey>{item.key}:</ContentKey> <ContentValue>{item.value as string}</ContentValue>
            </>
          )}
        </ContentLine>
      ))}
    </>
  )
}

export default memo(function EditContent({
  content,
  isEdit,
  updateContent,
}: {
  content: string
  isEdit: boolean
  updateContent: Dispatch<SetStateAction<string>>
}) {
  // 编辑时显示格式化的 JSON
  const editableContent = useMemo(() => formatJsonForEdit(content), [content])
  // 只读时显示的格式化内容
  const displayContent = useMemo(() => formatJsonForDisplay(content), [content])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      // 保存时压缩 JSON
      updateContent(compressJson(e.target.value))
    },
    [updateContent],
  )

  if (isEdit) {
    return (
      <EditContentWrapper>
        <JsonTextarea defaultValue={editableContent} onBlur={handleChange} placeholder='"key": "value"' />
      </EditContentWrapper>
    )
  }

  return (
    <EditContentWrapper>
      {displayContent ? (
        <ContentText>
          <RenderFormattedContent items={displayContent} />
        </ContentText>
      ) : (
        <ContentText>{content}</ContentText>
      )}
    </EditContentWrapper>
  )
})
