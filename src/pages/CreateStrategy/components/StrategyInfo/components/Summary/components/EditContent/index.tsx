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

// 格式化 JSON 字符串用于编辑（带缩进）
const formatJsonForEdit = (content: string): string => {
  try {
    const parsed = JSON.parse(content)
    return JSON.stringify(parsed, null, 4)
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

// 压缩 JSON 字符串，如果格式错误则尝试修复
const compressJson = (content: string): string => {
  // 先尝试直接解析
  try {
    const parsed = JSON.parse(content)
    return JSON.stringify(parsed)
  } catch {
    // 解析失败，尝试修复
  }

  // 尝试修复后再解析
  try {
    const fixed = tryFixJson(content)
    const parsed = JSON.parse(fixed)
    return JSON.stringify(parsed)
  } catch {
    // 修复失败，返回原内容
    return content
  }
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
        <JsonTextarea defaultValue={editableContent} onBlur={handleChange} placeholder='{\n  "key": "value"\n}' />
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
