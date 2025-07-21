export const handleGenerationMsg = (generationMsg: string) => {
  try {
    const list = JSON.parse(generationMsg) || []
    const expandedList: any[] = []

    list.forEach((item: string) => {
      if (item.startsWith('{') && item.endsWith('}')) {
        // Handle string-wrapped object like "{'key': 'value'}"
        try {
          // Replace single quotes with double quotes for valid JSON
          const jsonStr = item.replace(/'/g, '"')
          const parsedItem = JSON.parse(jsonStr)

          // 如果是 TodoWrite，展开每个 todo 为独立的消息项
          if (parsedItem.tool_name === 'TodoWrite' && parsedItem.tool_input?.todos) {
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
