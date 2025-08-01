export const handleGenerationMsg = (generationMsg: string) => {
  try {
    const list = JSON.parse(generationMsg) || []
    const expandedList: any[] = []
    list.forEach((item: string, index: number) => {
      if (item.startsWith('{') && item.endsWith('}')) {
        // Handle string-wrapped object like "{'key': 'value'}"
        try {
          // Replace single quotes with double quotes for valid JSON
          const lastItem = expandedList[expandedList.length - 1]
          const jsonStr = item.replace(/'/g, '"')
          const parsedItem = JSON.parse(jsonStr)
          if (parsedItem.type === 'tool_result' && lastItem.tool_name === 'LS') {
            return
          }
          if (parsedItem.content.includes('.py')) {
            return
          }
          if (parsedItem.tool_name === 'TodoWrite' && parsedItem.tool_input?.todos) {
            // 如果是 TodoWrite，展开每个 todo 为独立的消息项
            parsedItem.tool_input.todos.forEach((todo: any) => {
              expandedList.push({
                type: 'todo_item',
                content: todo.content,
                status: todo.status,
                id: todo.id,
              })
            })
          } else {
            expandedList.push(parsedItem)
          }
        } catch {
          expandedList.push(item)
        }
      } else if (item.startsWith('##')) {
        // Handle markdown format
        expandedList.push({
          type: 'markdown',
          content: item,
        })
      } else {
        if (item && item.includes('#!/usr/bin/env')) {
          item = item.split('#!/usr/bin/env')[0].replace('\n\n```python\n', '')
        }
        if (item && (item.includes('```json\n{\n  "code"') || item.includes('```json\n{  \n  "code"'))) {
          item = item.split('```json\n{\n  "code"')[0]
          item = item.split('```json\n{  \n  "code"')[0]
        }
        if (item && item.includes('.py')) {
          return
        }
        if (!item) {
          return
        }
        // Handle plain string
        expandedList.push({
          type: 'text',
          content: item,
        })
      }
    })

    return expandedList
  } catch (error) {
    return []
  }
}
