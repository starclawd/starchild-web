/**
 * Babel 插件：为 JSX 元素注入源码位置信息
 * 仅在开发环境下使用，用于 DevInspector 组件定位源码
 */

const t = require('@babel/types')

module.exports = function babelPluginDevInspector() {
  return {
    name: 'babel-plugin-dev-inspector',
    visitor: {
      JSXOpeningElement(path, state) {
        const { filename } = state
        if (!filename) return

        // 跳过 DevInspector 组件本身
        if (filename.includes('DevInspector')) return

        // 跳过 node_modules
        if (filename.includes('node_modules')) return

        // 获取位置信息
        const { line, column } = path.node.loc?.start || {}
        if (!line) return

        // 检查是否已经有 data-inspector 属性（避免重复注入）
        const hasInspectorAttr = path.node.attributes.some(
          (attr) =>
            attr.type === 'JSXAttribute' &&
            attr.name?.name?.toString().startsWith('data-inspector'),
        )
        if (hasInspectorAttr) return

        // 获取相对路径（从 src 开始）
        const srcIndex = filename.indexOf('/src/')
        const relativePath = srcIndex !== -1 ? filename.slice(srcIndex + 1) : filename

        // 添加 data-inspector-file 属性
        path.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('data-inspector-file'), t.stringLiteral(filename)),
        )

        // 添加 data-inspector-line 属性
        path.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('data-inspector-line'), t.stringLiteral(String(line))),
        )

        // 添加 data-inspector-column 属性
        path.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('data-inspector-column'), t.stringLiteral(String(column))),
        )

        // 添加 data-inspector-path 属性（用于显示）
        path.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('data-inspector-path'), t.stringLiteral(relativePath)),
        )
      },
    },
  }
}
